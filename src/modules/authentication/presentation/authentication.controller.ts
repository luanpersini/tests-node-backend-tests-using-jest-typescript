import { Body, Controller, Inject, Post } from '@nestjs/common'
import { IAuthenticationService } from '../application/IAuthenticationService'
import { AuthenticationInjectionList } from '../AuthenticationInjectionList'
import { CreateAccountDto } from './dtos/CreateAccountDto'
import { LoginDto } from './dtos/LoginDto'

@Controller()
export class AuthenticationController {
  constructor(
    @Inject(AuthenticationInjectionList.AUTHENTICATION_SERVICE.provide)
    private readonly authenticationService: IAuthenticationService
  ) {}

  @Post('/signup')
  async signup(@Body() body: CreateAccountDto) {
    return await this.authenticationService.createAccount(body)
  }

  @Post('/login')
  async login(@Body() body: LoginDto) {
    return await this.authenticationService.login(body)
  }

}
