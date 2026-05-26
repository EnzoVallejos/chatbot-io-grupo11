import { Router } from "express";
import { getEscenario } from "../controllers/escenarioController";
import { evaluarResolucion } from "../controllers/evaluadorController";
import { obtenerPreguntaDiagnostico, evaluarPreguntaTeorica } from "../controllers/diagnosticoController";

const router: Router = Router();

// --- RUTAS DE PRÁCTICA DEL GRUPO 11 ---
// GET /api/ejercicio/escenario/:tipo
router.get("/escenario/:tipo", getEscenario);

// POST /api/ejercicio/evaluar
router.post("/evaluar", evaluarResolucion);

// --- NUEVAS RUTAS EXCLUSIVAS DEL MÓDULO DIAGNÓSTICO ---
// GET /api/ejercicio/diagnostico
router.get("/diagnostico", obtenerPreguntaDiagnostico);

// POST /api/ejercicio/evaluar-teoria
router.post("/evaluar-teoria", evaluarPreguntaTeorica);

export default router;
