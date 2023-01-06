import { UsersService } from './application/UsersService'

export const UsersInjectionList = {
  USERS_SERVICE: {
    provide: 'IUsersService',
    useClass: UsersService
  }
}