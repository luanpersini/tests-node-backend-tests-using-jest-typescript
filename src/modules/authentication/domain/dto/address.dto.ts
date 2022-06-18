import { IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString, Length } from 'class-validator'

import { EnumCountry } from '../enums/EnumCountry'

export const zipCodeLenghtMessage = 'zipCode must have exactly 8 characters.'

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(EnumCountry)
  country: string

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @IsNumberString()
  @Length(8,8, {message: zipCodeLenghtMessage}) 
  zipCode: string
}

