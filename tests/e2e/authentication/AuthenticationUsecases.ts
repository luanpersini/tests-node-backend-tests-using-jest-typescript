import * as request from 'supertest'
import { app, initServer, server } from '../../resources/TestServer'
import { makeSignupRequestData } from './signup/signup.e2e-data'

export const userData = makeSignupRequestData()
export let loginToken = ''

export const userSignup = async (requestData?: any) => {
  const data = requestData ?? userData
  return await request(server).post('/signup').send(data)
}

export const userLogin = async (requestData?: any) => {
  const data = requestData ?? { email: userData.email, password: userData.password }
  return await request(server).post('/login').send(data)
}

// Used for every test who need a registered and loged in user to work
export const setupAuthenticatedTestData = async () => {
  await initServer(false)  
  await userSignup()  
  const loginResult = await userLogin()
  loginToken = loginResult.body  
  await app.close()
}
