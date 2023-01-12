import { AddressDto } from './AddressDto'

export type AccountDto = {
  id: string
  name: string
  email: string
  password: string
  address: AddressDto
}