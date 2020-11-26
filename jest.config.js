module.exports = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testPathIgnorePatterns: ['<rootDit>/.next/', '<rootDir>/node_modules/'],
    "moduleNameMapper": { "\\.(css|less)$": "<rootDir>/assets/__mocks__/styleMock.js" }
  }