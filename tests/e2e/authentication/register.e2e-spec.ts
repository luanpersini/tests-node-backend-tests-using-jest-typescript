import * as request from 'supertest'

import { INestApplication, ValidationPipe } from '@nestjs/common'
import { createAccountDtoParams, makeCreateAccountRequestData, makeDtoParams } from './register.e2e-data'

import { AuthenticationClient } from '../../../src/infrastructure/clients/AuthenticationClient'
import { AuthenticationModule } from '../../../src/modules/authentication/authentication.module'
import { ItemAlreadyExistsError } from '../../../src/api/errors/itemAlreadyExists.error'
import { Server } from 'http'
import { Test } from '@nestjs/testing'
import { faker } from '@faker-js/faker'
import { makeDtoTestParams } from '../../testHelpers/dtoTestParamsFactory'
import { standardDtoTests } from '../../testHelpers/standardDtoTests'
import { zipCodeLenghtMessage } from '../../../src/modules/authentication/domain/dto/address.dto'

// SUT = Subject Under Test
let app: INestApplication
let server: Server
let requestData: any
let authenticationClient: AuthenticationClient

const createDtoParams = makeDtoParams(createAccountDtoParams)
const testParams = makeDtoTestParams(createDtoParams)

const uri = '/register'

export const execPost = (requestData: any) => {
  return request(server).post(uri).send(requestData)
}
const execSut = () => execPost(requestData)

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
  authenticationClient= app.get(AuthenticationClient)
  await app.init()
}

const actAssert = async (message: string) => {
  const { status, body } = await execSut()
  expect(body.message).toContain(message)
  expect(status).toBe(400)
}

describe('Register End-To-End Tests', () => {
  beforeEach(async () => {
    await initServer()
    requestData = makeCreateAccountRequestData()
  })
  afterEach(async () => {    
    await authenticationClient.deleteAccountByEmail(requestData.email)
    await app.close()
  })

  describe('/Register', () => {
    describe('Business Rules', () => {
      test('should return **BadRequest** if zipCode is invalid (address.zipCode = 99999999)', async () => {
        requestData.address.zipCode = '99999999'

        const { status, body } = await execSut()
        
        expect(body.message).toContain('Invalid ZipCode')
        expect(status).toBe(400)
      })
      
      test('should return **BadRequest** if an account with the same email already exists', async () => {
        requestData.email = 'one@mail.com'

        const { status, body } = await execSut()
        expect(body.name).toContain(new ItemAlreadyExistsError('Account', 'Email').name)
        expect(status).toBe(400)        
      })

      test('should return **OK** with the created account on success', async () => {
        const { status, body } = await execSut()
        expect(body).toEqual(requestData)
        expect(status).toBe(201)        
      })
    })

    describe('Dto Validation', () => {
      standardDtoTests(testParams, makeCreateAccountRequestData, execPost, {}, { okStatus: 201 })

      test(`should return **Bad Request** if (address.zipcode) length is incorrect.`, async () => {
        const length = 8
        const message = 'address.' + zipCodeLenghtMessage

        requestData.address.zipCode = faker.finance.account(length - 1)
        await actAssert(message)

        requestData.address.zipCode = faker.finance.account(length + 1)
        await actAssert(message)
      })
    })
  })
})

// If you dont have automated tests in your pipeline, you can run tests in every environment server using a local machine as the point of origin
// const servers = {
//   local: `localhost:3003`,
//   dev: 'https://dev.myservice.com',
//   homolog: 'https://hml..myservice.com',
// };
// server = servers.local;
