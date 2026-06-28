# SimDraw

SimDraw est un projet fullstack de dessin collaboratif. L'application combine une API Express en TypeScript et un client React/Vite pour permettre la création de dessins, la participation à des tours de jeu, les commentaires, les likes et la gestion de compte.

## Vue d'ensemble

Le projet est organisé en deux applications principales :

- `backend/` : API REST Express + TypeScript + MongoDB/Mongoose
- `frontend/` : client React + TypeScript + Vite

## Fonctionnalités principales

- inscription, connexion et déconnexion
- consultation du profil utilisateur
- création, modification, suppression et consultation de dessins
- participation à une session de dessin à tour de rôle
- commentaires sur les dessins
- likes et affichage de listes filtrées
- recherche et navigation par auteur ou par thème

## Structure du dépôt

```text
SimDraw/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── types/
│   │   └── utils/
│   └── tests/
├── frontend/
│   └── simdraw/
│       ├── src/
│       │   ├── components/
│       │   ├── context/
│       │   ├── helpers/
│       │   ├── Page/
│       │   └── types/
│       └── public/
```

## Stack technique

### Installation backend

- Node.js
- Express 5
- TypeScript
- MongoDB avec Mongoose
- express-session
- Helmet, CORS, rate limiting
- Vitest et Supertest

### Installation frontend

- React 19
- TypeScript
- Vite
- React Router
- Testing Library et Vitest

## Installation

### Prérequis

- Node.js 18 ou plus
- npm
- MongoDB

### Tests backend

```bash
cd backend
npm install
```

### Tests frontend

```bash
cd frontend
npm install
```

## Lancement en développement

### Démarrer le backend

```bash
cd backend
npm run dev
```

### Démarrer le frontend

```bash
cd frontend
npm run dev
```

Le frontend utilise `VITE_API_URL` et pointe par défaut vers `http://localhost:8090`.

## Tests

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test
```

## Documentation API
### Swagger UI (interactif)
Lancer le backend puis ouvrir :
http://localhost:8090/api-docs

## Documentation par application

- voir `backend/README.md` pour l'API, les routes et les scripts serveur
- voir `frontend/README.md` pour le client React, les pages et les scripts frontend

## Statut

Le projet est en cours de développement. Le socle backend et le client principal sont présents, avec des tests backend et frontend déjà en place.

## Licence

ISC
