import { Module } from '@nestjs/common'
import { RourousController } from './rourous.controller'
import { RourousService } from './rourou.service'
import { PrismaService } from '@/prisma.service'

@Module({
  controllers: [RourousController],
  providers: [PrismaService, RourousService],
  exports: [RourousService],
})
export class RourousModule {}
