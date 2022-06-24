/* eslint-disable @typescript-eslint/no-empty-function */

import { AuthenticationController } from '../../../src/modules/authentication/authentication.controller'
import { AuthenticationService } from '../../../src/modules/authentication/authentication.service'
import { CreateAccountDto } from '../../../src/modules/authentication/domain/dto/createAccount.dto'
import { authenticationClientMock } from '../../__resources__/mocks/authenticationClientMock'
import { createAccountDtoMock } from '../../__resources__/mocks/authentication.mocks'

let sut: AuthenticationController
let createAccountDto: CreateAccountDto
let authenticationService: AuthenticationService

const makeSut = () => { 
  authenticationService = new AuthenticationService(authenticationClientMock)
  sut = new AuthenticationController(authenticationService)
  jest.spyOn(authenticationService, 'createAccount')
  jest.spyOn(authenticationService, 'getAllAccounts')  
}

describe(`Authentication Service`, () => {
  beforeEach(() => {
    createAccountDto = {...createAccountDtoMock}
    makeSut()
  })

  describe(`Create Account`, () => {
    const execSut = () => sut.register(createAccountDto)

    test('should call authenticationService.createAccount with correct params', async () => {
     await execSut()

      expect(authenticationService.createAccount).toHaveBeenCalledWith(createAccountDto)
    })   
  }) 

  describe(`Create Account`, () => {
    const execSut = () => sut.getAllAccounts()

    test('should call authenticationService.getAllAccounts', async () => {
     await execSut()

      expect(authenticationService.getAllAccounts).toHaveBeenCalledTimes(1)
    })   
  }) 

})
