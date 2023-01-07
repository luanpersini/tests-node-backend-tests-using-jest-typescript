import { IAuthenticationClient } from '@modules/shared/infrastructure/IAuthenticationClient'
import { Inject } from '@nestjs/common'


export class TestService {
  constructor(
    @Inject('IAuthenticationClient')
    private readonly authenticationClient: IAuthenticationClient   
  ) {}

  public async deleteAccountByEmail(email: string) { 
    return await this.authenticationClient.deleteAccountByEmail(email)
  }

}
