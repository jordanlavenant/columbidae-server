import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { CreateFollowDto } from './dto/create-follow.dto'
import { Follow, Prisma } from 'generated/prisma/browser'

@Injectable()
export class FollowsService {
  constructor(private prisma: PrismaService) {}

  async follow(
    followWhereUniqueInput: Prisma.FollowWhereUniqueInput,
  ): Promise<Follow | null> {
    return this.prisma.follow.findUnique({
      where: followWhereUniqueInput,
    })
  }

  async follows(params: {
    skip?: number
    take?: number
    cursor?: Prisma.FollowWhereUniqueInput
    where?: Prisma.FollowWhereInput
    orderBy?: Prisma.FollowOrderByWithRelationInput
  }): Promise<Follow[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.prisma.follow.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  async createFollow(data: CreateFollowDto): Promise<Follow> {
    return this.prisma.follow.create({
      data,
    })
  }

  async deleteFollow(where: Prisma.FollowWhereUniqueInput): Promise<Follow> {
    return this.prisma.follow.delete({
      where,
    })
  }
}
