import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { CreatePostDto } from './dto/create-post.dto'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { POST_EVENT } from '@/constants/events'
import { PostEvent } from './events/post.update'
import { Post, Prisma } from 'generated/prisma/browser'

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async post(
    postWhereUniqueInput: Prisma.PostWhereUniqueInput,
  ): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: postWhereUniqueInput,
      include: {
        Author: {
          include: {
            Avatar: true,
          },
        },
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
    })
  }

  async posts(params: {
    skip?: number
    take?: number
    cursor?: Prisma.PostWhereUniqueInput
    where?: Prisma.PostWhereInput
    orderBy?: Prisma.PostOrderByWithRelationInput
  }): Promise<Post[]> {
    const { skip, take, cursor, where, orderBy } = params
    return this.prisma.post.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        // Récupérer l'auteur
        Author: {
          include: {
            Avatar: true,
          },
        },
        // Récupérer les assets
        Assets: true,
        // Récupérer les commentaires
        Comments: {
          include: {
            // Récupérer l'auteur des commentaires
            Author: {
              include: {
                Avatar: true,
              },
            },
          },
        },
        // Récupérer les réactions
        Reacts: {
          include: {
            Author: true,
          },
        },
      },
    })
  }

  async createPost(data: CreatePostDto): Promise<Post> {
    const { assetIds, ...postData } = data

    const post = await this.prisma.post.create({
      data: {
        ...postData,
        ...(assetIds && assetIds.length > 0
          ? {
              Assets: {
                connect: assetIds.map((id) => ({ id })),
              },
            }
          : {}),
      },
    })
    // Fetch the complete post object with relations
    const postObj = await this.prisma.post.findUnique({
      where: { id: post.id },
      // We take the Author relation to have the username reponse json update in real time
      include: {
        Author: {
          include: {
            Avatar: true,
          },
        },
        Comments: true,
        Reacts: true,
        Assets: true,
      },
    })
    this.emitPostUpdate(postObj!)

    return postObj!
  }

  async updatePost(params: {
    where: Prisma.PostWhereUniqueInput
    data: Prisma.PostUpdateInput
  }): Promise<Post> {
    const { data, where } = params
    return this.prisma.post.update({
      data,
      where,
    })
  }

  async deletePost(where: Prisma.PostWhereUniqueInput): Promise<Post> {
    return this.prisma.post.delete({
      where,
    })
  }

  // Emit post update event
  emitPostUpdate(post: Post): void {
    this.eventEmitter.emit(POST_EVENT, new PostEvent('PostUpdate', post))
    console.log('Emitted post update event for post ID:', post.id)
  }
}
