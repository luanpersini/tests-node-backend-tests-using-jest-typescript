import { EnumCountry } from '@modules/authentication/presentation/dtos/enums/EnumCountry'
import { AccountDto } from '@modules/shared/presentation/dto/AccountDto'
import { Injectable } from '@nestjs/common'
import { clientErrorMessages, ClientResult, IAuthenticationClient } from './IAuthenticationClient'

//Fake client adapter simulating requests to a third party authentication API

export const account1: AccountDto = {
  id: 'bd10c4e7-6385-41a6-a9d1-90c0ee80db0d',
  name: 'Name One',
  email: 'one@mail.com', 
  age: 11,
  password: 'user1',
  address: {
    country: EnumCountry.BR,
    zipCode: '12345678'
  }
}

export const account2: AccountDto = {
  id: 'e77b7a0a-b26e-438d-8bff-d6160c98fb4a',
  name: 'Name Two',
  email: 'two@mail.com',  
  password: 'user2',
  age: 22,
  address: {
    country:  EnumCountry.US
  }
}

const accounts: AccountDto[] = [account1, account2]


@Injectable()
export class AuthenticationClient implements IAuthenticationClient {
  async getAccountByEmail(email: string): Promise<AccountDto> {
    return accounts.find((account) => account.email === email)
  }
  
  async createAccount(account: AccountDto): Promise<ClientResult<AccountDto>> {
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

  // TODO replace Account for a DTO
  async getAllAccounts(): Promise<AccountDto[]> {
    return Promise.resolve(accounts)
  }
}
