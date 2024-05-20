/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],//, '!<rootDir>/src/main/**'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageProvider: 'babel',
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  roots: ['<rootDir>/src'],
  testEnvironment: 'jest-environment-node',
}
