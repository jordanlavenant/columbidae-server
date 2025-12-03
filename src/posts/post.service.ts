import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { Post, Prisma } from 'generated/prisma'
import { CreatePostDto } from './dto/create-post.dto'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { POST_EVENT } from '@/constants/events'
import { PostEvent } from './events/post.update'

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
    })
  }

  async createPost(data: CreatePostDto): Promise<Post> {
    return this.prisma.post
      .create({
        data,
      })
      .then((post) => {
        this.emitPostUpdate(post)
        return post
      })
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
