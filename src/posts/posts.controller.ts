import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { PostsService } from './post.service'
import { Post as PostModel } from 'generated/prisma'
import { CreatePostDto } from './dto/create-post.dto'

@Controller('api/posts')
export class PostsController {
  constructor(private readonly appService: PostsService) {}

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
}
