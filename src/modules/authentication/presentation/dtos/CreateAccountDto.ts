import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator'

import { Type } from 'class-transformer'
import { AddressDto } from './AddressDto'

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(5)
  @MaxLength(255)
  email: string

  @IsString()
  @IsNotEmpty()  
  @MinLength(4)
  @MaxLength(255)
  password: string

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto
}
