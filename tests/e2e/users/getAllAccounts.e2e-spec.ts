import { account1, account2 } from 'src/infrastructure/clients/AuthenticationClient'
import { app, testService } from 'tests/resources/TestServer'
import { authenticatedUserData, routeHasAuthenticationGuardTest, setupAuthenticatedTestData } from '../authentication/AuthenticationUsecases'
import { getAllAccounts } from './UsersUsecases'

// SUT = Subject Under Test
const execSut = (params?: any) => getAllAccounts(params)

describe('Authentication End-To-End Tests', () => {
  beforeEach(async () => {
    await setupAuthenticatedTestData()
  })
  afterEach(async () => {
    testService.deleteAccountByEmail(authenticatedUserData.email)
    await app.close()
  })

  describe('/users - Get all accounts', () => {
    describe('Business Rules', () => {
      
      routeHasAuthenticationGuardTest(execSut)
      
      test('should return **OK** with an array containing all the accounts on success', async () => {
        const { status, body } = await execSut()
        expect(body).toEqual(
          expect.arrayContaining([
            { ...account1, id: expect.any(String) },
            { ...account2, id: expect.any(String) },
            { ...authenticatedUserData, id: expect.any(String) }
          ])
        )
        expect(status).toBe(200)
      })
    })
  })
})
