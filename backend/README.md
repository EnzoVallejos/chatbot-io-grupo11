# Guia Transporte API

Backend en Node.js + TypeScript con endpoint para guía de transporte.

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Producción

```bash
npm run build
npm start
```

## Endpoint

### GET `/api/guia/transporte`

Devuelve el texto de la guía de variables de decisión para problemas de transporte.

**Ejemplo:**
```bash
curl http://localhost:3000/api/guia/transporte
```

**Respuesta:** `200 OK` — texto plano con la guía completa.
