import { Account } from '../../modules/authentication/domain/entities/Account'
import { EnumCountry } from '../../modules/authentication/domain/enums/EnumCountry'
import { IAuthenticationClient } from './IAuthenticationClient'
import { Injectable } from '@nestjs/common'

export const accountAuthClientMock1 = {
  name: 'Name One',
  email: 'one@mail.com', 
  age: 11,
  address: {
    country: EnumCountry.BR,
    zipCode: '12345678'
  }
}

export const accountAuthClientMock2 = {
  name: 'Name Two',
  email: 'two@mail.com',  
  age: 22,
  address: {
    country:  EnumCountry.US
  }
}

export const account1 = new Account(accountAuthClientMock1)
export const account2 = new Account(accountAuthClientMock2)

//fake client that would make requests to a third party authentication API
const accounts: Array<Account> = [account1, account2]
@Injectable()
export class AuthenticationClient implements IAuthenticationClient {
  async getAccountByEmail(email: string): Promise<Account> {
    return accounts.find((account) => account.email === email)
  }
  async createAccount(account: Account): Promise<Account> {
    const accountExists = await this.getAccountByEmail(account.email)
    if (accountExists) {
      return accountExists
    }
    accounts.push(account)
    return account
  }

  async deleteAccountByEmail(email: string): Promise<boolean> {
    const accountExists = await this.getAccountByEmail(email)   
    if(!accountExists){
      return false      
    }

    accounts.splice(accounts.indexOf(accountExists), 1)
    return true    
  }

  async getAllAccounts(): Promise<Array<Account>> {
    return Promise.resolve(accounts)
  }
}
