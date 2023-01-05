/* eslint-disable @typescript-eslint/no-empty-function */

import { AuthenticationService } from '../../../src/modules/authentication/application/AuthenticationService'
import { AuthenticationController } from '../../../src/modules/authentication/presentation/authentication.controller'
import { CreateAccountDto } from '../../../src/modules/authentication/presentation/dto/createAccount.dto'
import { createAccountDtoMock } from '../../__resources__/mocks/authentication.mocks'
import { authenticationClientMock } from '../../__resources__/mocks/authenticationClientMock'

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
