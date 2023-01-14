import { LoginResultDto } from '@modules/authentication/presentation/dtos/LoginDto'
import { AccountDto } from '@modules/shared/presentation/dto/AccountDto'
import { GetAccountResponseDto } from '@modules/users/presentation/dto/getAccountResponseDto'

export interface ClientResult<T> {
  status: number
  data: T | string
}

export interface IAuthenticationClient {  
  createAccount(account: AccountDto): Promise<AccountDto>
  login(email: string, password: string): Promise<LoginResultDto> 
  validateLogin(loginToken: string): Promise<boolean>
  getAllAccounts(): Promise<GetAccountResponseDto[]> 
  getAccountByEmail(email: string): Promise<AccountDto>
  getAccountById(id: string): Promise<GetAccountResponseDto>
  deleteAccountByEmail(email: string): Promise<boolean>
}
