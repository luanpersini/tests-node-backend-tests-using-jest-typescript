import * as dotenv from 'dotenv'

import { AppModule } from './app.module'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'

dotenv.config()

const { port } = process.env

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  )
  await app.listen(port)
}

bootstrap().then(() => console.log(`server running at port ${port}`))
