# Columbidae Server

LAVENANT Jordan & ROUSSEL Marc - APP3 IIM

## Description

Serveur du projet **Columbidae**, qui distribue l'API, intéragit avec la base de données.

## Pre-requisites

- Node.js (20+)
- Docker

## Installation

1. Cloner le dépôt GitHub

```bash
git clone https://github.com/jordanlavenant/columbidae-server.git
```

2. Accéder au répertoire du projet

```bash
cd columbidae-server
```

3. Installer les dépendances

```bash
npm install
```

4. Configurer les variables d'environnement
   Créer un fichier `.env` à la racine du projet et ajouter les variables nécessaires (voir `.env.example` pour référence).

```bash
cp .env.example .env
```

```bash
# Database Configuration
DATABASE_URL=postgresql://columbidae:columbidae@localhost:5432/columbidae

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-me-in-production

# Server
PORT=3000

# MinIO Configuration
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ROOT_USER=enter-your-minio-root-user
MINIO_ROOT_PASSWORD=enter-your-minio-root-password
MINIO_BUCKET=assets-columbidae

# Client URL
CLIENT_URL=http://localhost:5173
```

Générer une clé secrète JWT :

```bash
openssl rand -base64 32
```

5. Démarrer la base de données PostgreSQL avec Docker

```bash
docker compose up --build -d
```

6. Effectuer les migrations

```bash
npx prisma migrate dev
```

7. Générer le client Prisma

```bash
npx prisma generate
```

## Exécuter la seed

```bash
npm run seed
```

## Démarrer le serveur de développement

```bash
npm start
```

## Réinitialiser la base de données

```bash
npx prisma migrate reset
```

## Ouvrir le Studio Prisma

```bash
npx prisma studio
```

## Routes

### Posts

- **GET `/api/posts`** : Obtenir tous les posts (feed)
- **POST `/api/posts`** : Créer un nouveau post
  - `title: string`
  - `content: string`
  - `authorId: string`
- **GET `/api/posts/filtered-posts/:searchString`** : Obtenir les posts filtrés par une chaîne de recherche
- **GET `/api/posts/:id`** : Obtenir un post par son ID
- **DELETE `/api/posts/:id`** : Supprimer un post par son ID

### Users

- **GET `/api/users`** : Obtenir tous les users
- **POST `/api/users`** : Créer un nouvel user
  - `username: string`
  - `email: string`
- **GET `/api/users/:id`** : Obtenir un user par son ID

---

Developed with ❤️ by @jordanlavenant & @marcroussel
