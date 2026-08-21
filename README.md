# Gestion Étudiants — API REST

API backend de gestion d'étudiants (CRUD complet) avec authentification JWT, prête à être déployée sur Render.

## Stack technique

| Couche    | Technologies                                |
| --------- | ------------------------------------------- |
| Backend   | Node.js, Express, TypeScript (CommonJS), pg |
| Base      | PostgreSQL                                  |
| Auth      | JWT (jsonwebtoken) + bcryptjs               |

## Structure du projet

```
Backend/          API REST Express (TypeScript compilé en CommonJS)
  sql/            Schema SQL de la base
  src/            Code source
```

## Démarrage rapide

### Prérequis

- Node.js >= 20
- PostgreSQL >= 14

### Installation

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

Le schéma SQL est appliqué automatiquement au démarrage du serveur (idempotent).

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

Toutes les routes `/etudiants` exigent l'en-tête `Authorization: Bearer <token>`
(token obtenu via `/auth/register` ou `/auth/login`, valide 1 heure).

Format des réponses JSON :

```json
{ "success": true, "data": { "...": "..." } }
{ "success": false, "message": "Description de l'erreur" }
```

## Tests d'API

- **Postman** : importer `Backend/postman/gestion-etudiants.postman_collection.json`
  (le token JWT est capturé automatiquement après inscription/connexion).
- **Thunder Client / VS Code REST Client** : ouvrir `Backend/requests.http`.

## Workflow Git

- `develop` : branche de travail — les commits y sont poussés directement.
- `main` : branche de production — ne reçoit que des merges de `develop` via Pull Request.
- Commits au format [Conventional Commits](https://www.conventionalcommits.org/fr-fr/) avec scope
  (ex. `feat(auth): ...`, `fix(db): ...`).
