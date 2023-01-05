import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { IAuthenticationClient } from '../../../infrastructure/clients/IAuthenticationClient'
import { Account } from '../domain/entities/Account'
import { ItemAlreadyExistsError } from '../domain/errors/itemAlreadyExists.error'
import { CreateAccountDto } from '../presentation/dto/createAccount.dto'

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject('IAuthenticationClient')
    private readonly authenticationClient: IAuthenticationClient
  ) {}

  async createAccount(body: CreateAccountDto): Promise<Account> {
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

  async getAllAccounts(): Promise<Array<Account>> {    
    return await this.authenticationClient.getAllAccounts()
  }

}
