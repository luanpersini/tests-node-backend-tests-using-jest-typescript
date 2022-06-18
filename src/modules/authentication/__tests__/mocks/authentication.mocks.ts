import { CreateAccountDto } from '../../domain/dto/createAccount.dto'
import { EnumCountry } from '../../domain/enums/EnumCountry'

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

