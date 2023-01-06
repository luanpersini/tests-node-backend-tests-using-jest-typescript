import { EnumCountry } from '@modules/authentication/presentation/dtos/enums/EnumCountry'
import { AccountDto } from '@modules/shared/presentation/dto/AccountDto'
import { BadRequestException, Injectable } from '@nestjs/common'
import * as crypto from 'node:crypto'
import { IAuthenticationClient } from '../../modules/shared/infrastructure/IAuthenticationClient'
import { ClientErrorMessages } from './ClientErrorMessages'

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
    country: EnumCountry.US
  }
}

const accounts: AccountDto[] = [account1, account2]

const loginTokens: string[] = []
@Injectable()
export class AuthenticationClient implements IAuthenticationClient {
  async createAccount(account: AccountDto): Promise<AccountDto> {
    const accountExists = await this.getAccountByEmail(account.email)
    if (accountExists) {
      throw new BadRequestException(ClientErrorMessages.ACCOUNT_ALREADY_EXISTS)
    }
    accounts.push(account)
    return account
  }

  async login(email: string, password: string): Promise<string> {
    const account = await this.getAccountByEmail(email)
    if (account && account.password === password) {
      const loginToken = crypto.randomUUID() //Generate fake token for login
      loginTokens.push(loginToken)
      return loginToken
    }
    throw new BadRequestException(ClientErrorMessages.INVALID_CREDENTIALS)
  }

  async validateLogin(loginToken: string): Promise<boolean> {
    const isLoggedIn = loginTokens.find((token) => token === loginToken)
    
    if (isLoggedIn) return true
    
    return false
  }

  async getAllAccounts(): Promise<AccountDto[]> {
    return Promise.resolve(accounts)
  }

  async getAccountByEmail(email: string): Promise<AccountDto> {
    return accounts.find((account) => account.email === email)
  }

  async getAccountById(id: string): Promise<AccountDto> {
    return accounts.find((account) => account.id === id)
  }
}
