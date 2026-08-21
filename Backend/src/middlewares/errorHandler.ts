import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/appError";

interface PgErreur extends Error {
  code?: string;
}

export function errorHandler(
  erreur: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (erreur instanceof AppError) {
    res.status(erreur.statusCode).json({ success: false, message: erreur.message });
    return;
  }

  const pgErreur = erreur as PgErreur;

  if (pgErreur?.code === "23505") {
    res.status(409).json({ success: false, message: "Conflit : cette valeur existe déjà." });
    return;
  }

  if ((erreur as { type?: string })?.type === "entity.parse.failed") {
    res.status(400).json({ success: false, message: "Corps de requête JSON invalide." });
    return;
  }

  console.error("Erreur non gérée :", erreur);
  res.status(500).json({ success: false, message: "Erreur interne du serveur." });
}
