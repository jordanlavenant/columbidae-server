import { IsNotEmpty, IsString } from 'class-validator'

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string

  @IsNotEmpty()
  @IsString()
  readonly content: string

  @IsNotEmpty()
  @IsString()
  readonly authorId: string
}
