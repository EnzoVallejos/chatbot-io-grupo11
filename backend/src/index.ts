import express, { Application, Request, Response, NextFunction } from "express";
import guiaRouter from "./routes/guia";
import ejemploRouter from "./routes/ejemplo";
import ejercicioRouter from "./routes/ejercicio";
import consultasRouter from "./routes/consultas";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// CORS
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());

// Routes
app.use("/api/guia", guiaRouter);
app.use("/api/ejemplo", ejemploRouter);
app.use("/api/ejercicio", ejercicioRouter);
app.use("/api/consultas", consultasRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`  GET  /api/guia/:tipo`);
  console.log(`  GET  /api/ejemplo/:tipo`);
  console.log(`  GET  /api/ejercicio/escenario/:tipo`);
  console.log(`  POST /api/ejercicio/evaluar`);
  console.log(`  POST /api/consultas`);
});

export default app;
