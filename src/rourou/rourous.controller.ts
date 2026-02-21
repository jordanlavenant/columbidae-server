import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Param,
  Post,
  Sse,
} from '@nestjs/common'
import { RourousService } from './rourou.service'
import { Rourou as RourouModel } from 'generated/prisma/browser'
import { CreateRourouDto } from './dto/create-rourou.dto'
import { UpdateRourouDto } from './dto/update-rourou.dto'
import { fromEvent, map, Observable } from 'rxjs'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ROUROU_EVENT } from '@/constants/events'

@Controller('api/rourous')
export class RourousController {
  constructor(
    private readonly appService: RourousService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get()
  async getAll(): Promise<RourouModel[]> {
    return this.appService.rourous({})
  }

  // @UseGuard(LocalAuthGuard)
  @Post()
  async create(@Body() createRourouDto: CreateRourouDto): Promise<RourouModel> {
    return this.appService.createRourou(createRourouDto)
  }

  @Sse('events')
  subscribeToEvents(): Observable<{ data: string }> {
    return fromEvent(this.eventEmitter, ROUROU_EVENT).pipe(
      map((payload) => {
        return {
          data: JSON.stringify(payload),
        }
      }),
    )
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
