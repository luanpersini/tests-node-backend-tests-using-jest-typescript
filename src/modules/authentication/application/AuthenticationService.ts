import { InfrastructureInjectionList } from '@infrastructure/InfrastructureInjectionList'
import { AccountDto } from '@modules/shared/presentation/dto/AccountDto'
import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { IAuthenticationClient } from '../../shared/infrastructure/IAuthenticationClient'
import { Account } from '../domain/entities/Account'
import { AuthenticationErrorMessages } from '../domain/errors/AuthenticationErrorMessages'
import { CreateAccountDto } from '../presentation/dtos/CreateAccountDto'
import { LoginDto, LoginResultDto } from '../presentation/dtos/LoginDto'
import { IAuthenticationService } from './IAuthenticationService'

@Injectable()
export class AuthenticationService implements IAuthenticationService {
  constructor(
    @Inject(InfrastructureInjectionList.AUTHENTICATION_CLIENT.provide)
    private readonly authenticationClient: IAuthenticationClient
  ) {}

  async createAccount(body: CreateAccountDto): Promise<AccountDto> {
    this.validateZipCode(body)
    const newAccount = await this.authenticationClient.createAccount(new Account(body))

    if (newAccount) return newAccount

    throw new InternalServerErrorException(AuthenticationErrorMessages.SIGNUP_ERROR)
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

  async login(body: LoginDto): Promise<LoginResultDto> {
    const loginResult = await this.authenticationClient.login(body.email, body.password)

    if (loginResult) return loginResult

    throw new InternalServerErrorException(AuthenticationErrorMessages.LOGIN_ERROR)
  }
}
