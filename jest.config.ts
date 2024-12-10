import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom", // For browser-like testing, or 'node' if you're doing backend testing
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.app.json",
      },
    ],
  },
  moduleNameMapper: {
    // Add any module alias mappings here (for example, for Vite paths)
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Optional, for global setup
  setupFiles: ["<rootDir>/mock-extension-apis.js"],
  collectCoverage: true, // Optional, if you want to collect code coverage
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/global.d.ts",
    "!src/main.tsx",
    "!src/vite-env.d.ts",
    "!src/background/*.ts",
    "!src/content-script/*.ts",
  ],
};

export default config;
