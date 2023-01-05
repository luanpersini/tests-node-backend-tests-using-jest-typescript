import { Body, Controller, Get, Post } from '@nestjs/common'
import { AuthenticationService } from '../application/AuthenticationService'
import { CreateAccountDto } from './dto/createAccount.dto'


@Controller()
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService
  ) {}

  @Post('/signup')
  async signup(@Body() body: CreateAccountDto) {
    return await this.authenticationService.createAccount(body)
  }

  @Get('/login')
  async login() {
    return await this.authenticationService.login()
  }

}
