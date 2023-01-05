import { AddressDto } from './AddressDto'

export type AccountDto = {
  id: string
  name: string
  email: string
  age: number
  password: string
  address: AddressDto
}