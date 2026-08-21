import { pool } from "../db/pool";
import { AppError } from "../errors/appError";
import { estEmailValide, estIdValide } from "../utils/validators";
import { Etudiant } from "../types";

interface EtudiantRow {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  date_naissance: string | null;
  filiere: string | null;
}

interface ChampsEtudiant {
  nom?: string;
  prenom?: string;
  email?: string;
  dateNaissance?: string | null;
  filiere?: string | null;
}

const COLONNES = "id, nom, prenom, email, date_naissance::text AS date_naissance, filiere";

function mapper(ligne: EtudiantRow): Etudiant {
  return {
    id: ligne.id,
    nom: ligne.nom,
    prenom: ligne.prenom,
    email: ligne.email,
    dateNaissance: ligne.date_naissance,
    filiere: ligne.filiere
  };
}

export function extraireId(params: { id?: string }): number {
  if (!estIdValide(params?.id)) {
    throw new AppError(400, "Identifiant invalide.");
  }
  return Number(params.id);
}

function validerTexte(valeur: unknown, champ: string, obligatoire: boolean): string | undefined {
  if (valeur === undefined || valeur === null || (typeof valeur === "string" && valeur.trim() === "")) {
    if (obligatoire) {
      throw new AppError(400, `Le champ ${champ} est obligatoire.`);
    }
    return undefined;
  }
  if (typeof valeur !== "string") {
    throw new AppError(400, `Le champ ${champ} doit être une chaîne de caractères.`);
  }
  if (valeur.trim().length > 100) {
    throw new AppError(400, `Le champ ${champ} ne doit pas dépasser 100 caractères.`);
  }
  return valeur.trim();
}

function validerEmail(valeur: unknown, obligatoire: boolean): string | undefined {
  if (valeur === undefined || valeur === null || (typeof valeur === "string" && valeur.trim() === "")) {
    if (obligatoire) {
      throw new AppError(400, "Le champ email est obligatoire.");
    }
    return undefined;
  }
  if (!estEmailValide(valeur)) {
    throw new AppError(400, "Le champ email doit être une adresse email valide.");
  }
  return valeur.trim().toLowerCase();
}

function validerDateNaissance(valeur: unknown): string | undefined {
  if (valeur === undefined || valeur === null || valeur === "") {
    return undefined;
  }
  if (typeof valeur !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valeur) || Number.isNaN(Date.parse(valeur))) {
    throw new AppError(400, "Le champ dateNaissance doit être une date au format AAAA-MM-JJ.");
  }
  return valeur;
}

function validerPayload(donnees: unknown, complet: boolean): ChampsEtudiant {
  if (!donnees || typeof donnees !== "object" || Array.isArray(donnees)) {
    throw new AppError(400, "Corps de requête invalide : un objet JSON est attendu.");
  }

  const corps = donnees as Record<string, unknown>;
  const champs: ChampsEtudiant = {};

  const nom = validerTexte(corps.nom, "nom", complet);
  const prenom = validerTexte(corps.prenom, "prenom", complet);
  const email = validerEmail(corps.email, complet);
  const dateNaissance = validerDateNaissance(corps.dateNaissance);
  const filiere = validerTexte(corps.filiere, "filiere", false);

  if (nom !== undefined) champs.nom = nom;
  if (prenom !== undefined) champs.prenom = prenom;
  if (email !== undefined) champs.email = email;
  if (dateNaissance !== undefined) champs.dateNaissance = dateNaissance;
  if (filiere !== undefined) champs.filiere = filiere;

  return champs;
}

export async function lister(): Promise<Etudiant[]> {
  const resultat = await pool.query<EtudiantRow>(
    `SELECT ${COLONNES} FROM etudiants ORDER BY id`
  );
  return resultat.rows.map(mapper);
}

export async function obtenirParId(id: number): Promise<Etudiant> {
  const resultat = await pool.query<EtudiantRow>(
    `SELECT ${COLONNES} FROM etudiants WHERE id = $1`,
    [id]
  );

  if (resultat.rows.length === 0) {
    throw new AppError(404, `Étudiant avec l'identifiant ${id} introuvable.`);
  }

  return mapper(resultat.rows[0]);
}

export async function creer(donnees: unknown): Promise<Etudiant> {
  const champs = validerPayload(donnees, true);

  const resultat = await pool.query<EtudiantRow>(
    `INSERT INTO etudiants (nom, prenom, email, date_naissance, filiere)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${COLONNES}`,
    [champs.nom, champs.prenom, champs.email, champs.dateNaissance ?? null, champs.filiere ?? null]
  );

  return mapper(resultat.rows[0]);
}

async function appliquerMiseAJour(id: number, champs: ChampsEtudiant): Promise<Etudiant> {
  const cles = Object.keys(champs) as (keyof ChampsEtudiant)[];
  const colonnesSql: Record<keyof ChampsEtudiant, string> = {
    nom: "nom",
    prenom: "prenom",
    email: "email",
    dateNaissance: "date_naissance",
    filiere: "filiere"
  };

  const setClause = cles.map((cle, index) => `${colonnesSql[cle]} = $${index + 1}`).join(", ");
  const valeurs = cles.map((cle) => champs[cle] ?? null);

  const resultat = await pool.query<EtudiantRow>(
    `UPDATE etudiants SET ${setClause}, modifie_le = NOW()
     WHERE id = $${cles.length + 1}
     RETURNING ${COLONNES}`,
    [...valeurs, id]
  );

  if (resultat.rows.length === 0) {
    throw new AppError(404, `Étudiant avec l'identifiant ${id} introuvable.`);
  }

  return mapper(resultat.rows[0]);
}

export async function remplacer(id: number, donnees: unknown): Promise<Etudiant> {
  const champs = validerPayload(donnees, true);
  return appliquerMiseAJour(id, champs);
}

export async function modifierPartiellement(id: number, donnees: unknown): Promise<Etudiant> {
  const champs = validerPayload(donnees, false);

  if (Object.keys(champs).length === 0) {
    throw new AppError(400, "Aucun champ modifiable fourni.");
  }

  return appliquerMiseAJour(id, champs);
}

export async function supprimer(id: number): Promise<void> {
  const resultat = await pool.query(
    "DELETE FROM etudiants WHERE id = $1 RETURNING id",
    [id]
  );

  if (resultat.rowCount === 0) {
    throw new AppError(404, `Étudiant avec l'identifiant ${id} introuvable.`);
  }
}
