import { IsNotEmpty, IsString } from 'class-validator'

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  readonly comment: string

  @IsNotEmpty()
  @IsString()
  readonly authorId: string

  @IsNotEmpty()
  @IsString()
  readonly postId: string
}
