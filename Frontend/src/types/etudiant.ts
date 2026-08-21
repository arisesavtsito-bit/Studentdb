export interface Etudiant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  dateNaissance: string | null;
  filiere: string | null;
}

export interface EtudiantPayload {
  nom?: string;
  prenom?: string;
  email?: string;
  dateNaissance?: string | null;
  filiere?: string | null;
}
