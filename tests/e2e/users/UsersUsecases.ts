import * as request from 'supertest'
import { server } from '../../resources/TestServer'
import { loginResult } from '../authentication/AuthenticationUsecases'

export const getAllAccounts = async (requestData?: any) => {
  const data = requestData ?? loginResult
  return await request(server).get('/users').set({ Authorization: data.loginToken })
}

export const getAccountById = async (requestData?: any) => {
  const data = requestData ?? loginResult
  return await request(server).get(`/users/${data.id}`).set({ Authorization: data.loginToken })
}