import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ItemAlreadyExistsError } from '../../api/errors/itemAlreadyExists.error'
import { IAuthenticationClient } from '../../infrastructure/clients/IAuthenticationClient'
import { CreateAccountDto } from './domain/dto/createAccount.dto'
import { Account } from './domain/entities/Account'

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject('IAuthenticationClient')
    private readonly authenticationClient: IAuthenticationClient
  ) {}

  async createAccount(body: CreateAccountDto): Promise<any> {
    this.validateZipCode(body)
    const accountExists = await this.authenticationClient.getAccountByEmail(body.email)
    if (accountExists) {
      throw new BadRequestException(new ItemAlreadyExistsError('Account', 'Email'))
    }
    const account = new Account(body)
    const newAccount = await this.authenticationClient.createAccount(account)
    return newAccount
  }

  private validateZipCode(body: CreateAccountDto): void {
    if (!body.address.zipCode) {
      console.log('Logger: no zipCode to validate.')
      return
    }
    const { zipCode } = body.address
    if (zipCode === '99999999') {
      throw new BadRequestException('Invalid ZipCode')
    }
  }
}
