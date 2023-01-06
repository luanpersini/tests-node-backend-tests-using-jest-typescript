import { AccountDto } from '@modules/shared/presentation/dto/AccountDto'
import { CreateAccountDto } from '../presentation/dtos/CreateAccountDto'
import { LoginDto } from '../presentation/dtos/LoginDto'
export interface IAuthenticationService {
  createAccount(body: CreateAccountDto): Promise<AccountDto>
  login(body: LoginDto): Promise<string>
}
