import { InfrastructureInjectionList } from '@infrastructure/InfrastructureInjectionList'
import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { IAuthenticationClient } from '../../../infrastructure/clients/IAuthenticationClient'
import { Account } from '../domain/entities/Account'
import { AuthenticationErrorMessages } from '../domain/errors/AuthenticationErrorMessages'
import { ItemAlreadyExistsError } from '../domain/errors/itemAlreadyExists.error'
import { CreateAccountDto } from '../presentation/dtos/CreateAccountDto'
import { LoginDto } from '../presentation/dtos/LoginDto'
import { IAuthenticationService } from './IAuthenticationService'

@Injectable()
export class AuthenticationService implements IAuthenticationService {
  constructor(
    @Inject(InfrastructureInjectionList.AUTHENTICATION_CLIENT.provide)
    private readonly authenticationClient: IAuthenticationClient
  ) {}

  async createAccount(body: CreateAccountDto): Promise<Account> {
    this.validateZipCode(body)
    const newAccount = await this.authenticationClient.createAccount(new Account(body))
    if (newAccount.status === 200) return newAccount.data as Account

    if (newAccount?.status === 400) {
      throw new BadRequestException(new ItemAlreadyExistsError('Account', 'Email'))
    }
    throw new InternalServerErrorException(AuthenticationErrorMessages.AUTHENTICATION_CLIENT_ERROR)
  }

  //Useless business method created to simulate Throw - Reject on tests (authentication.service.spec.ts)
  //Also used to show how to test a private method
  private validateZipCode(body: CreateAccountDto): void {
    if (!body.address.zipCode) {
      console.log('Logger: no zipCode to validate.')
      return
    }
    const { zipCode } = body.address
    if (zipCode === '99999999') {
      throw new BadRequestException(AuthenticationErrorMessages.INVALID_ZIPCODE)
    }
  }

  async login(body: LoginDto): Promise<string> {
    const login = await this.authenticationClient.login(body.email, body.password)

    if (login?.status === 200) {
      return login.data
    }

    if (login?.status === 400) {
      throw new BadRequestException(AuthenticationErrorMessages.INVALID_CREDENTIALS)
    }
    throw new InternalServerErrorException(AuthenticationErrorMessages.AUTHENTICATION_CLIENT_ERROR)
  }
}
