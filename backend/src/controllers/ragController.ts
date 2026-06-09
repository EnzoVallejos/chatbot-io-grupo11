import { Request, Response } from "express";
import * as fs from "fs";
import * as path from "path";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "gemma4:e4b";
const CHUNKS_PATH = path.join(__dirname, "io_rag_chunks.json");
const TOP_K = 4;

// ── Tipos ────────────────────────────────────────────────────────────────────

interface Chunk {
  id: string;
  content: string;
  metadata: {
    section: string;
    topic: string;
    subtopic: string;
    keywords: string[];
    difficulty_level: string;
    concept_type: string;
    related_chunks: string[];
  };
}

interface ChunksFile {
  corpus: { title: string; description: string; language: string; total_chunks: number };
  chunks: Chunk[];
}

// ── Carga de chunks ──────────────────────────────────────────────────────────

let chunksCache: Chunk[] | null = null;

function loadChunks(): Chunk[] {
  if (chunksCache) return chunksCache;
  const raw = fs.readFileSync(CHUNKS_PATH, "utf-8");
  const data: ChunksFile = JSON.parse(raw);
  chunksCache = data.chunks;
  return chunksCache;
}

// ── Retrieval por similitud léxica (TF-IDF simplificado) ────────────────────
// Sin dependencias externas: tokeniza, pesa términos y rankea por overlap.

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // quita tildes
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(t => t.length > 2);
}

// Stopwords del español para reducir ruido
const STOPWORDS = new Set([
  "que", "los", "las", "del", "una", "con", "por", "para", "sus", "son",
  "como", "pero", "más", "este", "esta", "estos", "estas", "también",
  "sobre", "entre", "cada", "cual", "cuando", "donde", "tiene", "pueden",
  "debe", "deben", "solo", "sin", "ser", "hay", "sus", "fue", "han",
  "todo", "toda", "todos", "todas", "muy", "bien", "puede", "dicho"
]);

function getTerms(text: string): Map<string, number> {
  const tokens = tokenize(text).filter(t => !STOPWORDS.has(t));
  const freq = new Map<string, number>();
  for (const t of tokens) freq.set(t, (freq.get(t) ?? 0) + 1);
  return freq;
}

function score(query: Map<string, number>, chunk: Chunk): number {
  // Concatena content + keywords + section para búsqueda
  const chunkText = [
    chunk.content,
    chunk.metadata.keywords.join(" "),
    chunk.metadata.section,
    chunk.metadata.topic,
    chunk.metadata.subtopic,
  ].join(" ");

  const chunkTerms = getTerms(chunkText);
  let hits = 0;
  let weightedHits = 0;

  for (const [term, qfreq] of query) {
    if (chunkTerms.has(term)) {
      hits++;
      // Bonus si el término aparece en keywords (más relevante)
      const inKeyword = chunk.metadata.keywords.some(k =>
        tokenize(k).includes(term)
      );
      weightedHits += qfreq * (inKeyword ? 2 : 1) * (chunkTerms.get(term)!);
    }
  }

  // Penaliza chunks sin hits para no devolver basura
  if (hits === 0) return 0;
  // Normaliza por longitud del chunk para no favorecer solo los más largos
  const chunkLen = Math.max(chunkTerms.size, 1);
  return weightedHits / Math.sqrt(chunkLen);
}

function retrieve(pregunta: string, topK: number = TOP_K): Chunk[] {
  const chunks = loadChunks();
  const queryTerms = getTerms(pregunta);

  const scored = chunks
    .map(c => ({ chunk: c, score: score(queryTerms, c) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score);

  // Toma top-K y agrega sus related_chunks si no están ya incluidos
  const topChunks = scored.slice(0, topK).map(x => x.chunk);
  const includedIds = new Set(topChunks.map(c => c.id));

  for (const chunk of [...topChunks]) {
    for (const relId of chunk.metadata.related_chunks) {
      if (!includedIds.has(relId) && topChunks.length < topK + 2) {
        const rel = chunks.find(c => c.id === relId);
        if (rel) { topChunks.push(rel); includedIds.add(relId); }
      }
    }
  }

  return topChunks.slice(0, topK + 2);
}

// ── Llamada al modelo ────────────────────────────────────────────────────────

async function callOllama(prompt: string): Promise<string> {
  const res = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, prompt, stream: false, think: false }),
  });
  if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
  const data = (await res.json()) as { response: string };
  return data.response?.trim() ?? "";
}

function buildPrompt(pregunta: string, chunks: Chunk[]): string {
  const contexto = chunks
    .map((c, i) => `[${i + 1}] (${c.metadata.section})\n${c.content}`)
    .join("\n\n");

  return `/no_think
Eres un asistente experto en Investigación de Operaciones para estudiantes universitarios. Responde la pregunta del estudiante usando ÚNICAMENTE el contexto provisto. Si la respuesta no está en el contexto, indicalo claramente. Sé preciso, claro y usa terminología técnica correcta. Responde en español.

CONTEXTO:
${contexto}

PREGUNTA DEL ESTUDIANTE:
${pregunta}

RESPUESTA:`;
}

// ── Handler ──────────────────────────────────────────────────────────────────

interface RagBody { pregunta?: string; }

export async function consultarRAG(req: Request, res: Response): Promise<void> {
  const { pregunta } = (req.body ?? {}) as RagBody;

  if (!pregunta?.trim()) {
    res.status(400).json({ error: "La pregunta está vacía." });
    return;
  }

  try {
    const chunksRelevantes = retrieve(pregunta);

    if (chunksRelevantes.length === 0) {
      res.json({
        respuesta: "No encontré información relevante en el material de la materia para responder esa pregunta.",
        fuentes: [],
      });
      return;
    }

    const prompt = buildPrompt(pregunta, chunksRelevantes);
    const respuesta = await callOllama(prompt);

    res.json({
      respuesta,
      fuentes: chunksRelevantes.map(c => ({
        id: c.id,
        seccion: c.metadata.section,
        preview: c.content.slice(0, 120) + (c.content.length > 120 ? "..." : ""),
      })),
    });
  } catch (e) {
    console.error("Error en consultarRAG:", e);
    res.status(503).json({
      error: "No se pudo conectar con Ollama. Verificá que esté corriendo con el modelo gemma4:e4b.",
    });
  }
}
