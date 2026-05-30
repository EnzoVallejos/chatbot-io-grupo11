import { Request, Response } from "express";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "gemma4:e4b";

interface PreguntaTeorica {
  id: number;
  eje: string;
  pregunta: string;
  respuestaReferencia: string;
}

const bancoPreguntas: PreguntaTeorica[] = [
  {
    id: 1,
    eje: "Naturaleza de la I.O.",
    pregunta: "¿Por qué se afirma que la Investigación de Operaciones busca una solución 'óptima' en lugar de una solución ideal absoluta ante un problema organizacional?",
    respuestaReferencia: "Porque en sistemas reales existen restricciones de recursos, tiempo e información que impiden alcanzar un ideal absoluto. La I.O. busca la mejor solución posible dentro de esas limitaciones, maximizando o minimizando una función objetivo bajo las condiciones del problema real."
  },
  {
    id: 2,
    eje: "Contenido y Definiciones de I.O.",
    pregunta: "¿Cuál es el propósito fundamental de que los equipos de Investigación de Operaciones sean de carácter interdisciplinario según la doctrina de la cátedra?",
    respuestaReferencia: "El propósito fundamental es integrar conocimientos de distintas disciplinas para analizar problemas complejos de manera integral y obtener mejores soluciones para la toma de decisiones."
  },
  {
    id: 3,
    eje: "Metodología Científica",
    pregunta: "¿Qué rol cumplen los modelos matemáticos dentro de la aplicación del método científico en la Investigación Operativa?",
    respuestaReferencia: "Los modelos matemáticos representan de forma abstracta y simplificada la realidad del problema, permitiendo experimentar, analizar relaciones entre variables y obtener soluciones cuantitativas sin intervenir directamente en el sistema real."
  },
  {
    id: 4,
    eje: "Sistemas de Soporte a Decisiones (DSS)",
    pregunta: "¿Qué diferencia existe entre el Sistema de Administración de Base de Datos y el Sistema de Administración de Modelos dentro de la estructura de un DSS?",
    respuestaReferencia: "El Sistema de Administración de Base de Datos almacena y gestiona los datos necesarios para el análisis, mientras que el Sistema de Administración de Modelos contiene y administra los modelos cuantitativos y analíticos que procesan esos datos para apoyar la toma de decisiones."
  },
  {
    id: 5,
    eje: "Características de un DSS",
    pregunta: "¿Por qué es crucial que el diseño, desarrollo y uso de un DSS sea conducido y guiado por el usuario final de la organización?",
    respuestaReferencia: "Porque el usuario final conoce el contexto real del problema, las necesidades operativas y los criterios de decisión propios de la organización. Sin su participación, el sistema puede resultar técnicamente correcto pero inadecuado para el problema que busca resolver."
  }
];

// Función auxiliar para llamar al modelo localmente (think: false = modo nothink)
async function callOllama(prompt: string): Promise<string> {
  const res = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, prompt, stream: false, think: false }),
  });

  if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
  const data = (await res.json()) as { response: string };
  return data.response || "";
}

// GET /api/ejercicio/diagnostico
// Devuelve una pregunta seleccionada al azar del banco fijo (sin exponer la respuesta de referencia)
export const obtenerPreguntaDiagnostico = async (_req: Request, res: Response): Promise<void> => {
  try {
    const preguntaElegida = bancoPreguntas[Math.floor(Math.random() * bancoPreguntas.length)];

    res.json({
      tipo: "diagnostico",
      id: preguntaElegida.id,
      titulo: `Evaluación Teórica: ${preguntaElegida.eje}`,
      descripcion: "Responda a la siguiente consigna de forma concisa y con terminología técnica adecuada:",
      datos: preguntaElegida.pregunta
    });
  } catch (error: any) {
    res.status(500).json({ error: "Error al obtener la pregunta del banco: " + error.message });
  }
};

// POST /api/ejercicio/evaluar-teoria
// Body: { preguntaId: number, respuestaEstudiante: string }
// Evalúa la respuesta del alumno contrastándola con la respuesta de referencia del banco
export const evaluarPreguntaTeorica = async (req: Request, res: Response): Promise<void> => {
  const { preguntaId, respuestaEstudiante } = req.body;

  if (!preguntaId || !respuestaEstudiante) {
    res.status(400).json({ error: "Faltan campos obligatorios en el body (preguntaId o respuestaEstudiante)." });
    return;
  }

  const pregunta = bancoPreguntas.find(p => p.id === Number(preguntaId));
  if (!pregunta) {
    res.status(404).json({ error: `No se encontró la pregunta con id ${preguntaId}.` });
    return;
  }

  const promptEvaluacion =
    `/no_think\n` +
    `Eres un corrector de exámenes universitarios. Evalúa la respuesta del estudiante comparándola con la respuesta de referencia.\n\n` +
    `REFERENCIA: "${pregunta.respuestaReferencia}"\n\n` +
    `RESPUESTA DEL ESTUDIANTE: "${respuestaEstudiante}"\n\n` +
    `Responde SOLO con este JSON, sin texto extra:\n` +
    `{"puntaje":<0-100>,"nivel":"<Excelente|Muy bien|Bien|Regular|Insuficiente>","resumen":"<2 oraciones>","que_estuvo_bien":["..."],"que_mejorar":["..."]}`;

  try {
    const raw = await callOllama(promptEvaluacion);
    const cleanJson = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanJson);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      puntaje: 50,
      nivel: "Regular",
      resumen: "La respuesta se guardó correctamente, pero el motor local de IA (Ollama) no pudo completar el feedback.",
      que_estuvo_bien: ["Respuesta recibida en el servidor."],
      que_mejorar: [`Asegurar que Ollama y el modelo '${MODEL}' se encuentren activos.`]
    });
  }
};
