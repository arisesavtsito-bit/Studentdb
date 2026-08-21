import express, { Express } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app: Express = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/auth", authRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route introuvable." });
});

app.use(errorHandler);

export default app;
