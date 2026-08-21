import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import {
  connecter,
  effacerSession,
  enregistrerSession,
  inscrire,
  obtenirToken,
  obtenirUtilisateur
} from "../api/apiClient";
import { UtilisateurAuth } from "../types/api";

interface AuthContextValeur {
  token: string | null;
  utilisateur: UtilisateurAuth | null;
  connexion: (email: string, motDePasse: string) => Promise<void>;
  inscription: (email: string, motDePasse: string) => Promise<void>;
  deconnexion: () => void;
}

const AuthContext = createContext<AuthContextValeur | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(obtenirToken());
  const [utilisateur, setUtilisateur] = useState<UtilisateurAuth | null>(obtenirUtilisateur());

  const valeur = useMemo<AuthContextValeur>(
    () => ({
      token,
      utilisateur,
      connexion: async (email: string, motDePasse: string) => {
        const session = await connecter(email, motDePasse);
        enregistrerSession(session.token, session.utilisateur);
        setToken(session.token);
        setUtilisateur(session.utilisateur);
      },
      inscription: async (email: string, motDePasse: string) => {
        const session = await inscrire(email, motDePasse);
        enregistrerSession(session.token, session.utilisateur);
        setToken(session.token);
        setUtilisateur(session.utilisateur);
      },
      deconnexion: () => {
        effacerSession();
        setToken(null);
        setUtilisateur(null);
      }
    }),
    [token, utilisateur]
  );

  return <AuthContext.Provider value={valeur}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValeur {
  const contexte = useContext(AuthContext);
  if (!contexte) {
    throw new Error("useAuth doit être utilisé à l'intérieur de AuthProvider.");
  }
  return contexte;
}
