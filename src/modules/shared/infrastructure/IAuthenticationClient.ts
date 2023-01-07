import { AccountDto } from '@modules/shared/presentation/dto/AccountDto'

export interface ClientResult<T> {
  status: number
  data: T | string
}

export interface IAuthenticationClient {  
  createAccount(account: AccountDto): Promise<AccountDto>
  login(email: string, password: string): Promise<string> 
  validateLogin(loginToken: string): Promise<boolean>
  getAllAccounts(): Promise<AccountDto[]> 
  getAccountByEmail(email: string): Promise<AccountDto>
  getAccountById(id: string): Promise<AccountDto>
  deleteAccountByEmail(email: string): Promise<boolean>
}
