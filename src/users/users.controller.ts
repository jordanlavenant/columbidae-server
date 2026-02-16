import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { UsersService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { User as UserModel } from 'generated/prisma/browser'

@Controller('api/users')
export class UsersController {
  constructor(private readonly appService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<UserModel[]> {
    return this.appService.users({})
  }

  @Get(':username')
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<UserModel | null> {
    return this.appService.user({ username })
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserModel> {
    return this.appService.createUser(createUserDto)
  }
}
