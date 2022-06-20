import { account1, account2 } from '../../clients/AuthenticationClient'

import { IAuthenticationClient } from '../../clients/IAuthenticationClient'

export const authenticationClientMock: IAuthenticationClient = {
  createAccount: jest.fn(),
  getAccountByEmail: jest.fn(),
  deleteAccountByEmail: jest.fn(),
  getAllAccounts: jest.fn(() => Promise.resolve([account1, account2]))
}