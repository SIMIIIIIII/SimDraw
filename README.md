# SimDraw

Application web de dessin collaboratif permettant à plusieurs utilisateurs de créer des dessins ensemble en temps réel.

## 📋 Description

SimDraw est une plateforme de dessin collaborative où les utilisateurs peuvent :
- Créer et participer à des sessions de dessin en groupe
- Dessiner à tour de rôle sur un canvas partagé
- Commenter et liker les créations
- Gérer leur profil avec un avatar emoji personnalisé

## 🏗️ Architecture

```
SimDraw/
├── backend/          # API REST Express.js + TypeScript
│   ├── src/
│   │   ├── config/       # Configuration (base de données, etc.)
│   │   ├── controllers/  # Logique métier
│   │   ├── middlewares/  # Middlewares (validation, auth, etc.)
│   │   ├── models/       # Modèles Mongoose (User, Drawing, Comment)
│   │   ├── routes/       # Routes API
│   │   ├── types/        # Types TypeScript
│   │   └── utils/        # Utilitaires
│   └── tests/            # Tests unitaires (Vitest)
└── frontend/         # Application cliente (à venir)
```

## 🛠️ Technologies

### Backend
- **Node.js** avec **Express.js 5**
- **TypeScript** pour le typage statique
- **MongoDB** avec **Mongoose** pour la base de données
- **Vitest** pour les tests unitaires
- **Nodemon** pour le développement

## 📦 Installation

### Prérequis
- Node.js (v18+)
- MongoDB

### Backend

```bash
cd backend
npm install
```

## 🚀 Lancement

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

## 🧪 Tests

```bash
cd backend
npm test              # Exécuter les tests
npm run test:watch    # Mode watch
npm run test:coverage # Avec couverture de code
npm run test:ui       # Interface graphique Vitest
```

## 📊 Modèles de données

### User
- `username` : Nom d'utilisateur unique (min 6 caractères)
- `name` : Nom complet
- `email` : Email unique
- `password` : Mot de passe (min 8 caractères)
- `drawings` : Liste des dessins de l'utilisateur
- `admin` : Statut administrateur
- `emoji` : Avatar emoji personnalisé

### Drawing
- `title` : Titre du dessin
- `theme` : Thème du dessin
- `description` : Description optionnelle
- `participants` : Liste des participants avec leurs créneaux
- `maxParticipants` : Nombre maximum de participants
- `path` : Données du dessin (points, couleurs, tailles)
- `author` : Auteur du dessin
- `likes` / `whoLiked` : Système de likes
- `isDone` : Dessin terminé
- `isPublic` : Visibilité publique

### Comment
- `comment` : Contenu du commentaire
- `postId` : ID du dessin associé
- `author` : Auteur du commentaire

## 📝 Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Lance le serveur en mode développement |
| `npm run build` | Compile TypeScript vers JavaScript |
| `npm start` | Lance le serveur compilé |
| `npm run start:prod` | Build + start |
| `npm test` | Exécute les tests |
| `npm run test:coverage` | Tests avec couverture |

## 📄 Licence

ISC