import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Logger,
  Param,
  Post,
  Sse,
} from '@nestjs/common'
import { PostsService } from './post.service'
import { Post as PostModel } from 'generated/prisma'
import { CreatePostDto } from './dto/create-post.dto'
import { fromEvent, map, Observable } from 'rxjs'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { POST_EVENT } from '@/constants/events'

@Controller('api/posts')
export class PostsController {
  constructor(
    private readonly appService: PostsService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Get()
  async feed(): Promise<PostModel[]> {
    return this.appService.posts({})
  }

  @Get(':id')
  async getPostById(@Param('id') id: string): Promise<PostModel | null> {
    return this.appService.post({ id })
  }

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
        ],
      },
    })
  }

  @Post()
  async create(@Body() createPostDto: CreatePostDto): Promise<PostModel> {
    return this.appService.createPost(createPostDto)
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<PostModel> {
    return this.appService.deletePost({ id })
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
}
