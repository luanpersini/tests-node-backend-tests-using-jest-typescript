import { Account } from '../domain/entities/Account'
import { CreateAccountDto } from '../presentation/dtos/CreateAccountDto'
import { LoginDto } from '../presentation/dtos/LoginDto'
export interface IAuthenticationService {
  createAccount(body: CreateAccountDto): Promise<Account>
  login(body: LoginDto): Promise<string>
}
