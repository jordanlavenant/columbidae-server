import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { Comment, Post, User, Rourou } from 'generated/prisma/browser'
import { PrismaClient } from 'generated/prisma/client'
import * as bcrypt from 'bcrypt'

async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  return { hashedPassword, salt }
}

const createUsers = async (): Promise<Omit<User, 'createdAt'>[]> => {
  const john = await hashPassword('john')
  const jane = await hashPassword('jane')
  const marc = await hashPassword('marc')
  const alice = await hashPassword('alice')
  const bob = await hashPassword('bob')
  const clara = await hashPassword('clara')

  return [
    {
      id: '1',
      email: 'john.doe@example.com',
      username: 'johndoe',
      name: 'John Doe',
      password: john.hashedPassword,
      salt: john.salt,
      provider: 'local',
      providerId: null,
      defaultRourouId: null,
      avatarId: null,
    },
    {
      id: '2',
      email: 'jane.doe@example.com',
      username: 'janedoe',
      name: 'Jane Doe',
      password: jane.hashedPassword,
      salt: jane.salt,
      provider: 'local',
      providerId: null,
      defaultRourouId: null,
      avatarId: null,
    },
    {
      id: '3',
      email: 'marc.roussel@example.com',
      username: 'marcroussel',
      name: 'Marc Roussel',
      password: marc.hashedPassword,
      salt: marc.salt,
      provider: 'local',
      providerId: null,
      defaultRourouId: null,
      avatarId: null,
    },
    {
      id: '4',
      email: 'alice@example.com',
      username: 'alicemartin',
      name: 'Alice Martin',
      password: alice.hashedPassword,
      salt: alice.salt,
      provider: 'local',
      providerId: null,
      defaultRourouId: null,
      avatarId: null,
    },
    {
      id: '5',
      email: 'bob@example.com',
      username: 'bobdupont',
      name: 'Bob Dupont',
      password: bob.hashedPassword,
      salt: bob.salt,
      provider: 'local',
      providerId: null,
      defaultRourouId: null,
      avatarId: null,
    },
    {
      id: '6',
      email: 'clara@example.com',
      username: 'claralopez',
      name: 'Clara Lopez',
      password: clara.hashedPassword,
      salt: clara.salt,
      provider: 'local',
      providerId: null,
      defaultRourouId: null,
      avatarId: null,
    },
  ]
}

const posts: Post[] = [
  {
    id: '1',
    content: 'This is my first post on Columbidae!',
    authorId: '1',
    createdAt: new Date(),
  },
  {
    id: '2',
    content: 'Prisma + PostgreSQL is such a powerful combo 🚀',
    authorId: '2',
    createdAt: new Date(),
  },
  {
    id: '3',
    content: 'Working on a new feature today… stay tuned 👀',
    authorId: '3',
    createdAt: new Date(),
  },
  {
    id: '4',
    content: 'Just discovered how cool React hooks are!',
    authorId: '4',
    createdAt: new Date(),
  },
  {
    id: '5',
    content: 'Backend days are the best days.',
    authorId: '3',
    createdAt: new Date(),
  },
  {
    id: '6',
    content: 'Coffee ☕ + code = happiness.',
    authorId: '5',
    createdAt: new Date(),
  },
  {
    id: '7',
    content: 'TypeScript makes everything safer.',
    authorId: '6',
    createdAt: new Date(),
  },
  {
    id: '8',
    content: 'Deploying to production… fingers crossed 🤞',
    authorId: '1',
    createdAt: new Date(),
  },
]

const comments: Comment[] = [
  {
    id: '1',
    comment: 'Great post!',
    postId: '1',
    authorId: '2',
    createdAt: new Date(),
  },
  {
    id: '2',
    comment: 'Totally agree!',
    postId: '2',
    authorId: '3',
    createdAt: new Date(),
  },
  {
    id: '3',
    comment: 'Can’t wait to see it 👀',
    postId: '3',
    authorId: '4',
    createdAt: new Date(),
  },
  {
    id: '4',
    comment: 'Hooks changed my life too 😂',
    postId: '4',
    authorId: '1',
    createdAt: new Date(),
  },
  {
    id: '5',
    comment: 'Backend supremacy.',
    postId: '5',
    authorId: '5',
    createdAt: new Date(),
  },
]

const rourous: Rourou[] = [
  {
    id: '1',
    name: 'laughing_rourou',
    authorId: '2',
    postId: '1',
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'admiring_rourou',
    authorId: '3',
    postId: '2',
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'casual_rourou',
    authorId: '4',
    postId: '3',
    createdAt: new Date(),
  },
  {
    id: '4',
    name: 'surprised_rourou',
    authorId: '5',
    postId: '3',
    createdAt: new Date(),
  },
  {
    id: '5',
    name: 'angry_rourou',
    authorId: '6',
    postId: '6',
    createdAt: new Date(),
  },
  {
    id: '6',
    name: 'sad_rourou',
    authorId: '1',
    postId: '7',
    createdAt: new Date(),
  },
  {
    id: '7',
    name: 'laughing_rourou',
    authorId: '3',
    postId: '8',
    createdAt: new Date(),
  },
]

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({
  adapter,
})

async function main() {
  console.log('Seeding database...')

  const users = await createUsers()

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: user,
    })
  }

  for (const post of posts) {
    await prisma.post.upsert({
      where: { id: post.id },
      update: {},
      create: post,
    })
  }

  for (const comment of comments) {
    await prisma.comment.upsert({
      where: { id: comment.id },
      update: {},
      create: comment,
    })
  }

  for (const rourou of rourous) {
    await prisma.rourou.upsert({
      where: { id: rourou.id },
      update: {},
      create: rourou,
    })
  }

  console.log('Seeding completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
