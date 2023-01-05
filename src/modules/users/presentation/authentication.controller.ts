import { Body, Controller, Get, Post } from '@nestjs/common'
import { AuthenticationService } from '../application/authentication.service'
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

  @Get('/getAllAccounts')
  async getAllAccounts() {
    return await this.authenticationService.getAllAccounts()
  }

}
