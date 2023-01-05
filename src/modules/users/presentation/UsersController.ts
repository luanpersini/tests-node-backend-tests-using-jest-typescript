import { UuidDto } from '@modules/shared/presentation/dto/UuidDto'
import { Controller, Get, Param } from '@nestjs/common'
import { IUsersService } from '../application/IUsersService'

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: IUsersService
  ) {}

  @Get('/getAccount/:id')
  async getAccountByEmail(@Param() { id }: UuidDto) {
    // return await this.userService.createAccount(body)
    return undefined
  }

  @Get('/getAllAccounts')
  async getAllAccounts() {
    return await this.usersService.listAllUsers()
  }

}
