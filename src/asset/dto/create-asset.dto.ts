import { IsNotEmpty, IsString } from 'class-validator'

export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  url: string
}
