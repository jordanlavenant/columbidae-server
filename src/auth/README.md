# Module d'Authentification

## Configuration

1. Copier `.env.example` vers `.env` et configurer `JWT_SECRET` :

```bash
cp .env.example .env
```

2. Lancer la migration Prisma pour ajouter les champs d'authentification :

```bash
npx prisma migrate dev --name add-auth-fields
```

3. Générer le client Prisma :

```bash
npx prisma generate
```

4. Seeder la base de données :

```bash
npm run seed
```

## Utilisateurs de test

Après le seed, vous aurez ces utilisateurs :

- Email: `john.doe@example.com` / Password: `password123`
- Email: `jane.doe@example.com` / Password: `password456`

## Endpoints API

### POST `/api/auth/register`

Créer un nouveau compte utilisateur.

**Body:**

```json
{
  "email": "user@example.com",
  "name": "User Name",
  "password": "password123"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### POST `/api/auth/login`

Se connecter avec un compte existant.

**Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### GET `/api/auth/profile`

Récupérer le profil de l'utilisateur connecté (nécessite authentification).

**Headers:**

```
Authorization: Bearer eyJhbGc...
```

**Response:**

```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "name": "User Name"
}
```

## Utilisation dans le code

### Protéger une route

```typescript
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Get('protected')
async getProtectedResource(@Request() req) {
  // req.user contient { userId, email, name }
  return { message: 'This is protected', user: req.user }
}
```

### Récupérer l'utilisateur connecté

```typescript
@UseGuards(JwtAuthGuard)
@Post('create-post')
async createPost(@Request() req, @Body() createPostDto: CreatePostDto) {
  const userId = req.user.userId
  // Utiliser userId pour créer le post
}
```

## Sécurité

- Les mots de passe sont hashés avec bcrypt (10 rounds)
- Chaque mot de passe a son propre salt
- Les tokens JWT expirent après 7 jours
- Le JWT_SECRET doit être changé en production

## Futurs providers OAuth

Le schéma est déjà préparé pour OAuth avec les champs :

- `provider`: 'local', 'google', 'github', 'apple'
- `providerId`: ID de l'utilisateur chez le provider

Pour implémenter Google OAuth par exemple :

1. Installer `passport-google-oauth20`
2. Créer une stratégie `GoogleStrategy`
3. Ajouter une route `/api/auth/google`
