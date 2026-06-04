import { Request, Response } from "express";

// URL del microservicio Python (FastAPI) que expone el modo Consultas (RAG).
const MODEL_API_URL = process.env.MODEL_API_URL || "http://localhost:8000";

interface ConsultaBody {
  pregunta?: string;
}

interface ConsultaResult {
  answer: string;
  fuentes: { titulo: string; preview: string }[];
}

// POST /api/consultas
// Reenvía la pregunta del alumno al servicio Python y devuelve la respuesta
// del RAG junto con las fuentes utilizadas.
export async function consultar(req: Request, res: Response): Promise<void> {
  const { pregunta } = (req.body || {}) as ConsultaBody;

  if (!pregunta || !pregunta.trim()) {
    res.status(400).json({ error: "La pregunta está vacía." });
    return;
  }

  try {
    const apiRes = await fetch(`${MODEL_API_URL}/consultas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pregunta }),
    });

    if (!apiRes.ok) {
      const detalle = await apiRes.text().catch(() => "");
      res
        .status(502)
        .json({ error: `El servicio del modelo respondió ${apiRes.status}. ${detalle}` });
      return;
    }

    const data = (await apiRes.json()) as ConsultaResult;
    res.json(data);
  } catch (e) {
    res.status(503).json({
      error:
        "No se pudo conectar con el servicio del modelo. Verifica que FastAPI " +
        "esté corriendo (python -m uvicorn model.api:app --port 8000).",
    });
  }
}
