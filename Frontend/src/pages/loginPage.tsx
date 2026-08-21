import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { ApiError } from "../api/apiClient";

type Mode = "connexion" | "inscription";

export default function LoginPage() {
  const { connexion, inscription } = useAuth();
  const naviguer = useNavigate();

  const [mode, setMode] = useState<Mode>("connexion");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [enCours, setEnCours] = useState(false);

  async function soumettre(evenement: FormEvent) {
    evenement.preventDefault();
    setErreur(null);
    setEnCours(true);
    try {
      if (mode === "connexion") {
        await connexion(email, motDePasse);
      } else {
        await inscription(email, motDePasse);
      }
      naviguer("/etudiants");
    } catch (e) {
      setErreur(e instanceof ApiError ? e.message : "Une erreur inattendue est survenue.");
    } finally {
      setEnCours(false);
    }
  }

  return (
    <main className="page pageCentree">
      <section className="carte carteEtroite">
        <h1 className="titre">Gestion Étudiants</h1>
        <p className="sousTitre">
          {mode === "connexion" ? "Connectez-vous pour continuer." : "Créez votre compte."}
        </p>

        <div className="onglets">
          <button
            type="button"
            className={mode === "connexion" ? "onglet ongletActif" : "onglet"}
            onClick={() => setMode("connexion")}
          >
            Connexion
          </button>
          <button
            type="button"
            className={mode === "inscription" ? "onglet ongletActif" : "onglet"}
            onClick={() => setMode("inscription")}
          >
            Inscription
          </button>
        </div>

        <form className="formulaire" onSubmit={soumettre}>
          <label className="champ">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.mg"
              required
            />
          </label>

          <label className="champ">
            Mot de passe
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              placeholder="Au moins 6 caractères"
              minLength={6}
              required
            />
          </label>

          {erreur && <p className="messageErreur">{erreur}</p>}

          <button type="submit" className="bouton boutonPrincipal" disabled={enCours}>
            {enCours ? "Veuillez patienter…" : mode === "connexion" ? "Se connecter" : "S'inscrire"}
          </button>
        </form>
      </section>
    </main>
  );
}
