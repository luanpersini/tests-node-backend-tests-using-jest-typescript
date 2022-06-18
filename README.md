# Vidly-Server-NestJS-TS

# Objectives

The main objective of this project is to learn NestJS, for that, im going to convert an server APP built using NodeJS-Javascript-Mongoose to an APP using NestJS-Typescript-Sequelize-Postgres, following SOLID, TDD and Clean Code principles. The idea is to deal with the challanges of the conversion, focusing on the tecnologies instead of the bussiness rules of the App.

The frontend can be fount at https://github.com/luanpersini/vidly-front-react-ts

**From:**

- NodeJS 
- Javascript 
- Mongoose

**To:**
- NodeJS
- NestJS
- Typescript
- Sequelize (Postgres)

## Vidly

Vidly is a movie rent plataform where you can manage movies, customers, rents and genres. Authentication and authorization is present and all data is consumed from an external API, build in nodejs. The customers and rent

## Tests

- files .spec.ts: unit tests
- files .test.ts: integration tests
- files .e2e-spec.ts: end to end tests

## What was archieve so far: Challanges and Knowledge Base

NestJS is focused on fast development. The structure provided by Nest allowed me to develop most of the usual stuff and test without using interfaces for the services and repositories (Nest uses class-based injection). 
 
The interaction with the built-in supported databases and ORMs also helped me to speedup the development. The database connection is easily injected into the modules, only requiring you to point to the models or entities that will define the rules of the database operations. 

It was quite hard to learn how to test in NestJS with Sequelize and Postgres because there was too few info about this in the web. I also couldnt find an in memory database for this scenario, the solution was to use a real database.

</br>

- Learned [how to make a Base Abstract Repository](/docs/knowledge-base/base-repository.md) with the most used functions to avoid repetition, speeding up the development.
- Learned [how to implement abstraction in NestJS.](/docs/knowledge-base/abstraction-in-nestjs.md)
- Learned [how to test in NestJS using Sequelize.](/docs/knowledge-base/test-in-nestjs.md)
- Learned [how to use DTOs in NestJS](https://docs.nestjs.com/controllers#request-payloads) and [how to make NestJs only accept properties that are specified in the whitelist.](https://docs.nestjs.com/techniques/validation#stripping-properties)
- Learned that NestJS handles all uncaught exceptions because the framework has a built-in exception handler.
- Implemented a Http exception filter to standardize the exception response.


</br>

**Credits:**

The original app was build by Mosh. You can find his courses at: https://codewithmosh.com/