import { InfrastructureInjectionList } from '@infrastructure/InfrastructureInjectionList'
import { AccountDto } from '@modules/shared/presentation/dto/AccountDto'
import { Inject, Injectable } from '@nestjs/common'
import { IAuthenticationClient } from '../../../infrastructure/clients/IAuthenticationClient'
import { IUsersService } from './IUsersService'

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @Inject(InfrastructureInjectionList.AUTHENTICATION_CLIENT.provide)
    private readonly authenticationClient: IAuthenticationClient
  ) {}
 
  async listAllUsers(): Promise<AccountDto[]> {
    return await this.authenticationClient.getAllAccounts()
  } 

}
