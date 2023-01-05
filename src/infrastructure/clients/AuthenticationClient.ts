import { EnumCountry } from '@modules/authentication/presentation/dtos/enums/EnumCountry'
import { Injectable } from '@nestjs/common'
import { Account } from '../../modules/authentication/domain/entities/Account'
import { clientErrorMessages, ClientResult, IAuthenticationClient } from './IAuthenticationClient'

//Fake client adapter simulating requests to a third party authentication API

export const accountAuthClientMock1 = {
  name: 'Name One',
  email: 'one@mail.com', 
  age: 11,
  password: 'user1',
  address: {
    country: EnumCountry.BR,
    zipCode: '12345678'
  }
}

export const accountAuthClientMock2 = {
  name: 'Name Two',
  email: 'two@mail.com',  
  password: 'user2',
  age: 22,
  address: {
    country:  EnumCountry.US
  }
}

export const account1 = new Account(accountAuthClientMock1)
export const account2 = new Account(accountAuthClientMock2)

const accounts: Array<Account> = [account1, account2]


@Injectable()
export class AuthenticationClient implements IAuthenticationClient {
  async getAccountByEmail(email: string): Promise<Account> {
    return accounts.find((account) => account.email === email)
  }
  async createAccount(account: Account): Promise<ClientResult<Account>> {
    const accountExists = await this.getAccountByEmail(account.email)
    if (accountExists) {
      return {status: 400, data: clientErrorMessages.ACCOUNT_ALREADY_EXISTS}
    }
    accounts.push(account)  
    return {status: 200, data: account}    
  }

  async login(email: string, password: string): Promise<ClientResult<string>> {
    const account = await this.getAccountByEmail(email)
    if (!account) {
      return {status: 400, data: clientErrorMessages.ACCOUNT_NOT_FOUND}
    }
    if(account.password !== password){
      return {status: 400, data: clientErrorMessages.INVALID_CREDENTIALS}
    }
    return {status: 200, data: 'SuccessLoginString'}
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
