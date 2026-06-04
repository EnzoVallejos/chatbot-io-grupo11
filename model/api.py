"""Servicio HTTP (FastAPI) que expone el modo CONSULTAS al stack web.

Reutiliza la cadena RAG ya definida en `model/consultas.py` y la deja
disponible vía HTTP para que el backend Express le haga proxy.

Arranque (desde la raíz del proyecto):
    python -m uvicorn model.api:app --port 8000
"""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .consultas import build_chain


# La cadena RAG es cara de construir (carga Chroma + embeddings), así que se
# arma una sola vez al arrancar y se reutiliza en cada request.
_state: dict = {"chain": None}


@asynccontextmanager
async def lifespan(_app: FastAPI):
    _state["chain"] = build_chain()
    yield
    _state["chain"] = None


app = FastAPI(title="IO Chatbot - Modo Consultas", lifespan=lifespan)

# CORS abierto: el flujo normal es vía el backend Express, pero se deja
# habilitado por si en el futuro se llama directo desde el navegador.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ConsultaRequest(BaseModel):
    pregunta: str


class Fuente(BaseModel):
    titulo: str
    preview: str


class ConsultaResponse(BaseModel):
    answer: str
    fuentes: list[Fuente]


def _build_fuentes(source_documents) -> list[Fuente]:
    """Convierte los documentos recuperados en fuentes legibles.

    Misma lógica de título/preview que `_format_sources` en consultas.py,
    pero devolviendo datos estructurados en vez de un string.
    """
    fuentes: list[Fuente] = []
    for doc in source_documents or []:
        meta = doc.metadata or {}
        titulo = (
            meta.get("section")
            or meta.get("topic")
            or meta.get("subtopic")
            or "(sin título)"
        )
        preview = doc.page_content.replace("\n", " ").strip()
        if len(preview) > 140:
            preview = preview[:140] + "..."
        fuentes.append(Fuente(titulo=titulo, preview=preview))
    return fuentes


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "ready": _state["chain"] is not None}


@app.post("/consultas", response_model=ConsultaResponse)
def consultas(req: ConsultaRequest) -> ConsultaResponse:
    pregunta = (req.pregunta or "").strip()
    if not pregunta:
        raise HTTPException(status_code=400, detail="La pregunta está vacía.")

    chain = _state["chain"]
    if chain is None:
        raise HTTPException(status_code=503, detail="El modelo aún no está listo.")

    try:
        resultado = chain.invoke(pregunta)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(
            status_code=500, detail=f"Error al consultar el modelo: {exc}"
        ) from exc

    respuesta = (resultado.get("answer") or "").strip()
    if not respuesta:
        respuesta = (
            "No pude generar una respuesta. Verificá que el modelo exista en "
            "Ollama (`ollama list`) y que MODEL_NAME coincida con el tag local."
        )

    return ConsultaResponse(
        answer=respuesta,
        fuentes=_build_fuentes(resultado.get("context", [])),
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
