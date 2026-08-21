import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool";
import { env } from "../config/env";
import { AppError } from "../errors/appError";
import { estEmailValide } from "../utils/validators";
import { JwtPayloadUtilisateur, Utilisateur } from "../types";

interface UtilisateurRow {
  id: number;
  email: string;
  mot_de_passe: string;
}

function validerCredentials(email: unknown, motDePasse: unknown): void {
  if (!estEmailValide(email)) {
    throw new AppError(400, "Email invalide.");
  }
  if (typeof motDePasse !== "string" || motDePasse.length < 6) {
    throw new AppError(400, "Le mot de passe doit contenir au moins 6 caractères.");
  }
}

function signerToken(utilisateur: Utilisateur): string {
  const payload: JwtPayloadUtilisateur = { id: utilisateur.id, email: utilisateur.email };
  return jwt.sign(payload, env.jwtSecret, { expiresIn: "1h" });
}

export async function inscrire(
  email: unknown,
  motDePasse: unknown
): Promise<{ utilisateur: Utilisateur; token: string }> {
  validerCredentials(email, motDePasse);

  const emailNormalise = (email as string).trim().toLowerCase();

  const existant = await pool.query<UtilisateurRow>(
    "SELECT id, email, mot_de_passe FROM utilisateurs WHERE email = $1",
    [emailNormalise]
  );

  if (existant.rows.length > 0) {
    throw new AppError(409, "Cet email est déjà utilisé.");
  }

  const hash = await bcrypt.hash(motDePasse as string, 10);

  const resultat = await pool.query<Utilisateur>(
    "INSERT INTO utilisateurs (email, mot_de_passe) VALUES ($1, $2) RETURNING id, email",
    [emailNormalise, hash]
  );

  const utilisateur = resultat.rows[0];
  return { utilisateur, token: signerToken(utilisateur) };
}

export async function connecter(
  email: unknown,
  motDePasse: unknown
): Promise<{ utilisateur: Utilisateur; token: string }> {
  validerCredentials(email, motDePasse);

  const emailNormalise = (email as string).trim().toLowerCase();

  const resultat = await pool.query<UtilisateurRow>(
    "SELECT id, email, mot_de_passe FROM utilisateurs WHERE email = $1",
    [emailNormalise]
  );

  const ligne = resultat.rows[0];

  if (!ligne) {
    throw new AppError(401, "Email ou mot de passe incorrect.");
  }

  const motDePasseValide = await bcrypt.compare(motDePasse as string, ligne.mot_de_passe);

  if (!motDePasseValide) {
    throw new AppError(401, "Email ou mot de passe incorrect.");
  }

  const utilisateur: Utilisateur = { id: ligne.id, email: ligne.email };
  return { utilisateur, token: signerToken(utilisateur) };
}
