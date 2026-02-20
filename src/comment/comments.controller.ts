import { Body, Controller, Delete, Get, Param, Post, Sse } from '@nestjs/common'
import { CommentsService } from './comment.service'
import { Comment as CommentModel } from 'generated/prisma/browser'
import { CreateCommentDto } from './dto/create-comment.dto'
import { fromEvent, map, Observable } from 'rxjs'
import { EventEmitter2 } from 'eventemitter2'
import { COMMENT_EVENT } from '@/constants/events'

@Controller('api/comments')
export class CommentsController {
  constructor(
    private readonly appService: CommentsService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get()
  async getAll(): Promise<CommentModel[]> {
    return this.appService.comments({})
  }

  // @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentModel> {
    return this.appService.createComment(createCommentDto)
  }

  @Sse('events')
  subscribeToEvents(): Observable<{ data: string }> {
    return fromEvent(this.eventEmitter, COMMENT_EVENT).pipe(
      map((payload) => {
        return {
          data: JSON.stringify(payload),
        }
      }),
    )
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string): Promise<CommentModel | null> {
    return this.appService.comment({ id })
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<CommentModel> {
    return this.appService.deleteComment({ id })
  }
}
