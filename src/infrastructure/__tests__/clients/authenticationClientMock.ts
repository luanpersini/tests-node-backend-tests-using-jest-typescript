import { IAuthenticationClient } from '../../clients/IAuthenticationClient'

export const authenticationClientMock: IAuthenticationClient = {
  createAccount: jest.fn(),
  getAccountByEmail: jest.fn()
}