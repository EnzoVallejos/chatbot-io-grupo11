"""Modo 1: CONSULTAS.

Responde preguntas sobre la teoría de Investigación Operativa apoyándose
exclusivamente en el contenido de `data.md` (RAG sobre Chroma + Ollama).

Usa LCEL (LangChain Expression Language) en vez de la cadena legacy
`RetrievalQA`, porque esa cadena hereda de una clase con un método `dict()`
que rompe la evaluación de anotaciones en Python 3.14.
"""

from __future__ import annotations

from typing import Iterable

from langchain_core.documents import Document
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableParallel, RunnablePassthrough
from langchain_ollama import OllamaLLM

from . import config
from .rag_engine import get_retriever


# El prompt fuerza al modelo a apoyarse SOLO en el contexto recuperado.
# Esto reduce alucinaciones y mantiene las respuestas alineadas con la materia.
_PROMPT_TEMPLATE = """Sos un asistente experto en Investigación Operativa
que ayuda a estudiantes de la materia. Respondé SIEMPRE en español, de
forma clara, ordenada y concisa.

Reglas estrictas:
- Usá únicamente la información del CONTEXTO de abajo.
- Si la respuesta no está en el contexto, decí exactamente:
  "No tengo esa información en el material de la materia."
- No inventes datos, definiciones ni ejemplos que no estén en el contexto.
- Si la pregunta es ambigua, pedí una aclaración.

CONTEXTO:
{context}

PREGUNTA:
{question}

RESPUESTA:"""


def _format_docs_as_context(docs: Iterable[Document]) -> str:
    """Convierte los documentos recuperados en un único string de contexto."""
    return "\n\n".join(doc.page_content for doc in docs)


def build_chain(rebuild_db: bool = False):
    """Arma la cadena RAG (LCEL) lista para invocar.

    Devuelve una `Runnable` que recibe un string (la pregunta) y produce
    un dict con `answer` (respuesta del LLM) y `context` (lista de
    documentos recuperados, para mostrar las fuentes).
    """
    retriever = get_retriever(rebuild=rebuild_db)

    llm = OllamaLLM(
        model=config.MODEL_NAME,
        temperature=config.TEMPERATURE,
        base_url=config.OLLAMA_BASE_URL,
        num_predict=config.NUM_PREDICT,
        num_ctx=config.NUM_CTX,
        reasoning=config.REASONING,
    )

    prompt = PromptTemplate(
        template=_PROMPT_TEMPLATE,
        input_variables=["context", "question"],
    )

    # Subcadena que toma {context: [docs], question: str} y devuelve la
    # respuesta del LLM como string.
    answer_chain = (
        RunnablePassthrough.assign(
            context=lambda x: _format_docs_as_context(x["context"])
        )
        | prompt
        | llm
        | StrOutputParser()
    )

    # Cadena completa: recibe la pregunta, recupera contexto y arma la
    # respuesta, conservando los documentos fuente.
    return RunnableParallel(
        {"context": retriever, "question": RunnablePassthrough()}
    ).assign(answer=answer_chain)


def _format_sources(source_documents) -> str:
    """Arma un resumen legible de los fragmentos usados como fuente."""
    if not source_documents:
        return ""

    lines = ["\n[Fuentes utilizadas]"]
    for i, doc in enumerate(source_documents, 1):
        meta = doc.metadata or {}
        titulo = meta.get("h2") or meta.get("h1") or "(sin título)"
        preview = doc.page_content.replace("\n", " ").strip()
        if len(preview) > 140:
            preview = preview[:140] + "..."
        lines.append(f"  {i}. {titulo} -> {preview}")
    return "\n".join(lines)


def run(rebuild_db: bool = False) -> None:
    """Loop interactivo del modo Consultas."""
    print("\n==========================================")
    print(" MODO CONSULTAS - Investigación Operativa ")
    print("==========================================")
    print("Hacé tu pregunta sobre la teoría de la materia.")
    print("Escribí 'salir' para volver al menú principal.\n")

    chain = build_chain(rebuild_db=rebuild_db)

    while True:
        try:
            pregunta = input("Tú: ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            break

        if not pregunta:
            continue
        if pregunta.lower() in {"salir", "exit", "quit"}:
            break

        try:
            resultado = chain.invoke(pregunta)
        except Exception as exc:  # noqa: BLE001
            print(f"\n[Error al consultar el modelo] {exc}\n")
            continue

        respuesta = (resultado.get("answer") or "").strip()
        print("\nBot:")
        if respuesta:
            print(respuesta)
        else:
            print(
                "[Respuesta vacía del modelo. Probá aumentar NUM_PREDICT en "
                "config.py, verificar que el modelo exista en Ollama con "
                "`ollama list`, o que tu MODEL_NAME coincida con el tag local.]"
            )
        print(_format_sources(resultado.get("context", [])))
        print()
