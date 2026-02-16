import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateRourouDto {
  @IsNotEmpty()
  @IsString()
  readonly rourouName: string
}
