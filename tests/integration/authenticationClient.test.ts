/* eslint-disable @typescript-eslint/no-empty-function */

import { AuthenticationClient, account1, account2, accountAuthClientMock1 } from '../../src/infrastructure/clients/AuthenticationClient'

import { Account } from '../../src/modules/authentication/domain/entities/Account'
import { CreateAccountDto } from '../../src/modules/authentication/domain/dto/createAccount.dto'
import { IAuthenticationClient } from '../../src/infrastructure/clients/IAuthenticationClient'
import { createAccountDtoMock } from '../__resources__/mocks/authentication.mocks'

let sut: IAuthenticationClient
let createAccount: CreateAccountDto
let account: Account

const makeSut = () => {
  sut = new AuthenticationClient() 
}

describe(`Authentication Client`, () => {
  beforeEach(() => {
    createAccount = accountAuthClientMock1  
    account = new Account(createAccount)    
    makeSut()
  })

  describe(`getAccountByEmail`, () => {
    const execSut = () => sut.getAccountByEmail(createAccount.email)
    
    test('should return an account on success', async () => {
      const result = await execSut()

      expect(result).toEqual(account1)
    })

    test('should return undefined if the account was not found', async () => {
      createAccount = createAccountDtoMock
      
      const result = await execSut()

      expect(result).toBeUndefined()
    })
  }) //End getAccountByEmail 

  describe(`createAccount`, () => {
    const execSut = () => sut.createAccount(account)

    test('should return the created account on success', async () => {     
      account = new Account(createAccountDtoMock)

      const result = await execSut()

      expect(result).toEqual(account)
      sut.deleteAccountByEmail(account.email)
    })

    test('should return the existing account if the account already exists', async () => { 
      const result = await execSut()

      expect(result).toEqual(account)
    })
  }) //End createAccount

  describe(`getAllAccounts`, () => {
    const execSut = () => sut.getAllAccounts()

    test('should return all accounts', async () => { 
      const result = await execSut()

      expect(result).toEqual([account1, account2])
    })
  }) //End getAllAccounts

  describe(`deleteAccountByEmail`, () => {
    const execSut = () => sut.deleteAccountByEmail(createAccount.email)

    test('should return (true) if the account was deleted', async () => { 
      const result = await execSut()

      expect(result).toBeTruthy()
    })
    test('should return (false) if the account was not found', async () => { 
      createAccount = createAccountDtoMock
      
      const result = await execSut()

      expect(result).toBeFalsy
    })
  }) //End deleteAccountByEmail
})
