import { Etudiant, EtudiantPayload } from "../types/etudiant";
import { ReponseApi, UtilisateurAuth } from "../types/api";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
const CLE_TOKEN = "gestion-etudiants-token";
const CLE_UTILISATEUR = "gestion-etudiants-utilisateur";

export class ApiError extends Error {
  public readonly status: number;

  public constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function obtenirToken(): string | null {
  return localStorage.getItem(CLE_TOKEN);
}

export function obtenirUtilisateur(): UtilisateurAuth | null {
  const brut = localStorage.getItem(CLE_UTILISATEUR);
  return brut ? (JSON.parse(brut) as UtilisateurAuth) : null;
}

export function enregistrerSession(token: string, utilisateur: UtilisateurAuth): void {
  localStorage.setItem(CLE_TOKEN, token);
  localStorage.setItem(CLE_UTILISATEUR, JSON.stringify(utilisateur));
}

export function effacerSession(): void {
  localStorage.removeItem(CLE_TOKEN);
  localStorage.removeItem(CLE_UTILISATEUR);
}

async function requete<T>(chemin: string, options: RequestInit = {}): Promise<T> {
  const token = obtenirToken();

  const entetes: Record<string, string> = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const reponse = await fetch(`${baseUrl}${chemin}`, {
    ...options,
    headers: entetes
  });

  if (reponse.status === 204) {
    return undefined as T;
  }

  let donnees: ReponseApi<T> | null = null;
  try {
    donnees = (await reponse.json()) as ReponseApi<T>;
  } catch {
    donnees = null;
  }

  if (!reponse.ok) {
    throw new ApiError(reponse.status, donnees?.message || "Erreur lors de l'appel à l'API.");
  }

  return donnees?.data as T;
}

export async function inscrire(email: string, motDePasse: string): Promise<{ utilisateur: UtilisateurAuth; token: string }> {
  return requete("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, motDePasse })
  });
}

export async function connecter(email: string, motDePasse: string): Promise<{ utilisateur: UtilisateurAuth; token: string }> {
  return requete("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, motDePasse })
  });
}

export async function listerEtudiants(): Promise<Etudiant[]> {
  return requete<Etudiant[]>("/etudiants");
}

export async function creerEtudiant(payload: EtudiantPayload): Promise<Etudiant> {
  return requete<Etudiant>("/etudiants", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function remplacerEtudiant(id: number, payload: EtudiantPayload): Promise<Etudiant> {
  return requete<Etudiant>(`/etudiants/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export async function modifierPartiellementEtudiant(id: number, payload: EtudiantPayload): Promise<Etudiant> {
  return requete<Etudiant>(`/etudiants/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export async function supprimerEtudiant(id: number): Promise<void> {
  await requete<void>(`/etudiants/${id}`, { method: "DELETE" });
}
