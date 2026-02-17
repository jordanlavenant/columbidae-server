import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaService } from './prisma.service'
import { PostsModule } from './posts/posts.module'
import { UsersModule } from './users/users.module'
import { CommentsModule } from './comment/comments.module'
import { AuthsModule } from './auth/auths.module'
import { FollowsModule } from './follow/follows.module'
import { RourousModule } from './rourou/rourous.module'
import { AssetsModule } from './asset/assets.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    AuthsModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    FollowsModule,
    RourousModule,
    AssetsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
