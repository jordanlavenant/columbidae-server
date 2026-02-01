import { Controller, Get } from '@nestjs/common'
import { RourousService } from './rourou.service'
import { Rourou as RourouModel } from 'generated/prisma/browser'

@Controller('api/rourous')
export class RourousController {
  constructor(private readonly appService: RourousService) {}

  @Get()
  async getAll(): Promise<RourouModel[]> {
    return this.appService.rourous({})
  }
}
