# IO Chatbot — Guía de instalación y uso

Chatbot para el estudio de **Investigación de Operaciones**. Incluye ejemplos resueltos, diagnóstico de conocimientos, práctica de modelado y un modo de consultas teóricas con RAG.

---

## 1. Requisitos previos (instalar una sola vez)

### Node.js (versión 18 o superior)
- Descarga: https://nodejs.org (versión LTS)
- Verificar: `node --version`

### Ollama
- Descarga: https://ollama.com
- Verificar: `ollama --version`

### Descargar el modelo
```powershell
ollama pull gemma4:e4b
```

---

## 2. Instalación (una sola vez)

```powershell
cd backend
npm install
cd ..
```

---

## 3. Ejecución (cada vez)

**Terminal 1 — Ollama:**
```powershell
ollama run gemma4:e4b
```

**Terminal 2 — Backend:**
```powershell
cd backend
npm run dev
```

Luego abrí `frontend/index.html` en el navegador.

