import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator'

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  readonly content: string

  @IsNotEmpty()
  @IsString()
  readonly authorId: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly assetIds?: string[]
}
