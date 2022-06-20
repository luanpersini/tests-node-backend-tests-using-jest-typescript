import { set, unset } from 'lodash'

import { faker } from '@faker-js/faker'

// NestJs Dto validation test helper. requestFactory is an Api call using supertest or other similar tool.

export function standardDtoTests(testParams: any, dataFactory: any, requestFactory: any, dataFactoryParams?: any, status?: any) {
  let requestData: any

  const execSut = () => requestFactory(requestData)

  const actAssert = async (message: string) => {
    const { status, body } = await execSut()
    expect(body.message).toContain(message)
    expect(status).toBe(400)
  }

  const okStatus = status?.okStatus || 200

  beforeEach(async () => {
    requestData = dataFactory(dataFactoryParams)
  })

  if (testParams['Required']) {
    test.each(testParams['Required'])('should return **Bad Request** if param is required and is missing (%p)', async (p) => {
      unset(requestData, p)

      await actAssert(`${p} should not be empty`)
    })
  }

  if (testParams['IsOptional']) {
    test.each(testParams['IsOptional'])('should return **Ok** if param is optional and is missing (%p)', async (p) => {
      unset(requestData, p)

      const { status } = await execSut()
      expect(status).toBe(okStatus)
    })
  }

  if (testParams['IsEnum']) {
    test.each(testParams['IsEnum'])(
      'should return **Bad Request** if param doesnt exist in the ENUM definition (%p)',
      async (p) => {
        set(requestData, p, 'any_value')

        await actAssert(`${p} must be a valid enum value`)
      }
    )
  }

  if (testParams['IsString']) {
    test.each(testParams['IsString'])('should return **Bad Request** if param is not an string (%p)', async (p) => {
      set(requestData, p, 123)

      await actAssert(`${p} must be a string`)
    })
  }

  if (testParams['IsNumber']) {
    test.each(testParams['IsNumber'])('should return **Bad Request** if param is not an number (%p)', async (p) => {
      set(requestData, p, 'not_an_number')

      await actAssert(`${p} must be a number conforming to the specified constraints`)
    })
  }

  if (testParams['IsInt']) {
    test.each(testParams['IsInt'])('should return **Bad Request** if param is not an integer number (%p)', async (p) => {
      set(requestData, p, 11.99)

      await actAssert(`${p} must be an integer number`)
    })
  }

  if (testParams['IsPositive']) {
    test.each(testParams['IsPositive'])('should return **Bad Request** if param is not a positive number (%p)', async (p) => {
      set(requestData, p, -1)

      await actAssert(`${p} must be a positive number`)
    })
  }

  if (testParams['IsNumberString']) {
    test.each(testParams['IsNumberString'])(
      'should return **Bad Request** if param is not an number in string format (%p)',
      async (p) => {
        set(requestData, p, 123)

        await actAssert(`${p} must be a number string`)
      }
    )
  }

  if (testParams['IsISO8601']) {
    test.each(testParams['IsISO8601'])('should return **Bad Request** if param is not an Date format ISO8601 (%p)', async (p) => {
      set(requestData, p, 'not_a_ISO8601')

      await actAssert(`${p} must be a valid ISO 8601 date string`)
    })
  }

  if (testParams['IsObject']) {
    test.each(testParams['IsObject'])(`should return **Bad Request** if param is not an object (%p)`, async (p) => {
      set(requestData, p, [])

      await actAssert(`${p} must be an object`)
    })
  }

  if (testParams['IsNotEmptyObject']) {
    test.each(testParams['IsNotEmptyObject'])(`should return **Bad Request** if param is an empty object (%p)`, async (p) => {
      set(requestData, p, {})
      
      // The message cant be guessed because of nested objects validation. In any case, it will return bad request. 
      const { status } = await execSut()
      expect(status).toBe(400)
    })
  }

  if (testParams['MaxLength']) {
    test.each(testParams['MaxLength'])(
      `should return **Bad Request** if param length exceeds MaxLenght: (%p) length > %i`,
      async (p: string, i: number) => {
        const value: string = faker.finance.account(i + 1)
        set(requestData, p, value)

        await actAssert(`${p} must be shorter than or equal to ${i} characters`)
      }
    )
  }

  if (testParams['MinLength']) {
    test.each(testParams['MinLength'])(
      `should return **Bad Request** if param length is shorter than MinLenght: (%p) length < %i`,
      async (p: string, i: number) => {
        const value: string = faker.finance.account(i - 1)
        set(requestData, p, value)

        await actAssert(`${p} must be longer than or equal to ${i} characters`)
      }
    )
  }

  if (testParams['Max']) {
    test.each(testParams['Max'])(
      `should return **Bad Request** if param exceeds Max Value: (%p) > %i`,
      async (p: string, i: number) => {
        const value: number = i + 1
        set(requestData, p, value)

        await actAssert(`${p} must not be greater than ${i}`)
      }
    )
  }

  if (testParams['Min']) {
    test.each(testParams['Min'])(
      `should return **Bad Request** if param is lower than Min Value: (%p) < %i`,
      async (p: string, i: number) => {
        const value: number = i - 1
        set(requestData, p, value)

        await actAssert(`${p} must not be less than ${i}`)
      }
    )
  }
}
