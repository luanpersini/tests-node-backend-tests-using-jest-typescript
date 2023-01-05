import { Account } from '../domain/entities/Account'
import { CreateAccountDto } from '../presentation/dto/createAccount.dto'

export interface IAuthenticationService {
  createAccount(body: CreateAccountDto): Promise<Account>
}
