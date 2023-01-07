import { IAuthenticationClient } from '@modules/shared/infrastructure/IAuthenticationClient'
import { account1, account2 } from '../../../src/infrastructure/clients/AuthenticationClient'

export const authenticationClientMock: IAuthenticationClient = {
  createAccount: jest.fn(),
  getAccountByEmail: jest.fn(),
  getAllAccounts: jest.fn(() => Promise.resolve([account1, account2])),
  login: jest.fn(),
  validateLogin: jest.fn(),
  getAccountById: jest.fn()
}
