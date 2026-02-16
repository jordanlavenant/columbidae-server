import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { Prisma, User } from 'generated/prisma/browser'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      include: {
        // Récupérer l'avatar d'un utilisateur
        Avatar: true,
        // Récupérer les posts d'un utilisateur avec leurs assets
        Posts: {
          include: {
            Author: true,
            Assets: true,
            Comments: {
              include: {
                Author: true,
              },
            },
            Reacts: {
              include: {
                Author: true,
              },
            },
          },
        },
        // Récupérer les followers et les utilisateurs suivis d'un utilisateur
        Followers: {
          include: {
            follower: {
              select: {
                id: true,
                username: true,
                name: true,
              },
            },
          },
        },
        Following: {
          include: {
            followed: {
              select: {
                id: true,
                username: true,
                name: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    return user
  }

  async users(params: {
    skip?: number
    take?: number
    cursor?: Prisma.UserWhereUniqueInput
    where?: Prisma.UserWhereInput
    orderBy?: Prisma.UserOrderByWithRelationInput
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    })
  }

  async createUser(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data,
    })
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput
    data: Prisma.UserUpdateInput
  }): Promise<User> {
    const { where, data } = params
    return this.prisma.user.update({
      data,
      where,
    })
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    })
  }
}
