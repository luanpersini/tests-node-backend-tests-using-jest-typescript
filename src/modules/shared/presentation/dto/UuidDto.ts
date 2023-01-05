import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class UuidDto {  
  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  id: string
}