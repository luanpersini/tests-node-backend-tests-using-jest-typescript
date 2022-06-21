import { account1, account2 } from '../../../src/infrastructure/clients/AuthenticationClient'

import { IAuthenticationClient } from '../../../src/infrastructure/clients/IAuthenticationClient'

export const authenticationClientMock: IAuthenticationClient = {
  createAccount: jest.fn(),
  getAccountByEmail: jest.fn(),
  deleteAccountByEmail: jest.fn(),
  getAllAccounts: jest.fn(() => Promise.resolve([account1, account2]))
}