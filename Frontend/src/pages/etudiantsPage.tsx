import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { ApiError, creerEtudiant, listerEtudiants, remplacerEtudiant, supprimerEtudiant } from "../api/apiClient";
import { Etudiant, EtudiantPayload } from "../types/etudiant";
import EtudiantForm from "../components/etudiantForm";

export default function EtudiantsPage() {
  const { utilisateur, deconnexion } = useAuth();
  const naviguer = useNavigate();

  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [chargement, setChargement] = useState(true);
  const [messageErreur, setMessageErreur] = useState<string | null>(null);
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [etudiantEnEdition, setEtudiantEnEdition] = useState<Etudiant | null>(null);

  const gererDeconnexion = useCallback(() => {
    deconnexion();
    naviguer("/login");
  }, [deconnexion, naviguer]);

  const charger = useCallback(async () => {
    setChargement(true);
    setMessageErreur(null);
    try {
      const liste = await listerEtudiants();
      setEtudiants(liste);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        gererDeconnexion();
        return;
      }
      setMessageErreur("Impossible de charger la liste des étudiants.");
    } finally {
      setChargement(false);
    }
  }, [gererDeconnexion]);

  useEffect(() => {
    void charger();
  }, [charger]);

  async function enregistrer(payload: EtudiantPayload) {
    if (etudiantEnEdition) {
      await remplacerEtudiant(etudiantEnEdition.id, payload);
    } else {
      await creerEtudiant(payload);
    }
    setFormulaireOuvert(false);
    setEtudiantEnEdition(null);
    await charger();
  }

  async function supprimer(etudiant: Etudiant) {
    if (!window.confirm(`Supprimer ${etudiant.prenom} ${etudiant.nom} ?`)) {
      return;
    }
    setMessageErreur(null);
    try {
      await supprimerEtudiant(etudiant.id);
      await charger();
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        gererDeconnexion();
        return;
      }
      setMessageErreur("La suppression a échoué.");
    }
  }

  function ouvrirCreation() {
    setEtudiantEnEdition(null);
    setFormulaireOuvert(true);
  }

  function ouvrirEdition(etudiant: Etudiant) {
    setEtudiantEnEdition(etudiant);
    setFormulaireOuvert(true);
  }

  function fermerFormulaire() {
    setFormulaireOuvert(false);
    setEtudiantEnEdition(null);
  }

  function formaterDate(valeur: string | null): string {
    if (!valeur) {
      return "—";
    }
    const [annee, mois, jour] = valeur.split("-");
    return `${jour}/${mois}/${annee}`;
  }

  return (
    <main className="page">
      <header className="enTete">
        <h1 className="titre">Gestion Étudiants</h1>
        <div className="enTeteActions">
          <span className="utilisateur">{utilisateur?.email}</span>
          <button type="button" className="bouton boutonSecondaire" onClick={gererDeconnexion}>
            Se déconnecter
          </button>
        </div>
      </header>

      {formulaireOuvert && (
        <section className="carte carteFormulaire">
          <h2 className="sousTitre">
            {etudiantEnEdition
              ? `Modifier ${etudiantEnEdition.prenom} ${etudiantEnEdition.nom}`
              : "Nouvel étudiant"}
          </h2>
          <EtudiantForm
            valeurInitiale={etudiantEnEdition}
            annuler={fermerFormulaire}
            enregistrer={enregistrer}
          />
        </section>
      )}

      <section className="carte">
        <div className="enTete">
          <h2 className="sousTitre">Liste des étudiants</h2>
          {!formulaireOuvert && (
            <button type="button" className="bouton boutonPrincipal" onClick={ouvrirCreation}>
              + Nouvel étudiant
            </button>
          )}
        </div>

        {messageErreur && <p className="messageErreur">{messageErreur}</p>}

        {chargement ? (
          <p>Chargement…</p>
        ) : etudiants.length === 0 ? (
          <p>Aucun étudiant enregistré. Cliquez sur « Nouvel étudiant » pour commencer.</p>
        ) : (
          <table className="tableau">
            <thead>
              <tr>
                <th>#</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Naissance</th>
                <th>Filière</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {etudiants.map((etudiant) => (
                <tr key={etudiant.id}>
                  <td>{etudiant.id}</td>
                  <td>{etudiant.nom}</td>
                  <td>{etudiant.prenom}</td>
                  <td>{etudiant.email}</td>
                  <td>{formaterDate(etudiant.dateNaissance)}</td>
                  <td>{etudiant.filiere ?? "—"}</td>
                  <td>
                    <div className="actions">
                      <button
                        type="button"
                        className="bouton boutonSecondaire"
                        onClick={() => ouvrirEdition(etudiant)}
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        className="bouton boutonDanger"
                        onClick={() => supprimer(etudiant)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
