# Testing in NestJS

The documentation and web tutorials are clear about unit testing and end-to-end tests. 

- https://docs.nestjs.com/fundamentals/testing
- https://blog.logrocket.com/unit-testing-nestjs-applications-with-jest/

You can easily unit test controllers and services, mocking the dependencies.

**Test using Sequelize:**

To test using sequelize, the only solution i found was to use a real database, making an adaptation of the end-to-end test, using `genresRepository = app.get(GenresRepository)`. Since all the module was loaded, i could also use the Genre Model.

Importing only the module that you will use instead of loading the entire AppModule make the test way faster.

- genres.repository.spec.ts

```javascript
import { Test, TestingModule } from '@nestjs/testing'

import { Genre } from '../domain/genre.model'
import { GenreDto } from '../domain/genre.dto'
import { GenresModule } from '../genres.module'
import { GenresRepository } from '../genres.repository'
import { INestApplication } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { sequelizeConfig } from '../../../config/database/sequelize.config'

const name = 'any name'
const createDto = { name: name } as GenreDto

describe('GenresRepository', () => {
  let app: INestApplication
  let genresRepository: GenresRepository

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      // You can get from app.module.ts only the module that you will import, plus the database connection
      imports: [SequelizeModule.forRoot(sequelizeConfig), GenresModule]
    }).compile()
    app = moduleFixture.createNestApplication()
    genresRepository = app.get(GenresRepository)
    await app.init()
  })
  afterEach(async () => {
    await Genre.destroy({
      where: {},
      truncate: true
    })
    await app.close()
  })
  describe('findOneByName', () => {
    test('should return the item found by name', async () => {
      const createdGenre = await genresRepository.create(createDto)
      const result = await genresRepository.findOneByName(createDto.name)
      expect(result).toBeTruthy()
      expect(result.id).toBeTruthy()
      expect(result.id).toEqual(createdGenre.id)
      expect(result.name).toEqual(createDto.name)
    })
  })
})
```
- genres.repository.ts

```javascript
import { BaseRepositoryAbstract } from 'src/infra/database/base-repository/base-repository-sequelize/base.repository.abstract'
import { Genre } from './domain/genre.model'
import { GenreDto } from './domain/genre.dto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GenresRepository extends BaseRepositoryAbstract<Genre, string, GenreDto, GenreDto> {
  constructor() {
    super(Genre)
  }

  async findOneByName(name: string): Promise<Genre> {
    return await Genre.findOne({
      where: {
        name
      }
    })
  }
}
```

## Unit Test Example

- genres.controller.spec.ts

```javascript
import { ArgumentMetadata, BadRequestException, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as faker from 'faker'
import { ItemAlreadyExistsError } from 'src/common/errors/item-already-exists-error'
import { GenreDto } from '../domain/genre.dto'
import { Genre } from '../domain/genre.model'
import { GenresController } from '../genres.controller'
import { GenresService } from '../genres.service'

const genreName = faker.music.genre()
const createDto = { name: genreName } as GenreDto
const fakeGenre = { id: faker.datatype.uuid(), name: genreName } as Genre

describe('GenresController', () => {
  let genresController: GenresController
  let genresService: GenresService

  beforeEach(async () => {
    const GenresServiceProvider = {
      provide: GenresService,
      useFactory: () => ({
        create: jest.fn(() => fakeGenre),
        findOne: jest.fn(() => fakeGenre)
      })
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenresController],
      providers: [GenresServiceProvider]
    }).compile()

    genresController = module.get<GenresController>(GenresController)
    genresService = module.get<GenresService>(GenresService)
  })

  describe('genresController.create', () => {
    test('should call genresService.create with the correct values', async () => {
      await genresController.create(createDto)
      expect(genresService.create).toHaveBeenCalledWith(createDto)
    })

    test('should Return **Forbidden** if there is already an genre with the given name', async () => {
      jest.spyOn(genresService, 'create').mockReturnValueOnce(null)
      const response = await genresController.create(createDto)
      expect(response).toEqual(new BadRequestException(new ItemAlreadyExistsError('Genre', 'Name')))
    })
    test('should Return **BadRequest** if validation returns an error', async () => {
      const target: ValidationPipe = new ValidationPipe({ transform: true, whitelist: true })
      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: GenreDto,
        data: ''
      }
      await target.transform(<GenreDto>{}, metadata).catch((err) => {
        expect(err.getResponse().statusCode).toEqual(400)
      })
    })
     test('should Return **Ok** with the created genre data', async () => {
      const response = await genresController.create(createDto)
      expect(response).toEqual(fakeGenre)
    })
  })
})
```

## End-To-End Test Example

- genres.e2e-spec.ts

```javascript
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Test } from '@nestjs/testing'
import * as faker from 'faker'
import { Server } from 'http'
import * as request from 'supertest'
import { ItemAlreadyExistsError } from '../src/common/errors/item-already-exists-error'
import { ItemNotFoundError } from '../src/common/errors/item-not-found-error'
import { StringHelper } from '../src/common/helpers/string.helper'
import { sequelizeConfig } from '../src/config/database/sequelize.config'
import { GenreDto } from '../src/modules/genres/domain/genre.dto'
import { Genre } from '../src/modules/genres/domain/genre.model'
import { GenresModule } from '../src/modules/genres/genres.module'



const name = 'any name'
const createDto = { name: StringHelper.titleCase(name) } as GenreDto
const uri = '/genres'

describe('Genres End-To-End Tests', () => {
  let app: INestApplication
  let server: Server

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      // You can get from app.module.ts only the module that you will import, plus the database connection
      imports: [SequelizeModule.forRoot(sequelizeConfig), GenresModule]
      // imports: [AppModule]
    }).compile()
    app = module.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true
      })
    )
    server = app.getHttpServer()
    await app.init()
  })
  afterEach(async () => {
    await Genre.destroy({
      where: {},
      truncate: true
    })
    await app.close()
  })

  describe('/Post Genres', () => {
    const execPost = () => {
      return request(server).post(uri).send({ name })
    }
    test('should Return **Ok** with the created genre data', async () => {
      const { status, body: result } = await execPost()
      expect(status).toBe(201)
      expect(result).toBeTruthy()
      expect(result.id).toBeTruthy()
      expect(result.name).toEqual(StringHelper.titleCase(name))
    })
    test('should Return **BadRequest** if there is already an genre with the given name', async () => {
      await Genre.create(createDto)
      const { status, body: result } = await execPost()
      expect(status).toBe(400)
      expect(result.name).toEqual(new ItemAlreadyExistsError('Genre', 'Name').name)
    })
    test('should Return **BadRequest** if an validation error occurs', async () => {
      const { status } = await request(server).post(uri).send({})
      expect(status).toBe(400)
    })
  })
   })
```