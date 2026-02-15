import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { RourousService } from './rourou.service'
import { Rourou as RourouModel } from 'generated/prisma/browser'
import { CreateRourouDto } from './dto/create-rourou.dto'

@Controller('api/rourous')
export class RourousController {
  constructor(private readonly appService: RourousService) {}

  @Get()
  async getAll(): Promise<RourouModel[]> {
    return this.appService.rourous({})
  }

  @Get(':postId')
  async getByPostId(@Param('postId') postId: string): Promise<RourouModel[]> {
    return this.appService.rourous({ where: { postId: postId } })
  }

  @Post()
  async create(@Body() createRourouDto: CreateRourouDto): Promise<RourouModel> {
    return this.appService.createRourou(createRourouDto)
  }
}
