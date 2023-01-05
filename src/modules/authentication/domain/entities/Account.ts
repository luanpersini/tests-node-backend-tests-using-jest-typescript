import { BadRequestException } from '@nestjs/common/exceptions'
import { Address } from '../types/Address'

export type AccountParams = {
  name: string
  email: string
  age: number
  password: string
  address: Address
}
export class Account {
  readonly name: string
  readonly email: string
  readonly age: number
  readonly password: string
  readonly address: Address

  constructor(properties: AccountParams) {
    Object.assign(this, properties)
    this.validatePassword()
  }
  
  //this could also be done by a validationPipe
  validatePassword() {
    if(this.password === '1234'){
      throw new BadRequestException('password too weak')
    }
  } 

}
