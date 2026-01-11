import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/prisma.service'
import { RegisterDto } from './dto/register.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthsService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, name, password } = registerDto

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new ConflictException('User with this email already exists')
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        salt,
        provider: 'local',
      },
    })

    // Generate JWT token
    const payload = { email: user.email, sub: user.id, name: user.name }
    const access_token = this.jwtService.sign(payload)

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.password) {
      return null
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return null
    }

    const { password: _, salt: __, ...result } = user
    return result
  }

  async login(user: { id: string; email: string; name: string }) {
    const payload = { email: user.email, sub: user.id, name: user.name }
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    }
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token)
    } catch (error) {
      throw new UnauthorizedException('Invalid token')
    }
  }
}
