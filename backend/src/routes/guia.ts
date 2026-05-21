import { Router } from "express";
import { getGuiaTransporte } from "../controllers/transporteController";
import { getGuiaAsignacion } from "../controllers/asignacionController";
import { getGuiaFinanciero } from "../controllers/financieroController";
import { getGuiaProduccion } from "../controllers/produccionController";
import { getGuiaMezcla } from "../controllers/mezclaController";

const router: Router = Router();

// GET /api/guia/transporte
router.get("/transporte", getGuiaTransporte);

// GET /api/guia/asignacion
router.get("/asignacion", getGuiaAsignacion);

// GET /api/guia/financiero
router.get("/financiero", getGuiaFinanciero);

// GET /api/guia/produccion
router.get("/produccion", getGuiaProduccion);

// GET /api/guia/mezcla
router.get("/mezcla", getGuiaMezcla);

export default router;
