import { IsString, IsOptional } from 'class-validator'

export class UploadAssetDto {
  @IsString()
  @IsOptional()
  folder?: string = 'assets'
}
