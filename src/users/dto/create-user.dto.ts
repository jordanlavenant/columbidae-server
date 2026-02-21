import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string

  @IsNotEmpty()
  @IsString()
  readonly name: string

  @IsNotEmpty()
  @IsString()
  readonly email: string

  @IsNotEmpty()
  @IsString()
  readonly password: string

  @IsOptional()
  @IsString()
  readonly assetId?: string
}
