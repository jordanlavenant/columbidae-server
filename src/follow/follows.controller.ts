import { Body, Controller, Delete, Param, Post } from '@nestjs/common'
import { FollowsService } from './follow.service'
import { Follow as FollowModel } from 'generated/prisma/browser'
import { CreateFollowDto } from './dto/create-follow.dto'

@Controller('api/follows')
export class FollowsController {
  constructor(private readonly appService: FollowsService) {}

  @Post()
  async create(@Body() createFollowDto: CreateFollowDto): Promise<FollowModel> {
    return this.appService.createFollow(createFollowDto)
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<FollowModel> {
    return this.appService.deleteFollow({ id })
  }
}
