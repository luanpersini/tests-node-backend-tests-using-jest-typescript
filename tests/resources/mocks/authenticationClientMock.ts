import { IAuthenticationClient } from '@modules/shared/infrastructure/IAuthenticationClient'
import { authenticationClientAccountsStorage } from '../../../src/infrastructure/clients/AuthenticationClient'

export const authenticationClientMock: IAuthenticationClient = {
  createAccount: jest.fn(),
  getAccountByEmail: jest.fn(),
  getAllAccounts: jest.fn(() => Promise.resolve([...authenticationClientAccountsStorage])),
  login: jest.fn(),
  validateLogin: jest.fn(),
  getAccountById: jest.fn(),
  deleteAccountByEmail: jest.fn()
}
