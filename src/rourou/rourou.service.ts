import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { Rourou, Prisma } from 'generated/prisma/browser'
import { CreateRourouDto } from './dto/create-rourou.dto'
import { UpdateRourouDto } from './dto/update-rourou.dto'
import { RourouEvent, RourouEventType } from './events/rourou.update'
import { ROUROU_EVENT } from '@/constants/events'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class RourousService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

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

    // Fetch the complete rourou object with relations
    const rourouObj = await this.prisma.rourou.findUnique({
      where: { id: rourou.id },
      include: {
        Author: {
          include: {
            Avatar: true,
          },
        },
      },
    })
    this.emitRourouUpdate(RourouEventType.RourouCreated, rourouObj!)

    return rourouObj!
  }

  async updateRourou(params: {
    where: Prisma.RourouWhereUniqueInput
    data: UpdateRourouDto
  }): Promise<Rourou> {
    const { where, data } = params
    const rourou = await this.prisma.rourou.update({
      data: {
        name: data.rourouName,
      },
      where,
    })

    // Fetch the complete rourou object with relations
    const rourouObj = await this.prisma.rourou.findUnique({
      where: { id: rourou.id },
      include: {
        Author: {
          include: {
            Avatar: true,
          },
        },
      },
    })
    this.emitRourouUpdate(RourouEventType.RourouUpdated, rourouObj!)
    return rourouObj!
  }

  async deleteRourou(where: Prisma.RourouWhereUniqueInput): Promise<Rourou> {
    // Fetch the complete rourou object with relations BEFORE deleting
    const rourouObj = await this.prisma.rourou.findUnique({
      where,
      include: {
        Author: {
          include: {
            Avatar: true,
          },
        },
      },
    })

    const rourou = await this.prisma.rourou.delete({
      where,
    })

    // Emit event with the complete object
    this.emitRourouUpdate(RourouEventType.RourouDeleted, rourouObj!)
    return rourou
  }

  // Emit rourou update event
  emitRourouUpdate(type: RourouEventType, rourou: Rourou): void {
    this.eventEmitter.emit(ROUROU_EVENT, new RourouEvent(type, rourou))
  }
}
