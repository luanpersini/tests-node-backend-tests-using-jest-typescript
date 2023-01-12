import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, Length, MaxLength, MinLength } from 'class-validator'

export const zipCodeLenghtMessage = 'zipCode must have exactly 8 characters.'
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

  @IsOptional()
  @IsString()  
  @IsNotEmpty()
  @IsNumberString()
  @Length(8,8, {message: zipCodeLenghtMessage}) 
  zipCode: string
}
