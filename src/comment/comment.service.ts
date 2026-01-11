import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { CreateCommentDto } from './dto/create-comment.dto'
import { Comment, Prisma } from 'generated/prisma/browser'

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

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
    return this.prisma.comment.create({
      data,
    })
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
}
