import { Router } from "express";
import { consultarRAG } from "../controllers/ragController";

const router: Router = Router();

// POST /api/rag
router.post("/", consultarRAG);

export default router;
