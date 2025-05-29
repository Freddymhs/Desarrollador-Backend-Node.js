import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import('jest').Config} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",

    "^@config/(.*)$": "<rootDir>/src/config/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@middleware/(.*)$": "<rootDir>/src/middleware/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@controllers/(.*)$": "<rootDir>/src/controllers/$1",
    "^@routes/(.*)$": "<rootDir>/src/routes/$1",
    "^@app$": "<rootDir>/src/app",
  },
};
