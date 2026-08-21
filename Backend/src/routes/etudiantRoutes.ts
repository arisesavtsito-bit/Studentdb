import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  creer,
  lister,
  modifierPartiellement,
  obtenirUn,
  remplacer,
  supprimer
} from "../controllers/etudiantController";

const etudiantRoutes = Router();

etudiantRoutes.use(authMiddleware);

etudiantRoutes.get("/", lister);
etudiantRoutes.post("/", creer);
etudiantRoutes.get("/:id", obtenirUn);
etudiantRoutes.put("/:id", remplacer);
etudiantRoutes.patch("/:id", modifierPartiellement);
etudiantRoutes.delete("/:id", supprimer);

export default etudiantRoutes;
