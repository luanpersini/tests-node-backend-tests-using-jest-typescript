# Abstraction in NestJS

To archieve abstraction in NestJS you can use interfaces like on a normal NodeJs/Typescript App. The main difference is that you dont need to create factories, the framework will handle it automaticaly, but you must point the interfaces and their implementations.

Interfaces are good for unit testing because you can mock the dependencies. It also allow team members to develop and test their code without depend on others.

See bellow some examples.

**Providers abstraction:**

I have tested the example bellow with services and repositories, but i guess it may work with anything that uses a similar structure.

1 - Create the Entity and Dto interfaces
2 - Create the Service Interface
3 - Add the @Inject() inside the controller constructor
4 - Create the Service Implementation
5 - Add the interface and the implementation names in the module providers section

## 1 - Create the Entity and Dto interfaces 

- Genre DTO

```javascript
import { IsNotEmpty, IsString, Length } from 'class-validator'

export class GenreDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 30, {
    message: 'Genre must be between $constraint1 and $constraint2 characters.'
  })
  name: string
}
```

- Genre Entity

```javascript
export class Genre {
  id: number
  name: string
}
```
## 2 - Create the Service interfaces 

- Genres Service Interface

```javascript
import { Genre } from '../entities/genre.entity'
import { GenreDto } from '../dto/genre.dto'

export interface GenresServiceInterface {
  findAll: () => Promise<Genre[]>
  findOneById: (id: number) => Promise<Genre>
  create: (createDto: GenreDto) => Promise<Genre>
  update: (id: number, updateDto: GenreDto) => Promise<Genre>
  remove: (id: number) => Promise<boolean>
}
```

## 3 - Add the @Inject() inside the controller constructor

- Genres Controller

- Note the constructor with the @Inject('GenresServiceInterface'). 
- One common error here is to misstype the name inside @Inject(). If the app gives and error when you start it, check if you wrote it right. 
- Make unit tests to avoid this kind of error

```javascript
@Controller('genres')
export class GenresController {
  constructor(
    @Inject('GenresServiceInterface')
    private readonly genresService: GenresServiceInterface
  ) {}

  @Post()
  create(@Body() body: GenreDto) {
    return this.genresService.create(body)
  }

  @Get()
  findAll() {
    return this.genresService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.genresService.findOneById(+id)
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() body: GenreDto) {
    return this.genresService.update(+id, body)
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.genresService.remove(+id)
  }
}
```

## 4 - Create the Service Implementation

- Genres Service

```javascript
import { Inject, Injectable } from '@nestjs/common'
import { GenreDto } from './dto/genre.dto'
import { GenresRepositoryInterface } from './interfaces/genres.repository.interface'

@Injectable()
export class GenresService {
  constructor(
    @Inject('GenresRepositoryInterface')
    private readonly genresRepository: GenresRepositoryInterface
  ) {}

  create(createDto: GenreDto) {
    return this.genresRepository.create(createDto)
  }

  findAll() {
    return this.genresRepository.findAll()
  }

  async findOneById(id: number) {
    const genre = await this.genresRepository.findOneById(id)
    return genre
  }

  update(id: number, updateDto: GenreDto) {
    return this.genresRepository.update(id, updateDto)
  }

  remove(id: number) {
    return this.genresRepository.remove(id)
  }
}
```

## 5 - Add the interface and the implementation names in the module providers section

- Genres Module

```javascript
import { GenresController } from './genres.controller'
import { GenresService } from './genres.service'
import { Module } from '@nestjs/common'

@Module({
  controllers: [GenresController],
  providers: [
    {
      provide: 'GenresServiceInterface',
      useClass: GenresService
    }
  ]
})
export class GenresModule {}
```