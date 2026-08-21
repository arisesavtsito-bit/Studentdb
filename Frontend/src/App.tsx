import { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/authContext";
import LoginPage from "./pages/loginPage";
import EtudiantsPage from "./pages/etudiantsPage";

function RouteProtegee({ children }: { children: ReactNode }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/etudiants"
        element={
          <RouteProtegee>
            <EtudiantsPage />
          </RouteProtegee>
        }
      />
      <Route path="*" element={<Navigate to="/etudiants" replace />} />
    </Routes>
  );
}
