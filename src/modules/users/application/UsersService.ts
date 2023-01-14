import { InfrastructureInjectionList } from '@infrastructure/InfrastructureInjectionList'
import { Inject, Injectable } from '@nestjs/common'
import { IAuthenticationClient } from '../../shared/infrastructure/IAuthenticationClient'
import { GetAccountResponseDto } from '../presentation/dto/getAccountResponseDto'
import { IUsersService } from './IUsersService'

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @Inject(InfrastructureInjectionList.AUTHENTICATION_CLIENT.provide)
    private readonly authenticationClient: IAuthenticationClient
  ) {}
 
  async listAllUsers(): Promise<GetAccountResponseDto[]> {
    return await this.authenticationClient.getAllAccounts()
  } 

  async getUserById(id: string): Promise<GetAccountResponseDto> {    
    return await this.authenticationClient.getAccountById(id)  
  } 

}
