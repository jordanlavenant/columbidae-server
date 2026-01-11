import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { CommentsService } from './comment.service'
import { Comment as CommentModel } from 'generated/prisma/browser'
import { CreateCommentDto } from './dto/create-comment.dto'
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard'

@Controller('api/comments')
export class CommentsController {
  constructor(private readonly appService: CommentsService) {}

  @Get()
  async getAll(): Promise<CommentModel[]> {
    return this.appService.comments({})
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentModel> {
    return this.appService.createComment(createCommentDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string): Promise<CommentModel | null> {
    return this.appService.comment({ id })
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<CommentModel> {
    return this.appService.deleteComment({ id })
  }
}
