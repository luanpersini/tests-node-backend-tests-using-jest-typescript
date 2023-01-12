
import { CreateAccountDto } from '@modules/authentication/presentation/dtos/CreateAccountDto'
import { authenticationClientMock } from './authenticationClientMock'

export const createAccountDtoMock: CreateAccountDto = {
  name: 'anyName',
  email: 'anyEmail',
  password: 'anyPassword',
  zipCode: 'anyZipcode'
}

export const authenticationServiceMock: any = {
  createAccount: jest.fn(),
  authenticationClient: authenticationClientMock,
  validateZipCode: function (body: CreateAccountDto): void {
    jest.fn()
  }
}