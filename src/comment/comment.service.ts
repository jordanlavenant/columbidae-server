import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { Comment, Prisma } from 'generated/prisma/browser'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { CommentEvent } from './events/comment.update'
import { COMMENT_EVENT } from '@/constants/events'

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async comment(
    commentWhereUniqueInput: Prisma.CommentWhereUniqueInput,
  ): Promise<Comment | null> {
    return this.prisma.comment.findUnique({
      where: commentWhereUniqueInput,
    })
  }

  async comments(params: {
    skip?: number
    take?: number
    cursor?: Prisma.CommentWhereUniqueInput
    where?: Prisma.CommentWhereInput
    orderBy?: Prisma.CommentOrderByWithRelationInput
  }): Promise<Comment[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.prisma.comment.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  async createComment(data: CreateCommentDto): Promise<Comment> {
    const comment = await this.prisma.comment.create({
      data,
    })

    // Fetch the complete comment object with relations
    const commentObj = await this.prisma.comment.findUnique({
      where: { id: comment.id },
      // We take the Author relation to have the username reponse json update in real time
      include: {
        Author: {
          include: {
            Avatar: true,
          },
        },
      },
    })
    this.emitCommentUpdate(commentObj!)

    return commentObj!
  }

  async updateComment(params: {
    where: Prisma.CommentWhereUniqueInput
    data: Prisma.CommentUpdateInput
  }): Promise<Comment> {
    const { data, where } = params
    return this.prisma.comment.update({
      data,
      where,
    })
  }

  async deleteComment(where: Prisma.CommentWhereUniqueInput): Promise<Comment> {
    return this.prisma.comment.delete({
      where,
    })
  }

  // Emit comment update event
  emitCommentUpdate(comment: Comment): void {
    console.log('Emitting comment update event for comment ID:', comment.id)
    this.eventEmitter.emit(
      COMMENT_EVENT,
      new CommentEvent('CommentUpdate', comment),
    )
    console.log('Emitted comment update event for comment ID:', comment.id)
  }
}
