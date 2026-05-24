import { Router } from "express";
import { getEscenario } from "../controllers/escenarioController";
import { evaluarResolucion } from "../controllers/evaluadorController";

const router: Router = Router();

// GET /api/ejercicio/escenario/:tipo
// Devuelve un escenario aleatorio del tipo pedido
router.get("/escenario/:tipo", getEscenario);

// POST /api/ejercicio/evaluar
// Body: { tipo, escenario, resolucion }
// Evalúa la resolución del estudiante con Mistral
router.post("/evaluar", evaluarResolucion);

export default router;
