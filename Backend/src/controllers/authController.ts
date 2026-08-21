import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import * as authService from "../services/authService";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, motDePasse } = req.body as { email?: unknown; motDePasse?: unknown };
  const resultat = await authService.inscrire(email, motDePasse);
  res.status(201).json({ success: true, data: resultat });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, motDePasse } = req.body as { email?: unknown; motDePasse?: unknown };
  const resultat = await authService.connecter(email, motDePasse);
  res.status(200).json({ success: true, data: resultat });
});
