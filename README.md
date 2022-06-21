# NestJS - NodeJS - Backend Testing

# Objectives

The main objective of this project is to keep it as a knowledge base about backend testing, including tips and test examples, covering the majority of the most common use cases with unit, integration, and end-to-end tests.

**Application**

</br>

The application is an authentication API where you call a third party authentication service (scr/infrasctructure/AuthenticationClient). A mock service was made for the authentication client. This app have an authentication route (/register), where a new account can be created and a route to retrieve all accounts (/getAllAccounts). 

The main goal of the application was to include the usecases that i wanted to test.


## Structure

- NestJs backend using Typescript
- Jest as the main testing framework
- @faker-js/faker to generate random data

Test files:

- files .spec.ts: unit tests
- files .test.ts: integration tests
- files .e2e-spec.ts: end to end tests

### Setup

1. clone the git repository
1. run npm install

### To run the tests

1. open the terminal and run the command of the chosen test type

- `npm run test:unit` - unit tests
- `npm run test:int`  - integration tests
- `npm run test:e2e`  - end to end tests


###  To reach the endpoints:

1. If youre using vsCode, install the extension REST Client : https://marketplace.visualstudio.com/items?itemName=humao.rest-client
1. go to ``src/modules/authentication/authentication.http`` and send the requests


```
POST http://localhost:3003/register
content-type: application/json

{
    "name": "Test name",
    "email": "email@email.com",
    "age": 9,
    "address": {
       "country": "BR",
       "zipCode": "99999991"
    }
}

###

GET http://localhost:3003/getAllAccounts
content-type: application/json

{}
```

</br>


# Tests

Some concepts and tips to have in mind when writting tests:

- Validate only one scenario per test: minimize the number of asserts
- Tests should be Stateless: all elements in a test should return to the initial state after each test.
- **F.I.R.S.T**
    - **F**ast - test should be fast. When tests run slow, you won’t want to run them frequently.
    - **I**ndependent - Tests should not depend on each other. Tests should be able to run in any order.
    - **R**epeatable - Tests should be repeatable in any environment. If your test aren’t repeatable in any environment, then you’ll always have an excuse for why they fail.
    - **S**elf-Validating - Tests should have a boolean output. You should not have to read through a log file to tell whether the tests pass.
    - **T**imely - Tests need to be written in a timely fashion. Unit test should be written just before the production code. If you write tests after the production code, then you may find the production code to be hard to test
- Have fun making tests :sunglasses:


## Unit Tests

Unit tests are focused on testing the logic path inside a code unit. This unit is usually a method. Tests should have none or just a few external dependencies. Most dependencies can be simulated through mocks. 

If the test has too many dependencies, then an integration test may be better.

Some tips:

1. Check if the test covers all the logic of the method. Most tests should fail if you implement any change of logic inside the tested code, allowing the code to be refactored with fewer chances of creating bugs.
2. There is no need to always mock everything. If creating the mock demands a lot of effort and time, then it might be better to use the functionality directly.
3. It's not necessary to create unit tests for all external dependencies. If you don't trust them, then you shouldn't be using them. But, if it's a critical area of your software, go ahead.
4. The % percentage of coverage should not be the sole reference guiding a test strategy. Real code coverage will only be reached if item 1 from this list is followed.





