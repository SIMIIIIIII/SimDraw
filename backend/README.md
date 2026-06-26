# SimDraw Backend

API REST du projet SimDraw, développée avec Express et TypeScript.

## Rôle du backend

Le backend gère :

- l'authentification par session
- la gestion des utilisateurs
- la création et la consultation des dessins
- la logique de tour de jeu pour le dessin collaboratif
- les commentaires et les likes
- la recherche et les listes filtrées

## Stack technique

- Node.js
- Express 5
- TypeScript
- MongoDB avec Mongoose
- express-session
- Helmet
- CORS
- express-rate-limit
- Vitest
- Supertest
- mongodb-memory-server

## Arborescence

```text
backend/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── types/
│   └── utils/
├── tests/
│   ├── factories/
│   ├── helpers/
│   ├── supertest/
│   └── unit/
└── package.json
```

## Installation

### Prérequis

- Node.js 18 ou plus
- npm
- MongoDB

### Installation des dépendances

```bash
cd backend
npm install
```

## Variables d'environnement

Le projet utilise un fichier `.env`. Vérifiez au minimum :

- le port d'écoute
- l'URL MongoDB
- les secrets de session
- la configuration CORS côté client

## Scripts disponibles

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Démarre le serveur avec nodemon |
| `npm run build` | Compile TypeScript dans `dist/` |
| `npm start` | Lance le serveur compilé |
| `npm run start:prod` | Build puis démarrage |
| `npm test` | Exécute toute la suite de tests |
| `npm run test:watch` | Lance Vitest en watch |
| `npm run test:coverage` | Exécute les tests avec couverture |
| `npm run test:ui` | Lance l'interface Vitest |

## Lancement

### Développement

```bash
cd backend
npm run dev
```

### Production

```bash
cd backend
npm run build
npm start
```

## Routes principales

### Home et recherche

- `GET /`
- `GET /by/author/:id`
- `GET /by/theme/:theme`
- `POST /research`
- `GET /my_drawings`

### Compte et administration

- `POST /account/login`
- `GET /account`
- `GET /account/logout`
- `GET /account/admin`
- `PUT /account/admin`
- `DELETE /account/admin`

### Inscription

- `POST /subscription`

### Dessins

- `POST /drawing`
- `GET /drawing/:id`
- `PUT /drawing/:id`
- `DELETE /drawing/:id`
- `PUT /drawing/like/:id`

### Session de dessin

- `GET /draw`
- `PUT /draw/:id`
- `PUT /draw/giveup/:id`

### Commentaires

- `POST /comment`
- `PUT /comment/:id`
- `DELETE /comment/:id`

## Sécurité et middleware

Le serveur applique notamment :

- `helmet` pour les en-têtes de sécurité
- `cors` avec configuration dédiée
- `express-session` pour les sessions
- des middlewares de validation et d'autorisation par route

## Tests

Les tests sont répartis en deux catégories :

- `tests/unit/` pour les modèles, utilitaires et middlewares
- `tests/supertest/` pour les routes HTTP

Exemple :

```bash
cd backend
npm test
```