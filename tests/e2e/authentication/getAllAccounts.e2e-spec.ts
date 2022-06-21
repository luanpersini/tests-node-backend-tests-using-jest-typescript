import * as request from 'supertest'

import { INestApplication, ValidationPipe } from '@nestjs/common'
import { account1, account2 } from '../../../src/infrastructure/clients/AuthenticationClient'

import { AuthenticationModule } from '../../../src/modules/authentication/authentication.module'
import { Server } from 'http'
import { Test } from '@nestjs/testing'

// SUT = Subject Under Test
let app: INestApplication
let server: Server

const uri = '/getAllAccounts'

export const execGet = () => {
  return request(server).get(uri)
}
const execSut = () => execGet()

const initServer = async () => {
  const module = await Test.createTestingModule({
    // You can import only the modules that you will test, plus the database connection if necessary
    // To enable everything, import the AppModule
    imports: [AuthenticationModule]
  }).compile()
  app = module.createNestApplication()  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  )
  server = app.getHttpServer()
  // if you need to t est any calls within a method, you can use this instance
  // authenticationClient= app.get(AuthenticationClient)
  await app.init()
}

describe('Authentication End-To-End Tests', () => {
  beforeEach(async () => {
    await initServer()    
  })
  afterEach(async () => { 
    await app.close()
  })

  describe('/getallaccounts', () => {
    describe('Business Rules', () => {
      test('should return **OK** with an array containing all the accounts on success', async () => {
        const { status, body } = await execSut()
        expect(body).toEqual(expect.arrayContaining([account1, account2]))
        expect(status).toBe(200)        
      })
    })
  })
})