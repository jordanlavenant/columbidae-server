import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Sse,
  UseGuards,
} from '@nestjs/common'
import { PostsService } from './post.service'
import { Post as PostModel } from 'generated/prisma/browser'
import { CreatePostDto } from './dto/create-post.dto'
import { fromEvent, map, Observable } from 'rxjs'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { POST_EVENT } from '@/constants/events'
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard'

@Controller('api/posts')
export class PostsController {
  constructor(
    private readonly appService: PostsService,
    private eventEmitter: EventEmitter2,
  ) {}

  // ! temporary disabled for testing purposes
  // @UseGuards(JwtAuthGuard)
  @Get()
  async feed(): Promise<PostModel[]> {
    return this.appService.posts({})
  }

  @UseGuards(JwtAuthGuard)
  @Get('filtered-posts/:searchString')
  async getFilteredPosts(
    @Param('searchString') searchString: string,
  ): Promise<PostModel[]> {
    return this.appService.posts({
      where: {
        OR: [
          {
            title: { contains: searchString },
          },
          {
            content: { contains: searchString },
          },
          {
            Author: {
              name: { contains: searchString },
            },
          },
        ],
      },
    })
  }

  // ! temporary disabled for testing purposes
  // @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createPostDto: CreatePostDto): Promise<PostModel> {
    return this.appService.createPost(createPostDto)
  }

  @Sse('events')
  subscribeToEvents(): Observable<{ data: string }> {
    return fromEvent(this.eventEmitter, POST_EVENT).pipe(
      map((payload) => {
        Logger.log('Event sent')
        return {
          data: JSON.stringify(payload),
        }
      }),
    )
  }

  @Get(':id')
  async getPostById(@Param('id') id: string): Promise<PostModel | null> {
    return this.appService.post({ id })
  }

  // ! temporary disabled for testing purposes
  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<PostModel> {
    return this.appService.deletePost({ id })
  }
}
