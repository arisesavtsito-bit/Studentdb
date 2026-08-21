import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import * as etudiantService from "../services/etudiantService";

export const lister = asyncHandler(async (_req: Request, res: Response) => {
  const etudiants = await etudiantService.lister();
  res.status(200).json({ success: true, data: etudiants });
});

export const obtenirUn = asyncHandler(async (req: Request, res: Response) => {
  const id = etudiantService.extraireId(req.params);
  const etudiant = await etudiantService.obtenirParId(id);
  res.status(200).json({ success: true, data: etudiant });
});

export const creer = asyncHandler(async (req: Request, res: Response) => {
  const etudiant = await etudiantService.creer(req.body);
  res.status(201).json({ success: true, data: etudiant });
});

export const remplacer = asyncHandler(async (req: Request, res: Response) => {
  const id = etudiantService.extraireId(req.params);
  const etudiant = await etudiantService.remplacer(id, req.body);
  res.status(200).json({ success: true, data: etudiant });
});

export const modifierPartiellement = asyncHandler(async (req: Request, res: Response) => {
  const id = etudiantService.extraireId(req.params);
  const etudiant = await etudiantService.modifierPartiellement(id, req.body);
  res.status(200).json({ success: true, data: etudiant });
});

export const supprimer = asyncHandler(async (req: Request, res: Response) => {
  const id = etudiantService.extraireId(req.params);
  await etudiantService.supprimer(id);
  res.status(204).send();
});
