import { CreateAccountDto } from '../../domain/dto/createAccount.dto'
import { EnumCountry } from '../../domain/enums/EnumCountry'
import { authenticationClientMock } from '../../../../infrastructure/__tests__/clients/authenticationClientMock'

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