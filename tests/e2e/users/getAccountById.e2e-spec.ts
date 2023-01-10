import { ClientErrorMessages } from '@infrastructure/clients/ClientErrorMessages'
import { app, testService } from 'tests/resources/TestServer'
import { authenticatedUserData, loginResult, routeHasAuthenticationGuardTest, setupAuthenticatedTestData } from '../authentication/AuthenticationUsecases'
import { getAccountById } from './UsersUsecases'

// SUT = Subject Under Test
const execSut = (params?: any) => getAccountById(params)

describe('Authentication End-To-End Tests', () => {
  beforeEach(async () => {
    await setupAuthenticatedTestData()
  })
  afterEach(async () => {
    testService.deleteAccountByEmail(authenticatedUserData.email)
    await app.close()
  })

  describe('/users/:id - Get account by id', () => {
    describe('Business Rules', () => {
      
      routeHasAuthenticationGuardTest(execSut)

      test('should return **Bad Request** if the given account.id dosent exist.', async () => {
        const { status, body } = await execSut({ id: 'bd10c4e7-6385-41a6-a9d1-90c0ee80db0d', loginToken: loginResult.loginToken })

        expect(body.message).toContain(ClientErrorMessages.ACCOUNT_NOT_FOUND)
        expect(status).toBe(400)
      })

      test('should return **OK** with the correct account on success', async () => {
        const { status, body } = await execSut()
        expect(body).toEqual(expect.objectContaining({ ...authenticatedUserData, id: expect.any(String) }))
        expect(status).toBe(200)
      })
    })
  })
})
