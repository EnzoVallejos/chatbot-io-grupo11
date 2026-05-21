import { Router } from "express";
import { getEjemplo } from "../controllers/ejemploController";

const router: Router = Router();

// GET /api/ejemplo/:tipo
// Tipos válidos: transporte, asignacion, financiero, produccion, mezcla
router.get("/:tipo", getEjemplo);

export default router;
