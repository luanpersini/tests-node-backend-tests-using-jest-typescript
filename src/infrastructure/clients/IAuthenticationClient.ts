import { Account } from '../../modules/authentication/domain/entities/Account'

export interface IAuthenticationClient {  
  getAccountByEmail: (email: string) => Promise<any>   
  createAccount: (account: Account) => Promise<any>   
}