import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Param,
  Post,
} from '@nestjs/common'
import { RourousService } from './rourou.service'
import { Rourou as RourouModel } from 'generated/prisma/browser'
import { CreateRourouDto } from './dto/create-rourou.dto'
import { UpdateRourouDto } from './dto/update-rourou.dto'

@Controller('api/rourous')
export class RourousController {
  constructor(private readonly appService: RourousService) {}

  @Get()
  async getAll(): Promise<RourouModel[]> {
    return this.appService.rourous({})
  }

  // @UseGuard(LocalAuthGuard)
  @Post()
  async create(@Body() createRourouDto: CreateRourouDto): Promise<RourouModel> {
    return this.appService.createRourou(createRourouDto)
  }

  @Get(':postId')
  async getByPostId(@Param('postId') postId: string): Promise<RourouModel[]> {
    return this.appService.rourous({ where: { postId: postId } })
  }

  // @UseGuard(LocalAuthGuard)
  @Patch(':rourouId')
  async updateRourouName(
    @Param('rourouId') id: string,
    @Body() updateRourouDto: UpdateRourouDto,
  ): Promise<RourouModel> {
    return this.appService.updateRourou({
      where: { id },
      data: updateRourouDto,
    })
  }

  // @UseGuards(LocalAuthGuard)
  @Delete(':rourouId')
  async delete(@Param('rourouId') id: string): Promise<RourouModel> {
    return this.appService.deleteRourou({ id })
  }
}
