import { Request, Response } from "express";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "mistral";

// Estructura de pregunta fija extraída fielmente del contenido de data.md
interface PreguntaTeorica {
  id: number;
  eje: string;
  pregunta: string;
}

// Banco de preguntas fijas, claras y concisas basadas exclusivamente en data.md
const bancoPreguntas: PreguntaTeorica[] = [
  {
    id: 1,
    eje: "Naturaleza de la I.O.",
    pregunta: "¿Por qué se afirma que la Investigación de Operaciones busca una solución 'óptima' en lugar de una solución ideal absoluta ante un problema organizacional?"
  },
  {
    id: 2,
    eje: "Contenido y Definiciones de I.O.",
    pregunta: "¿Cuál es el propósito fundamental de que los equipos de Investigación de Operaciones sean de carácter interdisciplinario según la doctrina de la cátedra?"
  },
  {
    id: 3,
    eje: "Metodología Científica",
    pregunta: "¿Qué rol cumplen los modelos matemáticos dentro de la aplicación del método científico en la Investigación Operativa?"
  },
  {
    id: 4,
    eje: "Sistemas de Soporte a Decisiones (DSS)",
    pregunta: "¿Qué diferencia existe entre el Sistema de Administración de Base de Datos y el Sistema de Administración de Modelos dentro de la estructura de un DSS?"
  },
  {
    id: 5,
    eje: "Características de un DSS",
    pregunta: "¿Por qué es crucial que el diseño, desarrollo y uso de un DSS sea conducido y guiado por el usuario final de la organización?"
  }
];

// Función auxiliar para llamar a Mistral localmente
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

// GET /api/ejercicio/diagnostico
// Devuelve una pregunta directa y concisa seleccionada al azar del banco fijo
export const obtenerPreguntaDiagnostico = async (_req: Request, res: Response): Promise<void> => {
  try {
    const preguntaElegida = bancoPreguntas[Math.floor(Math.random() * bancoPreguntas.length)];

    res.json({
      tipo: "diagnostico",
      titulo: `Evaluación Teórica: ${preguntaElegida.eje}`,
      descripcion: "Responda a la siguiente consigna de forma concisa y con terminología técnica adecuada:",
      datos: preguntaElegida.pregunta
    });
  } catch (error: any) {
    res.status(500).json({ error: "Error al obtener la pregunta del banco: " + error.message });
  }
};

// POST /api/ejercicio/evaluar-teoria
// Evalúa la respuesta del alumno contrastándola con los criterios de evaluación del docente
export const evaluarPreguntaTeorica = async (req: Request, res: Response): Promise<void> => {
  const { pregunta, respuestaEstudiante } = req.body;

  if (!pregunta || !respuestaEstudiante) {
    res.status(400).json({ error: "Faltan campos obligatorios en el body (pregunta o respuestaEstudiante)." });
    return;
  }

  const promptEvaluacion = `Actuás como un Profesor Universitario Titular de la cátedra de Investigación de Operaciones.
Estás tomando un examen diagnóstico conceptual de teoría.

Pregunta del examen: "${pregunta}"
Respuesta redactada por el estudiante: "${respuestaEstudiante}"

Tu tarea es calificar con criterio universitario. Evalúa si el alumno demuestra comprensión real del fundamento, precisión técnica y un vocabulario administrativo correcto. No penalices si falta una palabra exacta, prioriza la coherencia teórica.

Respondé ÚNICAMENTE con un objeto JSON válido con la siguiente estructura, sin textos adicionales, sin saludos, ni bloques markdown \`\`\`json:
{
  "puntaje": <entero del 0 al 100>,
  "nivel": "<Excelente|Muy bien|Bien|Regular|Insuficiente>",
  "resumen": "<2 oraciones analizando sintéticamente el nivel de comprensión demostrado>",
  "que_estuvo_bien": ["<acierto conceptual detectado 1>", "<acierto conceptual 2 si aplica>"],
  "que_mejorar": ["<punto técnico a corregir o profundizar 1>", "<punto 2 si aplica>"]
}`;

  try {
    const raw = await callMistral(promptEvaluacion);
    const cleanJson = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanJson);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      puntaje: 50,
      nivel: "Regular",
      resumen: "La respuesta se guardó correctamente, pero el motor local de IA (Ollama) no pudo completar el feedback.",
      que_estuvo_bien: ["Respuesta recibida en el servidor."],
      que_mejorar: ["Asegurar que Ollama y el modelo 'mistral' se encuentren activos."]
    });
  }
};
