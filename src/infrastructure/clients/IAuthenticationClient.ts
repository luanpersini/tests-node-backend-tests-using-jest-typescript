import { AccountDto } from '@modules/shared/presentation/dto/AccountDto'

export interface ClientResult<T> {
  status: number
  data: T | string
}

export enum clientErrorMessages {
  ACCOUNT_NOT_FOUND = 'An account with the given email was not found.',
  ACCOUNT_ALREADY_EXISTS = 'An account with the given email already exists.',
  INVALID_CREDENTIALS = 'Invalid email or password.',
}

export interface IAuthenticationClient {
  getAccountByEmail: (email: string) => Promise<AccountDto>
  createAccount(account: AccountDto): Promise<ClientResult<AccountDto>>
  login(email: string, password: string): Promise<ClientResult<string>>
  deleteAccountByEmail: (email: string) => Promise<boolean>
  getAllAccounts(): Promise<AccountDto[]> 
}
