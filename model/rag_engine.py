"""Motor RAG compartido.

Carga `data.md`, lo trocea respetando los títulos del markdown, genera los
embeddings y persiste la base vectorial en `model/chroma_db`. Si la base
ya existe la reutiliza, así no hay que re-indexar en cada arranque.
"""

from __future__ import annotations

import shutil
from pathlib import Path
from typing import List

from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import (
    MarkdownHeaderTextSplitter,
    RecursiveCharacterTextSplitter,
)

from . import config


# Encabezados de markdown que usamos como límite natural de los chunks.
# Mantener los headers dentro del contenido ayuda al LLM a ubicar el tema.
_HEADERS_TO_SPLIT_ON = [
    ("#", "h1"),
    ("##", "h2"),
]


def _load_and_split(data_path: Path) -> List[Document]:
    """Lee el archivo markdown y lo divide en documentos."""
    if not data_path.exists():
        raise FileNotFoundError(
            f"No se encontró el archivo de datos: {data_path}"
        )

    text = data_path.read_text(encoding="utf-8")

    md_splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on=_HEADERS_TO_SPLIT_ON,
        strip_headers=False,
    )
    md_docs = md_splitter.split_text(text)

    char_splitter = RecursiveCharacterTextSplitter(
        chunk_size=config.CHUNK_SIZE,
        chunk_overlap=config.CHUNK_OVERLAP,
    )
    return char_splitter.split_documents(md_docs)


def _db_has_content(chroma_dir: Path) -> bool:
    return chroma_dir.exists() and any(chroma_dir.iterdir())


def build_vector_db(rebuild: bool = False) -> Chroma:
    """Crea (o recupera) la base vectorial Chroma.

    Si `rebuild` es True borra la base existente y la regenera desde cero.
    Útil cuando cambia `data.md`.
    """
    embeddings = HuggingFaceEmbeddings(model_name=config.EMBEDDING_MODEL)

    if rebuild and config.CHROMA_DIR.exists():
        shutil.rmtree(config.CHROMA_DIR)

    if _db_has_content(config.CHROMA_DIR):
        return Chroma(
            persist_directory=str(config.CHROMA_DIR),
            embedding_function=embeddings,
        )

    docs = _load_and_split(config.DATA_PATH)
    print(f"[RAG] Indexando {len(docs)} fragmentos desde {config.DATA_PATH.name}...")

    return Chroma.from_documents(
        documents=docs,
        embedding=embeddings,
        persist_directory=str(config.CHROMA_DIR),
    )


def get_retriever(k: int | None = None, rebuild: bool = False):
    """Devuelve un retriever listo para usar en cualquiera de los modos."""
    db = build_vector_db(rebuild=rebuild)
    return db.as_retriever(search_kwargs={"k": k or config.TOP_K})
