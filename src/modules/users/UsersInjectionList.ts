import { UsersService } from './application/UsersService'

export const UsersInjectionList = {
  AUTHENTICATION_SERVICE: {
    provide: 'IUsersService',
    useClass: UsersService
  }
}