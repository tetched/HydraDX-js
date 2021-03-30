module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  globals: {
    "ts-jest": {
      tsconfig: {
        // allow js in typescript
        allowJs: true,
      },
    },
  },
  setupFiles: ["<rootDir>/jest.env.js"],
  testTimeout: 3600000,
};