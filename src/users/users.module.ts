import { Module } from '@nestjs/common'
import { UsersService } from './user.service'
import { UsersController } from './users.controller'
import { PrismaService } from '@/prisma.service'

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [PrismaService, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
