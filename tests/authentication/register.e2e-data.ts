import { EnumCountry } from '../../src/modules/authentication/domain/enums/EnumCountry'

//mock data and test factories
const dtoParams = {}

export const makeDtoParams = (dto) => {
  dtoParams[''] = dto
  return dtoParams
}

export const createAccountDto = {
  name: ['Required', 'IsString', 'MinLength.3', 'MaxLength.100'],
  email: ['Required', 'IsString', 'IsEmail', 'MinLength.5', 'MaxLength.255'],
  age: ['Required', 'IsNumber', 'IsInt', 'IsPositive', 'Min.7', 'Max.150']  
}

dtoParams['address'] = {
  country: ['Required', 'IsString', 'IsEnum'],
  zipCode: ['IsOptional', 'IsString', 'IsNumberString']
}

export const address = {  
  country: EnumCountry.BR,
  zipCode: '12345678'
}

export const makeCreateAccountRequestData = (params?: any) => ({
  name: 'anyName',
  email: 'anyEmail@mail.com',
  age: 99,
  address
})
