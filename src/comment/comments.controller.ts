import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { CommentsService } from './comment.service'
import { Comment as CommentModel } from 'generated/prisma/browser'
import { CreateCommentDto } from './dto/create-comment.dto'
import { EventEmitter2 } from 'eventemitter2'

@Controller('api/comments')
export class CommentsController {
  constructor(private readonly appService: CommentsService) {}

  @Get()
  async getAll(): Promise<CommentModel[]> {
    return this.appService.comments({})
  }

  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentModel> {
    return this.appService.createComment(createCommentDto)
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<CommentModel | null> {
    return this.appService.comment({ id })
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<CommentModel> {
    return this.appService.deleteComment({ id })
  }
}
