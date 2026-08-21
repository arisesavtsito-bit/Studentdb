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

## Déploiement sur Render

Le dépôt contient un Blueprint Render ([`render.yaml`](render.yaml)) qui déploie les trois composants :
une base PostgreSQL, le backend (Web Service Node) et le frontend (Static Site).

### Méthode 1 : Blueprint automatique

1. Pousser `main` sur GitHub (via Pull Requests).
2. Sur [dashboard.render.com](https://dashboard.render.com) : **New → Blueprint**, sélectionner le repo
   `Studentdb`. Render lit `render.yaml` et pré-remplit tout.
3. Renseigner la seule variable demandée : `VITE_API_URL`
   (ex. `https://gestion-etudiants-api.onrender.com`) puis **Apply**.
4. Le schéma SQL est appliqué automatiquement au démarrage du backend (`initDb`, idempotent).

### Méthode 2 : services manuels

| Service | Type | Root directory | Build command | Start / Publish |
| ------- | ---- | -------------- | ------------- | ---------------- |
| `gestion-etudiants-api` | Web Service (Node) | `Backend` | `npm ci && npm run build` | `npm start` |
| `gestion-etudiants-web` | Static Site | `Frontend` | `npm ci && npm run build` | publish `dist` |

**Variables d'environnement du backend** (dashboard Render, jamais en dur dans le code) :
créer d'abord une instance PostgreSQL (**New → PostgreSQL**) et reporter ses informations
de connexion « Internal Database URL » :

| Variable    | Valeur (page Info de la base Render) |
| ----------- | ------------------------------------ |
| `DB_HOST`   | Host                                 |
| `DB_PORT`   | Port                                 |
| `DB_USER`   | Username                             |
| `DB_PASSWORD` | Password                           |
| `DB_NAME`   | Database                             |
| `JWT_SECRET`| longue chaîne aléatoire              |
| `PORT`      | `3000`                               |

**Variable d'environnement du frontend** :

| Variable       | Valeur                                        |
| -------------- | --------------------------------------------- |
| `VITE_API_URL` | URL publique du backend, ex. `https://<nom>.onrender.com` |

⚠️ `VITE_API_URL` est injectée **au moment du build** par Vite : si vous la modifiez après le
premier déploiement, déclencher un **Manual Deploy** sur le service frontend.

### Notes importantes

- Les instances gratuites Render s'endorment après ~15 min d'inactivité : la première requête
  peut prendre 30 à 60 secondes.
- La base PostgreSQL gratuite expire après 30 jours : pensez à la recréer ou migrer si besoin.
- En cas de connexion à une base externe chiffrée, ajouter la variable `DB_SSL=true`.

