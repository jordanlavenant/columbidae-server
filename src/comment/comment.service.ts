import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { Comment, Prisma } from 'generated/prisma/browser'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { CommentEvent, CommentEventType } from './events/comment.update'
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
    this.emitCommentEvent(CommentEventType.CREATED, commentObj!)

    return commentObj!
  }

  async updateComment(params: {
    where: Prisma.CommentWhereUniqueInput
    data: Prisma.CommentUpdateInput
  }): Promise<Comment> {
    const { data, where } = params
    const comment = await this.prisma.comment.update({
      data,
      where,
    })

    // Fetch the complete comment object with relations
    const commentObj = await this.prisma.comment.findUnique({
      where: { id: comment.id },
      include: {
        Author: {
          include: {
            Avatar: true,
          },
        },
      },
    })
    this.emitCommentEvent(CommentEventType.UPDATED, commentObj!)

    return commentObj!
  }

  async deleteComment(where: Prisma.CommentWhereUniqueInput): Promise<Comment> {
    // Fetch the complete comment object with relations BEFORE deleting
    const commentObj = await this.prisma.comment.findUnique({
      where,
      include: {
        Author: {
          include: {
            Avatar: true,
          },
        },
      },
    })

    const comment = await this.prisma.comment.delete({
      where,
    })

    // Emit event with the complete object
    this.emitCommentEvent(CommentEventType.DELETED, commentObj!)
    return comment
  }

  // Emit comment event
  private emitCommentEvent(type: CommentEventType, comment: Comment): void {
    this.eventEmitter.emit(COMMENT_EVENT, new CommentEvent(type, comment))
  }
}
