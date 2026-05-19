import os
import shutil

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.llms import Ollama

from langchain.chains import RetrievalQA

# ==========================================
# CONFIG
# ==========================================

MODEL_NAME = "mistral"

# ==========================================
# LEER ARCHIVO
# ==========================================

with open("teoria.txt", "r", encoding="utf-8") as f:
    texto = f.read()

print("\n=========== TEXTO ===========\n")
print(texto)

# ==========================================
# CHUNKING
# ==========================================

splitter = RecursiveCharacterTextSplitter(
    chunk_size=300,
    chunk_overlap=50
)

chunks = splitter.split_text(texto)

docs = [
    Document(page_content=chunk)
    for chunk in chunks
]

print(f"\n✅ Chunks generados: {len(docs)}")

for i, doc in enumerate(docs):

    print(f"\n--- CHUNK {i+1} ---")
    print(doc.page_content)

# ==========================================
# EMBEDDINGS
# ==========================================

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

# ==========================================
# BORRAR DB VIEJA
# ==========================================

try:
    shutil.rmtree("./chroma_db")
except:
    pass

# ==========================================
# VECTOR DB
# ==========================================

db = Chroma.from_documents(
    documents=docs,
    embedding=embeddings,
    persist_directory="./chroma_db"
)

# ==========================================
# RETRIEVER
# ==========================================

retriever = db.as_retriever(
    search_kwargs={"k": 3}
)

# ==========================================
# OLLAMA
# ==========================================

llm = Ollama(
    model=MODEL_NAME,
    temperature=0
)

# ==========================================
# RAG
# ==========================================

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    return_source_documents=True
)

# ==========================================
# CHAT
# ==========================================

print("\n===================================")
print(" 🤖 Chatbot RAG iniciado ")
print("===================================")

while True:

    pregunta = input("\nTú: ")

    if pregunta.lower() == "salir":
        break

    # ======================================
    # DEBUG RETRIEVAL
    # ======================================

    docs_recuperados = retriever.get_relevant_documents(
        pregunta
    )

    print("\n=========== CHUNKS RECUPERADOS ===========")

    for i, doc in enumerate(docs_recuperados):

        print(f"\n[Chunk {i+1}]")
        print(doc.page_content)

    # ======================================
    # RESPUESTA
    # ======================================

    resultado = qa_chain.invoke({
        "query": pregunta
    })

    print("\n🤖 Bot:")
    print(resultado["result"])

    print("\n===================================")
