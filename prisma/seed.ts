import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { Post, PrismaClient, User } from '../generated/prisma'

const users: User[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    name: 'John Doe',
  },
  {
    id: '2',
    email: 'jane.doe@example.com',
    name: 'Jane Doe',
  },
]

const posts: Post[] = [
  {
    id: '1',
    title: 'Hello World',
    content: 'This is my first post!',
    authorId: '1',
  },
  {
    id: '2',
    title: 'Prisma is Awesome',
    content: 'Let me tell you why Prisma is so great...',
    authorId: '2',
  },
]

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({
  adapter,
})

async function main() {
  console.log('Seeding database...')

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
