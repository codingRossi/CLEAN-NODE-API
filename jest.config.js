/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/main/**"
  ],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  preset: "@shelf/jest-mongodb",
  roots: [
    "<rootDir>/src"
  ],
  testEnvironment: "node",
  transform: {
    ".+\\.ts$": "ts-jest"
  },
};

module.exports = config;
