module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // transform: {"\\.[jt]sx?$": "babel-jest"},
  transformIgnorePatterns: ["/node_modules/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  // transformIgnorePatterns: ["/node_modules\/(?!hack-hydra-dx-wasm).+/"],
  globals: {
    "ts-jest": {
      tsConfig: {
        // allow js in typescript
        allowJs: true,
      },
    },
  },
};