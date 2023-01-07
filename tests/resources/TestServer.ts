import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Server } from 'http'
import { AppModule } from 'src/app.module'
import { TestModule } from './test.module'
import { TestService } from './TestService'

let server: Server
let app: INestApplication
let testService: TestService

export const initServer = async (clearDb = true) => {
  const module = Test.createTestingModule({
    imports: [AppModule, TestModule]
  })
 
  const testModule = await module.compile()

  app = testModule.createNestApplication()
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  )

  server = app.getHttpServer()
  testService = app.get(TestService)

  await app.init() 
}

export { app, server, testService }

