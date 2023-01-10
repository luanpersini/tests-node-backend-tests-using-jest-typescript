import { LoginResultDto } from '@modules/authentication/presentation/dtos/LoginDto'
import * as request from 'supertest'
import { app, initServer, server } from '../../resources/TestServer'
import { makeSignupRequestData } from './signup/signup.e2e-data'

export const authenticatedUserData = makeSignupRequestData()
export let loginResult: LoginResultDto = undefined

export const userSignup = async (requestData?: any) => {
  const data = requestData ?? authenticatedUserData
  return await request(server).post('/signup').send(data)
}

export const userLogin = async (requestData?: any) => {
  const data = requestData ?? { email: authenticatedUserData.email, password: authenticatedUserData.password }
  return await request(server).post('/login').send(data)
}

// Used for every test who need a registered and loged in user to work
export const setupAuthenticatedTestData = async () => {
  await initServer()
  await userSignup()
  const login = await userLogin()
  loginResult = login.body
  await app.close()
}

const FORBIDDEN_RESOURCE = 'Forbidden resource'

/**
 * Check if the route is protected by @UseGuards(AuthenticationGuard)
 * 
 *  
 */
export function routeHasAuthenticationGuardTest(execSut: any): void {
  test('should return **Bad Request** if the loginToken is wrong.', async () => {
    const { status, body } = await execSut({ id: loginResult.id, loginToken: 'wrong_token' })

    expect(body.message).toBe(FORBIDDEN_RESOURCE)
    expect(status).toBe(403)
  })
}
