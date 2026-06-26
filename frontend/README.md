# SimDraw Frontend

Client React du projet SimDraw, construit avec Vite et TypeScript.

## Objectif

Le frontend fournit l'interface utilisateur pour :

- naviguer entre les pages principales de l'application
- gérer la connexion et le compte utilisateur
- créer et consulter des dessins
- participer à un tour de dessin
- commenter et liker des créations
- rechercher et filtrer les dessins

## Stack technique

- React 19
- TypeScript
- Vite
- React Router
- Vitest
- Testing Library

## Pages principales

Les routes principales déclarées dans l'application incluent :

- `/`
- `/search`
- `/by`
- `/login`
- `/subscription`
- `/account`
- `/drawing/create`
- `/draw`
- `/draw/:id`
- `/theme`
- `/drawing/:id`

## Structure

```text
frontend/
├── public/
├── src/
│   ├── components/
│   ├── context/
│   ├── helpers/
│   ├── images/
│   ├── Page/
│   ├── types/
│   ├── App.tsx
│   ├── config.ts
│   └── main.tsx
├── package.json
└── vite.config.ts
```

## Installation

```bash
cd frontend
npm install
```

## Variables d'environnement

Le frontend utilise `VITE_API_URL` pour cibler l'API. Sans configuration, il utilise :

```text
http://localhost:8090
```

## Scripts disponibles

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Lance le serveur Vite |
| `npm run build` | Compile TypeScript et build l'application |
| `npm run preview` | Prévisualise le build de production |
| `npm run lint` | Lance ESLint |
| `npm test` | Exécute les tests frontend |
| `npm run test:watch` | Lance Vitest en watch |
| `npm run test:coverage` | Exécute les tests avec couverture |
| `npm run test:ui` | Lance l'interface Vitest |

## Lancement

```bash
cd frontend
npm run dev
```

## Architecture fonctionnelle

- `src/context/` contient le contexte d'authentification
- `src/components/` regroupe les composants réutilisables
- `src/Page/` contient les pages routées
- `src/config.ts` centralise l'URL de l'API

## Tests

Des tests existent déjà pour plusieurs composants, notamment :

- boutons
- barre de recherche
- statut utilisateur
- canvas
- réactions
- informations de dessin

Exécution :

```bash
cd frontend
npm test
```

## Statut

Le frontend est fonctionnel pour servir de client à l'API principale. Certaines parties restent en cours d'alignement avec le backend, ce qui est normal dans un projet encore en développement.
