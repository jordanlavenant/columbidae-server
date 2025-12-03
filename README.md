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

```
DATABASE_URL=<your database connection url>
```

5. Démarrer la base de données PostgreSQL avec Docker

```bash
docker compose up -d
```

6. Effectuer les migrations

```bash
npx prisma migrate dev
```

## Démarrer le serveur de développement

```bash
npm start
```

## Routes

## Posts

- **GET `/api/posts`** : Obtenir tous les posts (feed)
- **POST `/api/posts`** : Créer un nouveau post
  - `title: string`
  - `content: string`
  - `authorId: string`
- **GET `/api/posts/:id`** : Obtenir un post par son ID
- **DELETE `/api/posts/:id`** : Supprimer un post par son ID
- **GET `/api/posts/filtered-posts/:searchString`** : Obtenir les posts filtrés par une chaîne de recherche

## Users

- **GET `/api/posts`** : Obtenir tous les users
- **POST `/api/users`** : Créer un nouvel user
  - `username: string`
  - `email: string`
- **GET `/api/users/:id`** : Obtenir un user par son ID
