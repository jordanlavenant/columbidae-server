import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthsController } from './auths.controller'
import { AuthsService } from './auth.service'
import { PrismaService } from '@/prisma.service'
import { LocalStrategy } from './strategies/local.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthsController],
  providers: [PrismaService, AuthsService, LocalStrategy, JwtStrategy],
  exports: [AuthsService],
})
export class AuthsModule {}
