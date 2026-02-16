import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { UsersService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User as UserModel } from 'generated/prisma/browser'

@Controller('api/users')
export class UsersController {
  constructor(private readonly appService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<UserModel[]> {
    return this.appService.users({})
  }

  @Get('/account/:id')
  async getUserAccount(@Param('id') id: string): Promise<UserModel | null> {
    return this.appService.userAccount({ id })
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

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserModel> {
    return this.appService.updateUser(id, updateUserDto)
  }
}
