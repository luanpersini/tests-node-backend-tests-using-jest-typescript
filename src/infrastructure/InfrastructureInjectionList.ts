import { AuthenticationClient } from './clients/AuthenticationClient'

export const  InfrastructureInjectionList = {
  AUTHENTICATION_CLIENT: {
    provide: 'IAuthenticationClient',
    useClass: AuthenticationClient
  }
}