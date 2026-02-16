import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Prisma, User } from 'generated/prisma/browser'
import * as bcrypt from 'bcrypt'

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
            Author: {
              include: {
                Avatar: true,
              },
            },
            Assets: true,
            Comments: {
              include: {
                Author: {
                  include: {
                    Avatar: true,
                  },
                },
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
                Avatar: true,
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
                Avatar: true,
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

  async userAccount(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      include: {
        // Récupérer l'avatar d'un utilisateur
        Avatar: true,
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
    const { assetId, ...userData } = data

    const user = await this.prisma.user.create({
      data: {
        ...userData,
        Avatar: assetId ? { connect: { id: assetId } } : undefined,
      },
    })
    return user
  }

  async updateUser(userId: string, updateData: UpdateUserDto): Promise<User> {
    const { currentPassword, newPassword, avatarId, ...profileData } =
      updateData

    // Si l'utilisateur veut changer son mot de passe
    if (newPassword) {
      if (!currentPassword) {
        throw new UnauthorizedException(
          'Current password is required to change password',
        )
      }

      // Récupérer l'utilisateur avec le mot de passe
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      })

      if (!user || !user.password) {
        throw new UnauthorizedException('User not found or invalid')
      }

      // Vérifier que le mot de passe actuel est correct
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      )

      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect')
      }

      // Hasher le nouveau mot de passe
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(newPassword, salt)

      // Mettre à jour avec le nouveau mot de passe
      return this.prisma.user.update({
        where: { id: userId },
        data: {
          ...profileData,
          password: hashedPassword,
          salt,
          Avatar: avatarId ? { connect: { id: avatarId } } : undefined,
        },
        include: {
          Avatar: true,
        },
      })
    }

    // Mise à jour sans changement de mot de passe
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...profileData,
        Avatar: avatarId ? { connect: { id: avatarId } } : undefined,
      },
      include: {
        Avatar: true,
      },
    })
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    })
  }
}
