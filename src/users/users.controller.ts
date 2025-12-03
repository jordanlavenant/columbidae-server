import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { UsersService } from './user.service'
import { User as UserModel } from 'generated/prisma'
import { CreateUserDto } from './dto/create-user.dto'

@Controller('api/users')
export class UsersController {
  constructor(private readonly appService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<UserModel[]> {
    return this.appService.users({})
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserModel | null> {
    return this.appService.user({ id })
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserModel> {
    return this.appService.createUser(createUserDto)
  }
}
