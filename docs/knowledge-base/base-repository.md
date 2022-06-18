# Base Abstract Repository

A base abstract repository is a class that you can extend your repositories from, avoiding repetition (DRY). One of the advantages is that you just need to make the tests for the base functions once, testing only if the services are calling them with the correct data. 

If you need a new function or a different behavior from an existing function, you can override it or create a new one.

My base repository was built using Sequelize ORM and NestJS. 

You can see the code **[here](/src/infra/database/base-repository)**

**Steps:**

1. [Create a Base Repository Interface](#1---create-a-base-repository-interface)
2. [Create a Base Repository Abstract Class](#2---create-a-base-repository-abstract-class)
3. [Create a Module to test your Base Repository Abstract Class](#3---create-a-module-to-test-your-base-repository-abstract-class)
4. [Create tests for the extended Base Repository](#4---create-tests-for-your-extended-base-repository)

## 1 - Create a base repository interface

You can add all functions to one interface or create one for each function, its up to you.

This interface is making use of generics types from typescript (https://www.typescriptlang.org/docs/handbook/2/generics.html).

- base.repository.interface.ts

```javascript
export interface BaseRepositoryInterface<Entity, ID, CreateDto, UpdateDto> {
  findAll(): Promise<Entity[]>
  create(createDto: CreateDto): Promise<Entity>
  findOrCreate(createDto: CreateDto, condition: Record<string, unknown>): Promise<Entity>
  findOneById: (id: ID) => Promise<Entity>
  findOneByCondition(condition: Record<string, unknown>): Promise<Entity>
  update: (id: ID, updateDto: UpdateDto) => Promise<Entity>
  remove: (id: ID) => Promise<any>
}
```

## 2 - Create a Base Repository Abstract Class

- base.repository.abstract.ts

```javascript
import { BaseRepositoryInterface } from '../base.repository.interface'
import { Repository } from 'sequelize-typescript'

// Implemented based on Sequelize ORM
export abstract class BaseRepositoryAbstract<Entity, ID, CreateDto, UpdateDto>
  implements BaseRepositoryInterface<Entity, ID, CreateDto, UpdateDto>
{
  private entity: Repository<any>

  protected constructor(entity: Repository<Entity>) {
    this.entity = entity
  }

  public async findAll(): Promise<Entity[]> {
    return this.entity.findAll({
      raw: true
    })
  }
  public async create(createDto: CreateDto): Promise<Entity> {
    return await this.entity.create({ ...createDto })
  }
  public async findOrCreate(
    createDto: CreateDto,
    condition: Record<string, unknown>
  ): Promise<Entity> {
    const [createdItem, created] = await this.entity.findOrCreate({
      where: condition,
      defaults: {
        ...createDto
      }
    })
    if (created) {
      return createdItem
    }
    return null
  }
  public async findOneById(id: ID): Promise<Entity> {
    return await this.entity.findOne({
      where: {
        id: id
      }
    })
  }
  public async findOneByCondition(condition: Record<string, unknown>): Promise<Entity> {
    return await this.entity.findOne({
      where: condition
    })
  }

  public async update(id: ID, updateDto: UpdateDto): Promise<Entity> {
    let item = await this.entity.findOne({
      where: { id: id }
    })
    if (!item) {
      return null
    }
    item = await item.update({ ...updateDto })
    return item
  }

  public async remove(id: ID): Promise<any> {
    return await this.entity.destroy({
      where: { id: id }
    })
  }
}

```

## 3 - Create a Module to test your Base Repository Abstract Class

Since you cant instantiate an abstract class, you need to create a repository extendint the base class to test it. To do so, create an module with a DTO, a Model, a Module and a Repository.

- base-repository-sequelize.repository.ts

```javascript
import { BaseRepositoryAbstract } from 'src/infra/database/base-repository/base-repository-sequelize/base.repository.abstract'
import { BaseRepositorySequelizeDto } from './domain/base-test.dto'
import { BaseRepositorySequelizeModel } from './domain/base.repository.model'
import { Injectable } from '@nestjs/common'

@Injectable()
export class BaseRepositorySequelizeRepository extends BaseRepositoryAbstract<
  BaseRepositorySequelizeModel,
  string,
  BaseRepositorySequelizeDto,
  BaseRepositorySequelizeDto
> {
  constructor() {
    super(BaseRepositorySequelizeModel)
  }
}
```

## 4 - Create tests for your extended base repository

- base-repository-sequelize.test.ts

```javascript
import * as faker from 'faker'

import { Test, TestingModule } from '@nestjs/testing'

import { BaseRepositorySequelizeDto } from './domain/base-test.dto'
import { BaseRepositorySequelizeModel } from './domain/base.repository.model'
import { BaseRepositorySequelizeModule } from './base-repository-sequelize.module'
import { BaseRepositorySequelizeRepository } from './base-repository-sequelize.repository'
import { INestApplication } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { sequelizeConfig } from '../../../../config/database/sequelize.config'

const name = faker.name.findName()
const name2 = faker.name.findName()
const randomUuid = faker.datatype.uuid()
const createDto = { name: name } as BaseRepositorySequelizeDto
const createDto2 = { name: name2 } as BaseRepositorySequelizeDto

describe('Base Repository Sequelize', () => {
  let app: INestApplication
  let baseRepository: BaseRepositorySequelizeRepository

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SequelizeModule.forRoot(sequelizeConfig), BaseRepositorySequelizeModule]
    }).compile()
    app = moduleFixture.createNestApplication()
    baseRepository = app.get(BaseRepositorySequelizeRepository)
    await app.init()
  })
  afterEach(async () => {
    await BaseRepositorySequelizeModel.destroy({
      where: {},
      truncate: true
    })
    await app.close()
  })
  describe('Validation Test', () => {
    test('should **Throw** if a item with the given name already exists in the database - @Unique()', async () => {
      await baseRepository.create(createDto)
      await expect(baseRepository.create(createDto)).rejects.toThrowError()
    })
    test('should **Throw** if the given ID is not a UUID - @Column({ type: DataTypes.UUID })', async () => {
      await expect(baseRepository.findOneById('im_not_a_uuid')).rejects.toThrowError()
    })
  })
  describe('findAll()', () => {
    test('should Return the located item data', async () => {
      // create a genre
      await baseRepository.create(createDto)
      await baseRepository.create(createDto2)
      // locate the genre using the model
      const modelResult = await BaseRepositorySequelizeModel.findAll()
      // locate the genre using the repository
      const repositoryResult = await baseRepository.findAll()
      // compare both values
      expect(repositoryResult).toBeTruthy()
      expect(repositoryResult[0].name).toEqual(modelResult[0].name)
      expect(repositoryResult[1].name).toEqual(modelResult[1].name)
    })
  })
  describe('Create()', () => {
    test('should Return the created item data', async () => {
      const result = await baseRepository.create(createDto)
      expect(result).toBeTruthy()
      expect(result.id).toBeTruthy()
      expect(result.name).toEqual(name)
    })
  })
  describe('findOrCreate()', () => {
    test('should return the created item data', async () => {
      const result = await baseRepository.findOrCreate(createDto, { name: createDto.name })
      expect(result).toBeTruthy()
      expect(result.id).toBeTruthy()
      expect(result.name).toEqual(name)
    })
    test('should Return **Null** if a item with the given name already exists in the database.', async () => {
      await baseRepository.create(createDto)
      const result = await baseRepository.findOrCreate(createDto, { name: createDto.name })
      expect(result).toBeNull()
    })
  })
  describe('findOneById()', () => {
    test('should Return the item with the given ID', async () => {
      const item = await baseRepository.create(createDto)
      const result = await baseRepository.findOneById(item.id)
      expect(result.id).toEqual(item.id)
      expect(result.name).toEqual(item.name)
    })
    test('should Return **Null** if the item with the given ID is not found', async () => {
      const result = await baseRepository.findOneById(randomUuid)
      expect(result).toBeNull()
    })
  })
  describe('findOneByCondition()', () => {
    test('should Return the item with the given condition', async () => {
      const item = await baseRepository.create(createDto)
      const result = await baseRepository.findOneByCondition({ id: item.id })
      expect(result.id).toEqual(item.id)
      expect(result.name).toEqual(item.name)
    })
    test('should Return **Null** if the item with the given contidion is not found', async () => {
      const result = await baseRepository.findOneByCondition({ id: randomUuid })
      expect(result).toBeNull()
    })
  })
  describe('update()', () => {
    test('should Return **Null** if the item with the given ID is not found', async () => {
      const result = await baseRepository.update(randomUuid, createDto)
      expect(result).toBeNull()
    })
    test('should Return the updated item on success', async () => {
      const item = await baseRepository.create(createDto)
      const newName = 'New Name'
      const result = await baseRepository.update(item.id, { name: newName })
      expect(result.id).toEqual(item.id)
      expect(result.name).toEqual(newName)
    })
  })
  describe('remove()', () => {
    test('should Return **1** if the item was successfuly deleted', async () => {
      const item = await baseRepository.create(createDto)
      const result = await baseRepository.remove(item.id)
      expect(result).toEqual(1)
    })
    test('should Return **0** if the item with the given ID is not found', async () => {
      const result = await baseRepository.remove(randomUuid)
      expect(result).toEqual(0)
    })
  })
})
```