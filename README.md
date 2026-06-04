# IO Chatbot — Guía completa de instalación y uso

Chatbot para el estudio de **Investigación de Operaciones**. Incluye guías teóricas, ejemplos resueltos, diagnóstico de conocimientos, práctica de modelado y un modo de **Consultas** que responde preguntas usando el material de la materia (RAG).

Esta guía está pensada para que **cualquier persona, sin conocimientos previos**, pueda dejar el proyecto funcionando de principio a fin.

---

## 1. ¿De qué partes se compone el proyecto?

El sistema tiene **tres piezas** que trabajan juntas:

| Parte | Carpeta | Tecnología | Para qué sirve |
|-------|---------|------------|----------------|
| **Frontend** | `frontend/` | HTML + JavaScript | La interfaz de chat que ves en el navegador. |
| **Backend** | `backend/` | Node.js + Express | Recibe los pedidos del frontend y los reparte. |
| **Model** | `model/` | Python + FastAPI | El "cerebro" del modo Consultas (RAG sobre el material). |

Además, todo se apoya en **Ollama**, un programa que ejecuta los modelos de inteligencia artificial en tu propia computadora.

Flujo general:

```
Navegador (frontend)  →  Backend (Express :3000)  →  Servicio Model (FastAPI :8000)  →  Ollama
```

> Importante: para que el chatbot funcione **completo** hay que tener **4 cosas corriendo a la vez**: Ollama, el servicio Model, el Backend y abrir el Frontend. Más abajo se explica cómo.

---

## 2. Requisitos previos (instalar una sola vez)

Instalá estos programas antes de continuar. Si ya los tenés, podés saltar al paso 3.

### 2.1. Node.js (versión 18 o superior)
- Descarga: https://nodejs.org (elegí la versión "LTS").
- Para verificar que quedó instalado, abrí una terminal (PowerShell) y escribí:

```powershell
node --version
```

Debería mostrar algo como `v18.x.x` o superior.

### 2.2. Python (versión 3.10 o superior)
- Descarga: https://www.python.org/downloads/
- **MUY IMPORTANTE (Windows):** durante la instalación, marcá la casilla **"Add Python to PATH"**.
- Para verificar:

```powershell
python --version
```

Debería mostrar algo como `Python 3.10` o superior.

### 2.3. Ollama
- Descarga: https://ollama.com
- Es el motor que ejecuta los modelos de IA localmente. Instalalo con las opciones por defecto.
- Para verificar:

```powershell
ollama --version
```

### 2.4. Descargar el modelo de IA
Una vez instalado Ollama, descargá el modelo que usa el proyecto. Puede tardar varios minutos (es un archivo grande):

```powershell
ollama pull gemma4:e4b
```

- `gemma4:e4b` → se usa en **Consultas**, práctica y diagnóstico (configurado en `model/config.py` como `MODEL_NAME`).

---

## 3. Instalación del proyecto (una sola vez)

Abrí una terminal **PowerShell** y posicionate en la carpeta del proyecto. Por ejemplo:

```powershell
cd "C:\Users\Tomás\Documents\GitHub\chatbot-io-grupo11"
```

> En todos los pasos, "la raíz del proyecto" se refiere a esta carpeta (la que contiene `frontend`, `backend` y `model`).

### 3.1. Instalar el Backend (Node.js)

```powershell
cd backend
npm install
cd ..
```

Esto crea la carpeta `node_modules` con las dependencias. Solo hace falta hacerlo una vez.

### 3.2. Preparar el Model (Python)

El Model usa un **entorno virtual** (`.venv`): una carpeta aislada donde se instalan las dependencias de Python sin afectar al resto de tu sistema.

**Paso 1 — Crear el entorno virtual** (desde la raíz del proyecto). Si la carpeta `.venv` ya existe, podés saltar este paso:

```powershell
python -m venv .venv
```

**Paso 2 — Activar el entorno virtual** (PowerShell):

```powershell
.\.venv\Scripts\Activate.ps1
```

Si funcionó, vas a ver `(.venv)` al principio de la línea de la terminal.

