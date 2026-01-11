import { Module } from '@nestjs/common'
import { CommentsController } from './comments.controller'
import { CommentsService } from './comment.service'
import { PrismaService } from '@/prisma.service'

@Module({
  controllers: [CommentsController],
  providers: [PrismaService, CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
