module.exports = {
  rootDir: './',
  roots: ["<rootDir>/src/", "<rootDir>/tests/"],
  collectCoverage: false,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',    
    '!**/tests/**',
    '!**/__tests__/**',
    '!**/**.module.ts'
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  moduleNameMapper: {   
    "@api/(.*)": ["<rootDir>/src/api/$1"],
    "@application/(.*)": ["<rootDir>/src/application/$1"],
    "@domain/(.*)": ["<rootDir>/src/domain/$1"],
    "@infrastructure/(.*)": ["<rootDir>/src/infrastructure/$1"],
    "@nest/(.*)": ["<rootDir>/src/nest/$1"],
    "@tests/(.*)": ["<rootDir>/tests/$1"]
  }
}