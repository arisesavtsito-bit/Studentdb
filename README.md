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

## Déploiement sur Render

Le dépôt contient un Blueprint Render ([`render.yaml`](render.yaml)) qui déploie les deux composants :
une base PostgreSQL et le backend (Web Service Node).

### Méthode 1 : Blueprint automatique

1. Pousser `develop` puis fusionner dans `main` via Pull Request.
2. Sur [dashboard.render.com](https://dashboard.render.com) : **New → Blueprint**, sélectionner le repo.
   Render lit `render.yaml` et pré-remplit tout (base + API), sans aucune variable à saisir.
3. Le schéma SQL est appliqué automatiquement au démarrage du backend (`initDb`, idempotent).

### Méthode 2 : services manuels

| Service | Type | Root directory | Build command | Start command |
| ------- | ---- | -------------- | ------------- | ------------- |
| `gestion-etudiants-db`  | PostgreSQL          | —        | —                        | —            |
| `gestion-etudiants-api` | Web Service (Node)  | `Backend`| `npm ci && npm run build`| `npm start`  |

**Variables d'environnement du backend** (dashboard Render, jamais en dur dans le code) :
reporter les informations de connexion « Internal Database URL » de la base Render :

| Variable      | Valeur (page Info de la base Render) |
| ------------- | ------------------------------------ |
| `DB_HOST`     | Host                                 |
| `DB_PORT`     | Port                                 |
| `DB_USER`     | Username                             |
| `DB_PASSWORD` | Password                             |
| `DB_NAME`     | Database                             |
| `JWT_SECRET`  | longue chaîne aléatoire              |
| `PORT`        | `3000`                               |

### Notes importantes

- Les instances gratuites Render s'endorment après ~15 min d'inactivité : la première requête
  peut prendre 30 à 60 secondes.
- La base PostgreSQL gratuite expire après 30 jours : pensez à la recréer ou migrer si besoin.
- En cas de connexion à une base externe chiffrée, ajouter la variable `DB_SSL=true`.

