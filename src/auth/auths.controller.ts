import { Body, Controller, Post, UseGuards, Request, Get } from '@nestjs/common'
import { AuthsService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { LocalAuthGuard } from './guards/local-auth.guard'

@Controller('api/auth')
export class AuthsController {
  constructor(private readonly authService: AuthsService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() _loginDto: LoginDto) {
    return this.authService.login(req.user)
  }
}
