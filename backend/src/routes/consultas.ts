import { Router } from "express";
import { consultar } from "../controllers/consultasController";

const router: Router = Router();

// POST /api/consultas
router.post("/", consultar);

export default router;
