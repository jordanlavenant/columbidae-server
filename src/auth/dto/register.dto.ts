import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @IsNotEmpty()
  @IsString()
  readonly username: string

  @IsNotEmpty()
  @IsString()
  readonly name: string

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly password: string
}
