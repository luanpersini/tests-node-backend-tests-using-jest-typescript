import { Account } from '../../modules/authentication/domain/entities/Account'
import { IAuthenticationClient } from './IAuthenticationClient'
import { Injectable } from '@nestjs/common'

//fake client that would make requests to a third party authentication API
@Injectable()
export class AuthenticationClient implements IAuthenticationClient {
  getAccountByEmail (email: string): Promise<any> {
    return Promise.resolve({email: 'anyEmail'})    
  }
  createAccount (account: Account): Promise<any> {
    return Promise.resolve({token: 'random'})
  }   
}