import { AuthenticationGuard } from '@api/guards/AuthenticationGuard'
import { UuidDto } from '@modules/shared/presentation/dto/UuidDto'
import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common'
import { IUsersService } from '../application/IUsersService'
import { UsersInjectionList } from '../UsersInjectionList'

@Controller('users')
@UseGuards(AuthenticationGuard)
export class UsersController {
  constructor(
    @Inject(UsersInjectionList.USERS_SERVICE.provide)
    private readonly usersService: IUsersService
  ) {}
 
  @Get()
  async getAllAccounts() {
    return await this.usersService.listAllUsers()
  }

  @Get('/:id')
  async getAccountByEmail(@Param() { id }: UuidDto) {
    return await this.usersService.getUserById(id) 
  }

}
