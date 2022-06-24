/* eslint-disable @typescript-eslint/no-empty-function */

import { throwError, throwReject } from '../../__resources__/testHelpers/testHelper'

import { Account } from '../../../src/modules/authentication/domain/entities/Account'
import { AuthenticationService } from '../../../src/modules/authentication/authentication.service'
import { BadRequestException } from '@nestjs/common'
import { CreateAccountDto } from '../../../src/modules/authentication/domain/dto/createAccount.dto'
import { ItemAlreadyExistsError } from '../../../src/api/errors/itemAlreadyExists.error'
import { authenticationClientMock } from '../../__resources__/mocks/authenticationClientMock'
import { createAccountDtoMock } from '../../__resources__/mocks/authentication.mocks'

let sut: AuthenticationService
let createAccountDto: CreateAccountDto
let account: any

const makeSut = () => {
  sut = new AuthenticationService(authenticationClientMock)
  jest.spyOn(authenticationClientMock, 'getAccountByEmail')
  jest.spyOn(authenticationClientMock, 'getAllAccounts')  
}

describe(`Authentication Service`, () => {
  beforeEach(() => {
    createAccountDto = {...createAccountDtoMock}

    account = new Account(createAccountDto)
    makeSut()
  })

  describe(`Create Account`, () => {
    const execSut = () => sut.createAccount(createAccountDto)

    test('should call validateZipCode with correct params', async () => {
      const spyValidateZipCode = jest.spyOn(sut as any, 'validateZipCode')

      await execSut()

      expect(spyValidateZipCode).toHaveBeenCalledWith(createAccountDto)
    })

    test('should call authenticationClient.getAccountByEmail with correct params', async () => {
      await execSut()

      expect(authenticationClientMock.getAccountByEmail).toHaveBeenCalledWith(createAccountDto.email)
    })

    test('should throw Error if account already exists', async () => {
      jest.spyOn(authenticationClientMock, 'getAccountByEmail').mockResolvedValueOnce(account)

      await expect(execSut()).rejects.toThrowError(new BadRequestException(new ItemAlreadyExistsError('Account', 'Email')))
    })

    test('should call authenticationClient.createAccount with correct values', async () => {
      jest.spyOn(authenticationClientMock, 'getAccountByEmail').mockResolvedValueOnce(undefined)

      await execSut()

      expect(account).toBeInstanceOf(Account)
      expect(authenticationClientMock.createAccount).toHaveBeenCalledWith(account)
    })

    test('should return the created account on success', async () => {
      jest.spyOn(authenticationClientMock, 'createAccount').mockResolvedValueOnce(account)
      const result = await execSut()

      expect(result).toBe(account)
    })
  }) //End Create Account

  describe(`Validate ZipCode`, () => {
    const execSut = () => (sut as any).validateZipCode(createAccountDto)

    test('should return undefined if zipCode doesnt exist', async () => {
      jest.spyOn(console, 'log')
      delete createAccountDto.address.zipCode

      const result = execSut()

      expect(console.log).toHaveBeenCalledTimes(1)
      expect(console.log).toHaveBeenCalledWith('Logger: no zipCode to validate.')
      expect(result).toBeUndefined
    })

    test('should throw if zipCode is incorrect (zipCode = 99999999)', async () => {
      createAccountDto.address.zipCode = '99999999'
      try {
        execSut()
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException)
        expect(error.message).toBe('Invalid ZipCode')
      }
    })
  }) //End Validate ZipCode

  describe(`getAllAccounts`, () => {
    const execSut = () => sut.getAllAccounts()

    test('should call authenticationClient.getAllAccounts', async () => { 
      await execSut()

      expect(authenticationClientMock.getAllAccounts).toHaveBeenCalledTimes(1)
    })
  }) //End getAllAccounts

  describe(`Simulated Tests`, () => {
    test('simulated test - should throw (Sync Error) if a syncronous function throws', async () => {
      delete createAccountDto.address.zipCode
      jest.spyOn(console, 'log').mockImplementationOnce(throwError)

      expect(() => (sut as any).validateZipCode(createAccountDto)).toThrow('Sync Error')
    })

    test('simulated test - should rejects and throw (Async Error) if an error is throw inside a promise', async () => {
      jest.spyOn(sut, 'createAccount').mockImplementationOnce(throwReject)

      await expect(sut.createAccount(createAccountDto)).rejects.toThrow('Async Error')
    })
  }) //End Simulated Tests
})
