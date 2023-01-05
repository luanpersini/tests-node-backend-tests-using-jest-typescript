import { AuthenticationService } from './application/AuthenticationService'


export const AuthenticationInjectionList = {
  AUTHENTICATION_SERVICE: {
    provide: 'IAuthenticationService',
    useClass: AuthenticationService
  }
}