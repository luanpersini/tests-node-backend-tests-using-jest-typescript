import { Body, Controller, Get, Post } from '@nestjs/common'
import { AuthenticationService } from './authentication.service'
import { CreateAccountDto } from './domain/dto/createAccount.dto'


@Controller()
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService
  ) {}

  @Post('/register')
  async register(@Body() body: CreateAccountDto) {
    return await this.authenticationService.createAccount(body)
  }

  @Get('/getAllAccounts')
  async getAllAccounts() {
    return await this.authenticationService.getAllAccounts()
  }

}
