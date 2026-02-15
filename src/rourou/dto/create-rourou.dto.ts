import { IsNotEmpty, IsString } from 'class-validator'

export class CreateRourouDto {
  @IsNotEmpty()
  @IsString()
  readonly authorId: string

  @IsNotEmpty()
  @IsString()
  readonly postId: string

  @IsNotEmpty()
  @IsString()
  readonly rourouName: string
}
