import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export type LoginResultDto = {
  loginToken: string
  id: string
  name: string
}

export class LoginDto {
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
}
