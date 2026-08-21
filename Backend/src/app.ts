import express, { Express } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import etudiantRoutes from "./routes/etudiantRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app: Express = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/etudiants", etudiantRoutes);

export default app;
