require('dotenv').config();

module.exports = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testPathIgnorePatterns: ['<rootDit>/.next/', '<rootDir>/node_modules/'],
    "moduleNameMapper": {
      "\\.(css|less|scss|sss|styl)$": "<rootDir>/node_modules/jest-css-modules"
    },
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.jsx?$",
    "globals": {
      "__baseUrl__": 'https://planet-webapp-51iccyhsu.vercel.app'
    }
  }
