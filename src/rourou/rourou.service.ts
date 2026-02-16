import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { Rourou, Prisma } from 'generated/prisma/browser'
import { CreateRourouDto } from './dto/create-rourou.dto'

@Injectable()
export class RourousService {
  constructor(private prisma: PrismaService) {}

  async rourous(params: {
    skip?: number
    take?: number
    cursor?: Prisma.RourouWhereUniqueInput
    where?: Prisma.RourouWhereInput
    orderBy?: Prisma.RourouOrderByWithRelationInput
  }): Promise<Rourou[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.prisma.rourou.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  async createRourou(data: CreateRourouDto): Promise<Rourou> {
    const { authorId, postId, rourouName } = data

    const rourou = await this.prisma.rourou.create({
      data: {
        Author: {
          connect: { id: authorId },
        },
        Post: {
          connect: { id: postId },
        },
        name: rourouName,
      },
    })

    return rourou
  }

  async deleteRourou(where: Prisma.RourouWhereUniqueInput): Promise<Rourou> {
    return this.prisma.rourou.delete({
      where,
    })
  }
}
