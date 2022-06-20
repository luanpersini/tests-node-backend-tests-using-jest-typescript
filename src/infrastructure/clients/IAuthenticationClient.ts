import { Account } from '../../modules/authentication/domain/entities/Account'

export interface IAuthenticationClient {
  getAccountByEmail: (email: string) => Promise<Account>
  createAccount: (account: Account) => Promise<Account>
  deleteAccountByEmail: (email: string) => void
  getAllAccounts: () => Promise<Array<Account>>
}
