import { faker } from '@faker-js/faker'
import { ClientErrorMessages } from '@infrastructure/clients/ClientErrorMessages'
import { AuthenticationErrorMessages } from '@modules/authentication/domain/errors/AuthenticationErrorMessages'
import { zipCodeLenghtMessage } from '@modules/authentication/presentation/dtos/AddressDto'
import { app, initServer, testService } from 'tests/resources/TestServer'
import { makeDtoTestParams } from '../../../resources/testHelpers/dtoTestParamsFactory'
import { standardDtoTests } from '../../../resources/testHelpers/standardDtoTests'
import { userSignup } from '../AuthenticationUsecases'
import { makeDtoParams, makeSignupRequestData, signupDtoParams } from './signup.e2e-data'

let requestData: any

//Create the raw array with the rules of the DTO params
const createDtoParams = makeDtoParams(signupDtoParams)
//Create the organized array with the rules of the DTO params to be used in the standardDtoTests
const testParams = makeDtoTestParams(createDtoParams)

// SUT = Subject Under Test
const execSut = () => userSignup(requestData)

const actAssert = async (message: string) => {
  const { status, body } = await execSut()
  expect(body.message).toContain(message)
  expect(status).toBe(400)
}

describe('Authentication End-To-End Tests', () => {
  beforeEach(async () => {
    await initServer()
    requestData = makeSignupRequestData()
  })
  afterEach(async () => {
    testService.deleteAccountByEmail(requestData.email)
    await app.close()
  })

  describe('/signup', () => {
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
             
        expect(body.message).toContain(ClientErrorMessages.ACCOUNT_ALREADY_EXISTS)
        expect(status).toBe(400)        
      })

      test('should return **BadRequest** if (password) is weak', async () => {
        requestData.password = '1234'

        const { status, body } = await execSut()
             
        expect(body.message).toContain(AuthenticationErrorMessages.PASSWORD_TOO_WEAK)
        expect(status).toBe(400)        
      })

      test('should return **OK** with the created account on success', async () => {
        const { status, body } = await execSut()
        expect(body).toEqual({...requestData, id: expect.any(String)})
        expect(status).toBe(201)        
      })
    })

    describe('Dto Validation', () => {
      standardDtoTests(testParams, makeSignupRequestData, userSignup, {}, { okStatus: 201 })

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