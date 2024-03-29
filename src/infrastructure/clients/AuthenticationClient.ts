import { Account } from '@modules/authentication/domain/entities/Account'
import { LoginResultDto } from '@modules/authentication/presentation/dtos/LoginDto'
import { AccountDto } from '@modules/shared/presentation/dto/AccountDto'
import { GetAccountResponseDto } from '@modules/users/presentation/dto/getAccountResponseDto'
import { BadRequestException, Injectable } from '@nestjs/common'
import * as crypto from 'node:crypto'
import { IAuthenticationClient } from '../../modules/shared/infrastructure/IAuthenticationClient'
import { ClientErrorMessages } from './ClientErrorMessages'

//Fake client adapter simulating requests to a third party authentication API

export const account1 = {
  name: 'Name One',
  email: 'one@mail.com',
  password: 'user1',
  zipCode: '12345678'
}

export const account2 = {
  name: 'Name Two',
  email: 'any_email5@mail.com',
  password: 'Secr&t123'
}

export const authenticationClientAccountsStorage: AccountDto[] = [new Account(account1), new Account(account2)]

const accounts = authenticationClientAccountsStorage

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

  async login(email: string, password: string): Promise<LoginResultDto> {
    const account = await this.getAccountByEmail(email)
    if (account && account.password === password) {
      const loginToken = crypto.randomUUID() //Generate fake token for login
      loginTokens.push(loginToken)
      return { loginToken, id: account.id, name: account.name }
    }
    throw new BadRequestException(ClientErrorMessages.INVALID_CREDENTIALS)
  }

  async validateLogin(loginToken: string): Promise<boolean> {
    const isLoggedIn = loginTokens.find((token) => token === loginToken)

    if (isLoggedIn) return true

    return false
  }

  async getAllAccounts(): Promise<GetAccountResponseDto[]> {
    accounts.map((account) => {
      delete account.password
      return account
    })
    return Promise.resolve(accounts)
  }

  async getAccountByEmail(email: string): Promise<AccountDto> {
    return accounts.find((account) => account.email === email)
  }

  async getAccountById(id: string): Promise<GetAccountResponseDto> {
    const accountExists = accounts.find((account) => account.id === id)
    if (!accountExists) {
      throw new BadRequestException(ClientErrorMessages.ACCOUNT_NOT_FOUND)
    }
    delete accountExists.password
    return accountExists
  }

  async deleteAccountByEmail(email: string): Promise<boolean> {
    const accountExists = await this.getAccountByEmail(email)
    if (!accountExists) {
      return false
    }

    accounts.splice(accounts.indexOf(accountExists), 1)
    return true
  }
}
