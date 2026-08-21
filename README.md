# Gestion Étudiants

Application fullstack de gestion d'étudiants (CRUD complet) avec authentification JWT, prête à être déployée sur Render.

## Stack technique

| Couche    | Technologies                                      |
| --------- | ------------------------------------------------- |
| Backend   | Node.js, Express, TypeScript (CommonJS), pg       |
| Base      | PostgreSQL                                        |
| Auth      | JWT (jsonwebtoken) + bcryptjs                     |
| Frontend  | React 18, TypeScript, Vite                        |

## Structure du projet

```
Backend/          API REST Express (TypeScript compilé en CommonJS)
  sql/            Schema SQL de la base
  src/            Code source
Frontend/         Client React + TypeScript (Vite)
```

## Démarrage rapide

### Prérequis

- Node.js >= 20
- PostgreSQL >= 14

### Backend

1. Créer la base de données :

   ```bash
   psql -U postgres -c "CREATE DATABASE gestion_etudiants OWNER <ton_user>;"
   ```

2. Copier `Backend/.env.example` vers `Backend/.env` et renseigner les variables
   (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `PORT`).

3. Installer les dépendances et lancer :

   ```bash
   cd Backend
   npm install
   npm run dev
   ```

### Frontend

1. Copier `Frontend/.env.example` vers `Frontend/.env` et renseigner `VITE_API_URL`
   (par défaut `http://localhost:3000`).

2. Installer les dépendances et lancer :

   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

## API REST

| Action                    | Méthode | URL            | Auth | Succès |
| ------------------------- | ------- | -------------- | ---- | ------ |
| Inscription               | POST    | /auth/register | non  | 201    |
| Connexion                 | POST    | /auth/login    | non  | 200    |
| Lister les étudiants      | GET     | /etudiants     | oui  | 200    |
| Lire un étudiant          | GET     | /etudiants/:id | oui  | 200    |
| Créer un étudiant         | POST    | /etudiants     | oui  | 201    |
| Remplacer un étudiant     | PUT     | /etudiants/:id | oui  | 200    |
| Modifier partiellement    | PATCH   | /etudiants/:id | oui  | 200    |
| Supprimer un étudiant     | DELETE  | /etudiants/:id | oui  | 204    |

## Tests d'API

- **Postman** : importer `Backend/postman/gestion-etudiants.postman_collection.json`.
- **Thunder Client / VS Code REST Client** : ouvrir `Backend/requests.http`.

## Workflow Git

- Jamais de push direct sur `main` : une branche par fonctionnalité
  (`feat/...`, `fix/...`, `refactor/...`, `docs/...`, `chore/...`).
- Commits au format [Conventional Commits](https://www.conventionalcommits.org/fr-fr/).
- Toute fusion vers `main` passe par une Pull Request.

## Déploiement

Voir la section [Déploiement sur Render](#déploiement-sur-render) (ajoutée avec la configuration Render).
