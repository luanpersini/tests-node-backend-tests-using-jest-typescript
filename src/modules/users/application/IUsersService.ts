import { AccountDto } from '@modules/shared/presentation/dto/AccountDto'

export interface IUsersService {
  listAllUsers(): Promise<AccountDto[]>
}
