import { ClientErrorMessages } from '@infrastructure/clients/ClientErrorMessages'
import { app, initServer, testService } from 'tests/resources/TestServer'
import { makeDtoTestParams } from '../../../resources/testHelpers/dtoTestParamsFactory'
import { standardDtoTests } from '../../../resources/testHelpers/standardDtoTests'
import { userLogin, userSignup } from '../AuthenticationUsecases'
import { loginDtoParams, makeDtoParams, makeLoginRequestData } from './login.e2e-data'

let requestData: any

//Create the raw array with the rules of the DTO params
const createDtoParams = makeDtoParams(loginDtoParams)
//Create the organized array with the rules of the DTO params to be used in the standardDtoTests
const testParams = makeDtoTestParams(createDtoParams)

// SUT = Subject Under Test
const execSut = () => userLogin(requestData)

describe('Authentication End-To-End Tests', () => {
  beforeEach(async () => {
    await initServer()
    userSignup()
    requestData = makeLoginRequestData()
  })
  afterEach(async () => {
    testService.deleteAccountByEmail(requestData.email)
    await app.close()
  })

  describe('/login', () => {
    describe('Business Rules', () => {
      test('should return **BadRequest** email does not exists in the database.', async () => {
        requestData.email = 'idontexist@idontexist.com.net.info.br'

        const { status, body } = await execSut()

        expect(body.message).toContain(ClientErrorMessages.INVALID_CREDENTIALS)
        expect(status).toBe(400)
      })

      test('should return **BadRequest** if password is incorrect.', async () => {
        requestData.password = 'im_a_incorrect_password'

        const { status, body } = await execSut()

        expect(body.message).toContain(ClientErrorMessages.INVALID_CREDENTIALS)
        expect(status).toBe(400)
      })

      test('should return **OK** with the login token on success', async () => {
        const { status, body } = await execSut()
        expect(body).toEqual({ loginToken: expect.any(String), id: expect.any(String) })
        expect(status).toBe(201)
      })
    })

    describe('Dto Validation', () => {
      standardDtoTests(testParams, makeLoginRequestData, userLogin, {}, { okStatus: 201 })
    })
  })
})
