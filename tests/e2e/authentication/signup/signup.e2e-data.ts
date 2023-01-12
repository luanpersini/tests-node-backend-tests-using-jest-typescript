
//mock data and test factories
const dtoParams = {}

export const makeDtoParams = (dto) => {
  dtoParams[''] = dto
  return dtoParams
}

export const signupDtoParams = {
  name: ['Required', 'IsString', 'MinLength.3', 'MaxLength.100'],
  email: ['Required', 'IsString', 'IsEmail', 'MinLength.5', 'MaxLength.255'],
  password: ['Required', 'IsString', 'MinLength.4', 'MaxLength.255'],
  zipCode: ['IsOptional', 'IsString', 'IsNumberString']
}

export const makeSignupRequestData = (params?: any) => ({
  name: 'anyName',
  email: 'anyEmail@mail.com',
  password: '12345',
  zipCode: '12345678'  
})

