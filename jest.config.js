/** @type {import('ts-jest').JestConfigWithTsJest} **/
require('dotenv/config');

module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
  testMatch: ['**/tests/**/*.test.ts'],
};