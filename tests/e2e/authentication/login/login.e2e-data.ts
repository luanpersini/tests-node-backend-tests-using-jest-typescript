
//mock data and test factories
const dtoParams = {}

export const makeDtoParams = (dto) => {
  dtoParams[''] = dto
  return dtoParams
}

export const loginDtoParams = { 
  email: ['Required', 'IsString', 'IsEmail', 'MinLength.5', 'MaxLength.255'],
  password: ['Required', 'IsString', 'MinLength.4', 'MaxLength.255'] 
}

export const makeLoginRequestData = (params?: any) => ({
  email: params?.email || 'anyEmail@mail.com',
  password: params?.password || '12345' 
})

