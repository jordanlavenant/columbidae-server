import { IsOptional, IsString, IsEmail, MinLength } from 'class-validator'

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly username?: string

  @IsOptional()
  @IsString()
  readonly name?: string

  @IsOptional()
  @IsEmail()
  readonly email?: string

  @IsOptional()
  @IsString()
  readonly avatarId?: string

  @IsOptional()
  @IsString()
  readonly currentPassword?: string

  @IsOptional()
  @IsString()
  @MinLength(6)
  readonly newPassword?: string
}
