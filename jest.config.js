module.exports = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testPathIgnorePatterns: ['<rootDit>/.next/', '<rootDir>/node_modules/'],
    "moduleNameMapper": { 
      "\\.(css|less|scss|sss|styl)$": "<rootDir>/node_modules/jest-css-modules" 
    }
  }