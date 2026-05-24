import { Request, Response } from "express";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "mistral";

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

async function callMistral(prompt: string): Promise<string> {
  const res = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, prompt, stream: false }),
  });

  if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
  const data = (await res.json()) as { response: string };
  return data.response || "";
}

export const evaluarResolucion = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { tipo, escenario, resolucion }: EvaluarBody = req.body;

  if (!tipo || !escenario || !resolucion) {
    res.status(400).json({ error: "Se requieren: tipo, escenario y resolucion" });
    return;
  }

  const prompt = `Sos un profesor experto en Investigación de Operaciones y Programación Lineal.
Un estudiante resolvió el siguiente escenario de problema de ${tipo}.

=== ESCENARIO ===
Título: ${escenario.titulo}
${escenario.descripcion}

Datos:
${escenario.datos}

=== RESOLUCIÓN DEL ESTUDIANTE ===
${resolucion}

=== TAREA ===
Evaluá la resolución del estudiante. Analizá:
1. Variables de decisión: ¿están bien definidas? ¿tienen notación correcta? ¿representan lo que se debe decidir?
2. Función objetivo: ¿es correcta (minimizar/maximizar)? ¿usa las variables definidas? ¿los coeficientes son correctos?
3. Restricciones: ¿están todas las restricciones necesarias? ¿son matemáticamente correctas? ¿falta alguna (no negatividad, oferta, demanda, capacidad)?

Respondé ÚNICAMENTE con un objeto JSON válido sin texto adicional ni markdown:
{
  "puntaje": <entero del 0 al 100>,
  "nivel": "<Excelente|Muy bien|Bien|Regular|Insuficiente>",
  "variables_decision": {
    "correcto": <true|false>,
    "comentario": "<evaluación específica de las variables>"
  },
  "funcion_objetivo": {
    "correcto": <true|false>,
    "comentario": "<evaluación específica de la función objetivo>"
  },
  "restricciones": {
    "correcto": <true|false>,
    "comentario": "<evaluación específica de las restricciones>"
  },
  "que_mejorar": ["<punto 1>", "<punto 2>", "<punto 3 si aplica>"],
  "que_estuvo_bien": ["<punto 1>", "<punto 2>"],
  "resumen": "<2-3 oraciones resumiendo la evaluación general>"
}`;

  try {
    const raw = await callMistral(prompt);
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Mistral no devolvió JSON válido");

    const result: EvaluacionResult = JSON.parse(match[0]);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: `Error al evaluar: ${String(e)}` });
  }
};
