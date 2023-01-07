
import { CreateAccountDto } from '@modules/authentication/presentation/dtos/CreateAccountDto'
import { EnumCountry } from '@modules/authentication/presentation/dtos/enums/EnumCountry'
import { authenticationClientMock } from './authenticationClientMock'

export const addressMock = {
  country: EnumCountry.BR,
  zipCode: '12345678'
}

export const createAccountDtoMock: CreateAccountDto = {
  name: 'anyName',
  email: 'anyEmail',
  password: 'anyPassword',
  age: 99,
  address: addressMock
}

export const authenticationServiceMock: any = {
  createAccount: jest.fn(),
  authenticationClient: authenticationClientMock,
  validateZipCode: function (body: CreateAccountDto): void {
    jest.fn()
  }
}