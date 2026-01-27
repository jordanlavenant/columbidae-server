import { Module } from '@nestjs/common'
import { FollowsController } from './follows.controller'
import { FollowsService } from './follow.service'
import { PrismaService } from '@/prisma.service'

@Module({
  controllers: [FollowsController],
  providers: [PrismaService, FollowsService],
  exports: [FollowsService],
})
export class FollowsModule {}
