module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["src"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json"
    }
  },
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.ts?$": "ts-jest"
  },
  testRegex: ".spec.ts$",
  modulePathIgnorePatterns: ["__mocks__", "node_modules"],
  testPathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/node_modules/"],
  testTimeout: 30000,
  coverageDirectory: "./coverage",
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/@types/**",
    "!**/interfaces/**",
    "!**/migrations/**",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/coverage/**",
    "!**/typings/**",
    "!src/index.ts",
    "!src/app.ts",
    "!src/database/index.ts",
    "!src/database/seeders/**",
    "!src/modules/app/**",
    "!src/config/**"
  ],
  coverageReporters: ["lcov", "text"]
};
