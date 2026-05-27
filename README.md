# IO chatbot — Guía de instalación y ejecución

Sistema de asistencia para el estudio de Investigación de Operaciones. Incluye guías teóricas, ejemplos resueltos, diagnóstico de conocimientos y práctica de modelado matemático.

---

## Requisitos previos

Los siguientes programas deben estar instalados en el sistema antes de continuar.

### Node.js
Versión 18 o superior.
Descarga: https://nodejs.org

### Ollama
Plataforma para ejecutar modelos de lenguaje de forma local.
Descarga: https://ollama.com

### Modelo de lenguaje (Mistral)
Una vez instalado Ollama, ejecutar el siguiente comando para descargar el modelo:

```
ollama pull mistral
```

---

## Instalación (se ejecuta una sola vez)

Dentro de la carpeta `backend`, instalar las dependencias del proyecto:

```
cd backend
npm install
```

---

## Ejecución (se realiza cada vez que se quiere usar el sistema)

Se deben tener activos dos procesos de forma simultánea. Se recomienda usar dos terminales separadas.

### Terminal 1 — Modelo de lenguaje

```
ollama run mistral
```
### Terminal 2 — Backend

```
cd backend
npm run dev
```

El servidor quedará disponible en `http://localhost:3000`.

### Frontend

Abrir el archivo `index.html` directamente en el navegador. No requiere servidor adicional.
