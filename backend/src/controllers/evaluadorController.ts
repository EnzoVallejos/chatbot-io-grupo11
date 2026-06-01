import { Request, Response } from "express";
import { escenarios } from "./escenarioController";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "gemma4:e4b";

export interface EvaluarBody {
  tipo: string;
  escenario: {
    titulo: string;
    descripcion: string;
    datos: string;
  };
  resolucion: string;
}

export interface EvaluacionResult {
  puntaje: number;
  nivel: string;
  variables_decision: { correcto: boolean; comentario: string };
  funcion_objetivo: { correcto: boolean; comentario: string };
  restricciones: { correcto: boolean; comentario: string };
  que_mejorar: string[];
  que_estuvo_bien: string[];
  resumen: string;
}

async function callModel(prompt: string): Promise<string> {
  const res = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, prompt, stream: false, think: false }),
  });
  if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
  const data = (await res.json()) as { response: string };
  return data.response || "";
}

function extractJSON(raw: string): string | null {
  const fenced = raw.match(/```json\s*([\s\S]*?)```/i);
  if (fenced) return fenced[1].trim();
  const code = raw.match(/```\s*([\s\S]*?)```/);
  if (code) return code[1].trim();
  let depth = 0, start = -1;
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] === "{") { if (depth === 0) start = i; depth++; }
    else if (raw[i] === "}") { depth--; if (depth === 0 && start !== -1) return raw.slice(start, i + 1); }
  }
  return null;
}

function findResolucionSugerida(tipo: string, titulo: string): string | null {
  const lista = escenarios[tipo];
  if (!lista) return null;
  const found = lista.find(e => e.titulo === titulo);
  return found?.resolucion_sugerida ?? null;
}

function buildPrompt(
  tipo: string,
  escenario: { titulo: string; descripcion: string; datos: string },
  resolucionSugerida: string,
  resolucion: string
): string {
  return `/no_think
Eres un evaluador experto en Investigación de Operaciones. Compara la resolución del estudiante con la de referencia en Programación Lineal. Evalúa: Variables (30pts), Función Objetivo (30pts) y Restricciones (40pts). Acepta notaciones equivalentes. Penaliza solo errores conceptuales o coeficientes incorrectos.

TIPO: ${tipo}
TÍTULO: ${escenario.titulo}

<descripcion>${escenario.descripcion}</descripcion>
<datos>${escenario.datos}</datos>
<referencia>${resolucionSugerida}</referencia>
<estudiante>${resolucion}</estudiante>

REGLAS DE FORMATO CRÍTICAS:
1. Responde SÓLO con un objeto JSON válido, sin markdown ni texto extra.
2. PROHIBIDO usar símbolos de LaTeX, barras invertidas (\), expresiones como \le, \sum o \text. Usa texto plano o símbolos estándar (<=, >=, =, sumatoria).
3. Todo el texto de los comentarios debe ir en UNA SOLA LÍNEA continua. No uses saltos de línea (enter) dentro de los valores de texto.

{
  "puntaje": <0-100>,
  "nivel": "<Excelente|Muy bien|Bien|Regular|Insuficiente>",
  "evaluacion_variables": { "nota": "<comentario corto en una linea>" },
  "evaluacion_fo": { "nota": "<comentario corto en una linea>" },
  "evaluacion_restricciones": { "nota": "<comentario corto en una linea>" },
  "mejoras": ["<item sin latex>"],
  "aciertos": ["<item sin latex>"],
  "resumen": "<resumen en una linea sin latex>"
}`;
}

function fallbackResult(motivo: string): EvaluacionResult {
  return {
    puntaje: 0,
    nivel: "Sin evaluar",
    variables_decision: { correcto: false, comentario: "No se pudo evaluar." },
    funcion_objetivo:   { correcto: false, comentario: "No se pudo evaluar." },
    restricciones:      { correcto: false, comentario: "No se pudo evaluar." },
    que_mejorar: ["Intentá de nuevo o reformateá tu respuesta."],
    que_estuvo_bien: [],
    resumen: `Error interno: ${motivo}`,
  };
}

export const evaluarResolucion = async (req: Request, res: Response): Promise<void> => {
  const { tipo, escenario, resolucion }: EvaluarBody = req.body;

  if (!tipo || !escenario || !resolucion) {
    res.status(400).json({ error: "Se requieren: tipo, escenario y resolucion" });
    return;
  }

  const resolucionSugerida = findResolucionSugerida(tipo, escenario.titulo);
  if (!resolucionSugerida) {
    res.status(404).json({ error: `No se encontró resolución de referencia para: "${escenario.titulo}"` });
    return;
  }

  try {
    const prompt = buildPrompt(tipo, escenario, resolucionSugerida, resolucion);
    const raw = await callModel(prompt);

    console.log("--- RAW MODEL OUTPUT ---");
    console.log(raw);
    console.log("------------------------");

    const jsonStr = extractJSON(raw);
    if (!jsonStr) {
      console.error("No se encontró JSON en la respuesta.");
      res.status(200).json(fallbackResult("El modelo no devolvió JSON válido."));
      return;
    }

    let result: EvaluacionResult;
    try {
      result = JSON.parse(jsonStr);
    } catch {
      console.error("JSON malformado:", jsonStr);
      res.status(200).json(fallbackResult("JSON malformado en la respuesta del modelo."));
      return;
    }

    res.status(200).json(result);
  } catch (e) {
    console.error("Error en evaluarResolucion:", e);
    res.status(500).json({ error: `Error al conectarse con Ollama: ${String(e)}` });
  }
};
