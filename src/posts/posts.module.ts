import { Module } from '@nestjs/common'
import { PostsController } from './posts.controller'
import { PostsService } from './post.service'
import { PrismaService } from '@/prisma.service'

@Module({
  imports: [],
  controllers: [PostsController],
  providers: [PrismaService, PostsService],
  exports: [PostsService],
})
export class PostsModule {}
