import { IsEmail, IsInt, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsPositive, IsString, Max, MaxLength, Min, MinLength, ValidateNested } from 'class-validator'

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

  @IsInt()
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @Min(7)
  @Max(150)
  age: number

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto
}
