"""Motor RAG compartido.

Carga `io_rag_chunks.json` (chunks pre-curados con metadata), genera los
embeddings y persiste la base vectorial en `model/chroma_db`. Como los chunks
del JSON ya vienen troceados de forma coherente, NO se vuelve a partir el
texto: cada chunk se indexa tal cual, lo que acelera el arranque y mejora la
precisión del retriever.

La base se reconstruye automáticamente cuando cambia el JSON de origen (se
guarda un hash de la fuente junto a la base), así no hay que pasar `--rebuild`
a mano cada vez que se actualiza el corpus.
"""

from __future__ import annotations

import hashlib
import json
import shutil
from pathlib import Path
from typing import List

from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings

from . import config


# Nombre del archivo donde guardamos la huella (hash) de la fuente usada para
# construir la base. Vive dentro de CHROMA_DIR.
_FINGERPRINT_FILE = ".source_fingerprint"


def _flatten_metadata(meta: dict) -> dict:
    """Aplana la metadata del chunk a tipos que Chroma acepta.

    Chroma solo admite valores escalares (str/int/float/bool) en metadata,
    así que las listas (`keywords`, `related_chunks`) se convierten a string.
    """
    flat: dict = {}
    for key, value in meta.items():
        if isinstance(value, (list, tuple)):
            flat[key] = ", ".join(str(v) for v in value)
        elif isinstance(value, (str, int, float, bool)) or value is None:
            flat[key] = value
        else:
            flat[key] = str(value)
    return flat


def _load_chunks_from_json(data_path: Path) -> List[Document]:
    """Lee el JSON de chunks y arma un `Document` por cada uno."""
    if not data_path.exists():
        raise FileNotFoundError(
            f"No se encontró el archivo de datos: {data_path}"
        )

    data = json.loads(data_path.read_text(encoding="utf-8"))
    chunks = data.get("chunks", [])

    docs: List[Document] = []
    for chunk in chunks:
        content = (chunk.get("content") or "").strip()
        if not content:
            continue

        meta = dict(chunk.get("metadata") or {})
        # Guardamos el id del chunk en la metadata para poder rastrearlo.
        chunk_id = chunk.get("id")
        if chunk_id is not None:
            meta.setdefault("id", chunk_id)

        # Enriquecemos el texto embebido con la sección y las keywords para
        # mejorar el recall: el retriever "ve" esos términos al buscar.
        section = meta.get("section")
        keywords = meta.get("keywords")
        prefix_parts = []
        if section:
            prefix_parts.append(f"[Sección: {section}]")
        if isinstance(keywords, (list, tuple)) and keywords:
            prefix_parts.append("Palabras clave: " + ", ".join(keywords) + ".")

        page_content = content
        if prefix_parts:
            page_content = " ".join(prefix_parts) + "\n" + content

        docs.append(
            Document(page_content=page_content, metadata=_flatten_metadata(meta))
        )

    if not docs:
        raise ValueError(
            f"El archivo {data_path.name} no contiene chunks utilizables."
        )

    return docs


def _source_fingerprint(data_path: Path) -> str:
    """Hash del contenido de la fuente, para detectar cambios."""
    return hashlib.sha256(data_path.read_bytes()).hexdigest()


def _stored_fingerprint(chroma_dir: Path) -> str | None:
    fp_file = chroma_dir / _FINGERPRINT_FILE
    if fp_file.exists():
        return fp_file.read_text(encoding="utf-8").strip()
    return None


def _write_fingerprint(chroma_dir: Path, fingerprint: str) -> None:
    chroma_dir.mkdir(parents=True, exist_ok=True)
    (chroma_dir / _FINGERPRINT_FILE).write_text(fingerprint, encoding="utf-8")


def _db_has_content(chroma_dir: Path) -> bool:
    if not chroma_dir.exists():
        return False
    # Ignoramos el archivo de huella al evaluar si la base tiene contenido.
    return any(
        item.name != _FINGERPRINT_FILE for item in chroma_dir.iterdir()
    )


def build_vector_db(rebuild: bool = False) -> Chroma:
    """Crea (o recupera) la base vectorial Chroma.

    Reconstruye desde cero cuando:
      - `rebuild` es True, o
      - la fuente (`io_rag_chunks.json`) cambió respecto de la última build
        (se compara contra el hash guardado), o
      - todavía no hay base.
    """
    embeddings = HuggingFaceEmbeddings(model_name=config.EMBEDDING_MODEL)

    current_fp = _source_fingerprint(config.DATA_PATH)
    source_changed = _stored_fingerprint(config.CHROMA_DIR) != current_fp

    if (rebuild or source_changed) and config.CHROMA_DIR.exists():
        shutil.rmtree(config.CHROMA_DIR)

    if not rebuild and not source_changed and _db_has_content(config.CHROMA_DIR):
        return Chroma(
            persist_directory=str(config.CHROMA_DIR),
            embedding_function=embeddings,
        )

    docs = _load_chunks_from_json(config.DATA_PATH)
    print(
        f"[RAG] Indexando {len(docs)} fragmentos desde "
        f"{config.DATA_PATH.name}..."
    )

    db = Chroma.from_documents(
        documents=docs,
        embedding=embeddings,
        persist_directory=str(config.CHROMA_DIR),
    )
    _write_fingerprint(config.CHROMA_DIR, current_fp)
    return db


def get_retriever(k: int | None = None, rebuild: bool = False):
    """Devuelve un retriever listo para usar en cualquiera de los modos."""
    db = build_vector_db(rebuild=rebuild)
    return db.as_retriever(search_kwargs={"k": k or config.TOP_K})
