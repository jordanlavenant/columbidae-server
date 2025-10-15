import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { UsersService } from './user.service'
import { User } from 'generated/prisma'
import { CreateUserDto } from './dto/create-user.dto'

@Controller('api/users')
export class UsersController {
  constructor(private readonly appService: UsersService) {}

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User | null> {
    return this.appService.user({ id })
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.appService.createUser(createUserDto)
  }
}
