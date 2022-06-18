import * as request from 'supertest'

import { INestApplication, ValidationPipe } from '@nestjs/common'
import { createAccountDto, makeCreateAccountRequestData, makeDtoParams } from './register.e2e-data'

import { AuthenticationModule } from '../../src/modules/authentication/authentication.module'
import { Server } from 'http'
import { Test } from '@nestjs/testing'
import { faker } from '@faker-js/faker'
import { makeDtoTestParams } from '../testHelpers/dtoTestParamsFactory'
import { standardDtoTests } from '../testHelpers/standardDtoTests'
import { zipCodeLenghtMessage } from '../../src/modules/authentication/domain/dto/address.dto'

// SUT = Subject Under Test
let app: INestApplication
let server: Server
let requestData: any

const createDtoParams = makeDtoParams(createAccountDto)
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
    app.enableCors()
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true
      })
    )
    server = app.getHttpServer()
    // if you need to test any calls within a method, you can use this instance
    // authenticationService = app.get(AuthenticationService)
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
    await app.close()
  })

  describe('/Register', () => {
    describe('Business Rules', () => {
      test('should Return **BadRequest** if an validation error occurs', async () => {
        const { status } = await execSut()
        expect(status).toBe(400)
      })
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
      }
    )
  })
})

// If you dont have automated tests in your pipeline, you can run tests in every environment server using a local machine as the point of origin
// const servers = {
//   local: `localhost:3003`,
//   dev: 'https://dev.myservice.com',
//   homolog: 'https://hml..myservice.com',
// };
// server = servers.local;
