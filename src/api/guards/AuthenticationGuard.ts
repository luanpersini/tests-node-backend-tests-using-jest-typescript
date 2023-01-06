import { InfrastructureInjectionList } from '@infrastructure/InfrastructureInjectionList'
import { IAuthenticationClient } from '@modules/shared/infrastructure/IAuthenticationClient'
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common'

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    @Inject(InfrastructureInjectionList.AUTHENTICATION_CLIENT.provide)
    private readonly authenticationClient: IAuthenticationClient
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
      
    return await this.authenticationClient.validateLogin(req.headers.authorization)
  }
}
