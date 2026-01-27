import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { Rourou, Prisma } from 'generated/prisma/browser'

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
}
