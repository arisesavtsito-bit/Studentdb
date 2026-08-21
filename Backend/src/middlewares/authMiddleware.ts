import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../errors/appError";
import { JwtPayloadUtilisateur } from "../types";
import { asyncHandler } from "./asyncHandler";

declare module "express-serve-static-core" {
  interface Request {
    utilisateur?: JwtPayloadUtilisateur;
  }
}

export const authMiddleware = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const entete = req.headers.authorization;

    if (!entete || !entete.startsWith("Bearer ")) {
      throw new AppError(401, "Accès refusé : token manquant.");
    }

    const token = entete.split(" ")[1];

    try {
      const payload = jwt.verify(token, env.jwtSecret) as JwtPayloadUtilisateur;
      req.utilisateur = payload;
      next();
    } catch {
      throw new AppError(401, "Accès refusé : token invalide ou expiré.");
    }
  }
);
