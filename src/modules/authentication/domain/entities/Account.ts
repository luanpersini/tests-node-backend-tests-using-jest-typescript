import { BadRequestException } from '@nestjs/common/exceptions'
import * as crypto from 'crypto'
import { AuthenticationErrorMessages } from '../errors/AuthenticationErrorMessages'

export type AccountParams = {
  name: string
  email: string
  password: string
  zipCode?: string
}
export class Account {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly password: string
  readonly zipCode: string

  constructor(properties: AccountParams) {
    Object.assign(this, properties)
    this.validatePassword()
    this.id = crypto.randomUUID()
  }

  //this could also be done by a validationPipe
  validatePassword() {
    if (this.password === '1234') {
      throw new BadRequestException(AuthenticationErrorMessages.PASSWORD_TOO_WEAK)
    }
  }
}
