"""Configuración central del proyecto.

Cualquier parámetro que se comparta entre los 3 modos (Consultas, Diagnóstico
y Práctica) vive acá para que sea fácil de cambiar en un solo lugar.
"""

from pathlib import Path


# --------------------------------------------------------------------------
# Modelo de Ollama
# --------------------------------------------------------------------------
# Asegurate de tener el modelo descargado:
#     ollama pull qwen3.5:9b
# Si tu tag local es distinto (por ejemplo `qwen2.5:7b`), cambialo acá.
MODEL_NAME = "gemma4:e4b"

# Temperatura por defecto. Más baja = respuestas más deterministas.
TEMPERATURE = 0.5

# Cantidad máxima de tokens a generar. -1 = sin límite, recomendado dejar
# un número alto cuando el modelo es de "thinking" (Qwen3) o las respuestas
# son largas; el default de Ollama (128) suele ser demasiado bajo.
NUM_PREDICT = 2048

# Tamaño de la ventana de contexto.
NUM_CTX = 4096

# Si el modelo soporta "modo razonamiento" (Qwen3, etc.), desactivarlo
# evita que el LLM gaste todos sus tokens pensando y devuelva una respuesta
# vacía. Si querés ver el razonamiento, poné None o True.
REASONING = True

# URL del servidor de Ollama (default local).
OLLAMA_BASE_URL = "http://localhost:11434"


# --------------------------------------------------------------------------
# Embeddings y RAG
# --------------------------------------------------------------------------
EMBEDDING_MODEL = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"

# Cantidad de fragmentos que devuelve el retriever para cada consulta.
TOP_K = 4

# Parámetros de chunking. Solo se usan como fallback: la fuente principal
# (io_rag_chunks.json) ya viene troceada y curada, así que la ingesta no
# vuelve a partir el texto. Se dejan documentados por si se reincorpora
# alguna fuente sin trocear.
CHUNK_SIZE = 600
CHUNK_OVERLAP = 80


# --------------------------------------------------------------------------
# Rutas del proyecto
# --------------------------------------------------------------------------
PROJECT_ROOT = Path(__file__).resolve().parent.parent
# Fuente del corpus RAG: JSON con chunks pre-curados y metadata rica.
DATA_PATH = PROJECT_ROOT / "io_rag_chunks.json"
MODEL_DIR = PROJECT_ROOT / "model"
CHROMA_DIR = MODEL_DIR / "chroma_db"
