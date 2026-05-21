import express, { Application } from "express";
import guiaRouter from "./routes/guia";
import ejemploRouter from "./routes/ejemplo";

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use("/api/guia", guiaRouter);
app.use("/api/ejemplo", ejemploRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
