import { Module } from '@nestjs/common'
import { AssetsController } from './assets.controller'
import { AssetsService } from './asset.service'
import { PrismaService } from '@/prisma.service'

@Module({
  controllers: [AssetsController],
  providers: [PrismaService, AssetsService],
  exports: [AssetsService],
})
export class AssetsModule {}
