import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { Comment, Post, User } from 'generated/prisma/browser'
import { PrismaClient } from 'generated/prisma/client'

const users: User[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    name: 'John Doe',
    createdAt: new Date(),
    defaultRourouId: null,
  },
  {
    id: '2',
    email: 'jane.doe@example.com',
    name: 'Jane Doe',
    createdAt: new Date(),
    defaultRourouId: null,
  },
]

const posts: Post[] = [
  {
    id: '1',
    title: 'Hello World',
    content: 'This is my first post!',
    authorId: '1',
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Prisma is Awesome',
    content: 'Let me tell you why Prisma is so great...',
    authorId: '2',
    createdAt: new Date(),
  },
]

const comments: Comment[] = [
  {
    id: '1',
    comment: 'Great post!',
    postId: posts[0].id,
    authorId: users[1].id,
    createdAt: new Date(),
  },
  {
    id: '2',
    comment: 'Thanks for sharing!',
    postId: posts[1].id,
    authorId: users[0].id,
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
