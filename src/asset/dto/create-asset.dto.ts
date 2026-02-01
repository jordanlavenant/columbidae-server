import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'

export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  url: string

  @IsString()
  @IsNotEmpty()
  key: string

  @IsString()
  @IsNotEmpty()
  mimeType: string

  @IsNumber()
  @IsNotEmpty()
  size: number

  @IsString()
  @IsNotEmpty()
  fileName: string
}
