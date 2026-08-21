import { FormEvent, useState } from "react";
import { Etudiant, EtudiantPayload } from "../types/etudiant";

interface EtudiantFormProps {
  valeurInitiale: Etudiant | null;
  annuler: () => void;
  enregistrer: (payload: EtudiantPayload) => Promise<void>;
}

export default function EtudiantForm({ valeurInitiale, annuler, enregistrer }: EtudiantFormProps) {
  const [nom, setNom] = useState(valeurInitiale?.nom ?? "");
  const [prenom, setPrenom] = useState(valeurInitiale?.prenom ?? "");
  const [email, setEmail] = useState(valeurInitiale?.email ?? "");
  const [dateNaissance, setDateNaissance] = useState(valeurInitiale?.dateNaissance ?? "");
  const [filiere, setFiliere] = useState(valeurInitiale?.filiere ?? "");
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, setEnCours] = useState(false);

  async function soumettre(evenement: FormEvent) {
    evenement.preventDefault();
    setErreur(null);
    setEnCours(true);

    const payload: EtudiantPayload = {
      nom: nom.trim(),
      prenom: prenom.trim(),
      email: email.trim(),
      dateNaissance: dateNaissance || null,
      filiere: filiere.trim() || null
    };

    try {
      await enregistrer(payload);
    } catch {
      setErreur("L'enregistrement a échoué. Vérifiez les champs et réessayez.");
    } finally {
      setEnCours(false);
    }
  }

  return (
    <form className="formulaire" onSubmit={soumettre}>
      <div className="champRangee">
        <label className="champ">
          Nom *
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            maxLength={100}
            required
          />
        </label>

        <label className="champ">
          Prénom *
          <input
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            maxLength={100}
            required
          />
        </label>
      </div>

      <label className="champ">
        Email *
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="prenom.nom@exemple.mg"
          required
        />
      </label>

      <div className="champRangee">
        <label className="champ">
          Date de naissance
          <input
            type="date"
            value={dateNaissance ?? ""}
            onChange={(e) => setDateNaissance(e.target.value)}
          />
        </label>

        <label className="champ">
          Filière
          <input
            type="text"
            value={filiere ?? ""}
            onChange={(e) => setFiliere(e.target.value)}
            maxLength={100}
            placeholder="Informatique…"
          />
        </label>
      </div>

      {erreur && <p className="messageErreur">{erreur}</p>}

      <div className="actions">
        <button type="submit" className="bouton boutonPrincipal" disabled={enCours}>
          {enCours ? "Enregistrement…" : valeurInitiale ? "Enregistrer" : "Créer l'étudiant"}
        </button>
        <button type="button" className="bouton boutonSecondaire" onClick={annuler} disabled={enCours}>
          Annuler
        </button>
      </div>
    </form>
  );
}
