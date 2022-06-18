/* eslint-disable @typescript-eslint/no-empty-function */

import { throwError, throwReject } from '../../../../tests/testHelpers/testHelper'

import { Account } from '../domain/entities/Account'
import { AuthenticationService } from '../authentication.service'
import { BadRequestException } from '@nestjs/common'
import { CreateAccountDto } from '../domain/dto/createAccount.dto'
import { ItemAlreadyExistsError } from '../../../api/errors/itemAlreadyExists.error'
import { authenticationClientMock } from '@infrastructure/__tests__/clients/authenticationClientMock'
import { createAccountDtoMock } from './mocks/authentication.mocks'

let sut: AuthenticationService
let createAccountDto: CreateAccountDto
let account: any
let spyValidateZipCode: any

const token = 'anyToken'

const makeSut = () => {
  sut = new AuthenticationService(authenticationClientMock)
  jest.spyOn(authenticationClientMock, 'getAccountByEmail')
}

describe(`Authentication Service`, () => {
  beforeEach(() => {
    createAccountDto = createAccountDtoMock

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
      jest.spyOn(authenticationClientMock, 'getAccountByEmail').mockResolvedValueOnce(createAccountDto)

      await expect(execSut()).rejects.toThrowError(new BadRequestException(new ItemAlreadyExistsError('Account', 'Email')))
    })

    test('should call authenticationClient.createAccount with correct values', async () => {
      jest.spyOn(authenticationClientMock, 'getAccountByEmail').mockResolvedValueOnce(undefined)

      await execSut()

      expect(account).toBeInstanceOf(Account)
      expect(authenticationClientMock.createAccount).toHaveBeenCalledWith(account)
    })

    test('should return a token on sut.CreateAccount success', async () => {
      jest.spyOn(authenticationClientMock, 'createAccount').mockResolvedValueOnce(token)

      const result = await execSut()

      expect(result).toBe(token)
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