> Si PowerShell muestra un error de "execution policy" (no permite ejecutar el script), corré una sola vez este comando y volvé a intentar activar:
>
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
> ```
>
> Alternativas para activar según tu terminal:
> - **CMD (símbolo del sistema):** `.\.venv\Scripts\activate.bat`
> - **Git Bash / Linux / macOS:** `source .venv/bin/activate`

**Paso 3 — Instalar las dependencias de Python** (con el entorno ya activado):

```powershell
pip install -r requirements.txt
```

Esto instala FastAPI, uvicorn y las librerías de IA (LangChain, Chroma, etc.). Puede tardar varios minutos.

> Para **desactivar** el entorno virtual cuando termines, escribí `deactivate`.

---

## 4. Cómo levantar el proyecto (cada vez que lo quieras usar)

Para usar el chatbot completo hay que dejar corriendo **3 terminales** y luego abrir el frontend. Abrí cada una en una ventana/pestaña distinta de PowerShell, todas posicionadas en la raíz del proyecto.

### Terminal 1 — Ollama (motor de IA)

```powershell
ollama run gemma4:e4b
```

Dejala abierta. Ollama queda escuchando en segundo plano. (También podés cerrar el chat con `/bye`; el servicio de Ollama sigue activo igual mientras la app de Ollama esté abierta.)

### Terminal 2 — Servicio Model (modo Consultas)

```powershell
.\.venv\Scripts\Activate.ps1
python -m uvicorn model.api:app --port 8000
```

- La primera línea **activa el entorno virtual** (tenés que ver `(.venv)`).
- La segunda línea levanta el servicio en `http://localhost:8000`.
- **La primera vez puede tardar** porque descarga el modelo de embeddings y construye la base vectorial (Chroma). Esperá hasta ver el mensaje de que la aplicación arrancó (`Application startup complete`).

### Terminal 3 — Backend

```powershell
cd backend
npm run dev
```

El servidor queda disponible en `http://localhost:3000`. Vas a ver en pantalla la lista de rutas disponibles, incluida `POST /api/consultas`.

### Abrir el Frontend

Abrí el archivo `frontend/index.html` **directamente en el navegador** (doble clic, o clic derecho → "Abrir con" → tu navegador). No necesita servidor propio.

¡Listo! Ya podés usar el chatbot.

---

## 5. Cómo usar el chatbot

Al abrir el frontend vas a ver botones (chips) para elegir el modo:

- **Consultas:** escribís una pregunta libre sobre la teoría y el bot responde usando el material de la materia, mostrando además las fuentes utilizadas. (Usa el servicio Model + Ollama.)
- **Guía teórica:** checklist de pasos para cada tipo de problema.
- **Ver ejemplo:** un ejemplo resuelto.
- **Práctica:** te da un escenario para que lo modeles y evalúa tu resolución.
- **Diagnóstico:** preguntas teóricas que el sistema corrige.

---

## 6. Resumen rápido (para cuando ya sabés usarlo)

Instalación (una vez):

```powershell
cd backend; npm install; cd ..
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
ollama pull gemma4:e4b
```

Ejecución (cada vez, 3 terminales):

```powershell
# Terminal 1
ollama run gemma4:e4b

# Terminal 2
.\.venv\Scripts\Activate.ps1
python -m uvicorn model.api:app --port 8000

# Terminal 3
cd backend; npm run dev
```

Luego abrir `frontend/index.html` en el navegador.

---

## 7. Solución de problemas comunes

| Problema | Causa probable | Solución |
|----------|----------------|----------|
| El modo **Consultas** dice "No se pudo conectar con el servicio del modelo" | El servicio Model (Terminal 2) no está corriendo | Verificá que la Terminal 2 esté activa en `http://localhost:8000` y que veas `(.venv)`. |
| El frontend dice "Error de conexión con el backend" | El Backend (Terminal 3) no está corriendo | Levantá la Terminal 3 con `npm run dev`. |
| Respuestas vacías o error de Ollama | El modelo no está descargado o Ollama no está activo | Corré `ollama list` y verificá que aparezca `gemma4:e4b`. |
| PowerShell no deja activar el `.venv` | Política de ejecución de scripts | Ejecutá `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` y reintentá. |
| `python` o `node` "no se reconoce como comando" | No quedaron en el PATH | Reinstalá marcando "Add to PATH" (Python) o reiniciá la terminal. |
| El puerto 3000 u 8000 está ocupado | Otro proceso lo usa | Cerrá el otro proceso, o cambiá el puerto (backend: variable `PORT`; model: `--port`). |

> Nota técnica: todos los modos que llaman a Ollama desde Python usan el mismo `MODEL_NAME` en `model/config.py` (actualmente `gemma4:e4b`). Para cambiar de modelo, editá esa variable y ejecutá `ollama pull` con el tag correspondiente.
