import { CreateAccountDto } from '../../../src/modules/authentication/presentation/dto/createAccount.dto'
import { EnumCountry } from '../../../src/modules/authentication/presentation/dto/enums/EnumCountry'
import { authenticationClientMock } from './authenticationClientMock'

export const addressMock = {
  country: EnumCountry.BR,
  zipCode: '12345678'
}

export const createAccountDtoMock: CreateAccountDto = {
  name: 'anyName',
  email: 'anyEmail',
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