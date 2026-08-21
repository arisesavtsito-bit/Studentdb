import { useAuth } from "../context/authContext";

export default function EtudiantsPage() {
  const { utilisateur, deconnexion } = useAuth();

  return (
    <main className="page">
      <header className="enTete">
        <h1 className="titre">Gestion Étudiants</h1>
        <div className="enTeteActions">
          <span className="utilisateur">{utilisateur?.email}</span>
          <button type="button" className="bouton boutonSecondaire" onClick={deconnexion}>
            Se déconnecter
          </button>
        </div>
      </header>

      <section className="carte">
        <p>La gestion des étudiants sera disponible dans la prochaine itération.</p>
      </section>
    </main>
  );
}
