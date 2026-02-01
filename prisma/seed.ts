import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { Comment, Post, User } from 'generated/prisma/browser'
import { PrismaClient } from 'generated/prisma/client'
import * as bcrypt from 'bcrypt'

async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  return { hashedPassword, salt }
}

const createUsers = async (): Promise<Omit<User, 'createdAt'>[]> => {
  const user1Password = await hashPassword('john')
  const user2Password = await hashPassword('jane')

  return [
    {
      id: '1',
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: user1Password.hashedPassword,
      salt: user1Password.salt,
      provider: 'local',
      providerId: null,
      defaultRourouId: null,
    },
    {
      id: '2',
      email: 'jane.doe@example.com',
      name: 'Jane Doe',
      password: user2Password.hashedPassword,
      salt: user2Password.salt,
      provider: 'local',
      providerId: null,
      defaultRourouId: null,
    },
  ]
}

const posts: Post[] = [
  {
    id: '1',
    content: 'This is my first post!',
    authorId: '1',
    createdAt: new Date(),
  },
  {
    id: '2',
    content: 'Let me tell you why Prisma is so great...',
    authorId: '2',
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
    comment: 'Thanks for sharing!',
    postId: '2',
    authorId: '1',
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
