export interface Utilisateur {
  id: number;
  email: string;
}

export interface JwtPayloadUtilisateur {
  id: number;
  email: string;
}

export interface Etudiant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  dateNaissance: string | null;
  filiere: string | null;
}
