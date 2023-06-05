import type { Config } from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
  modulePathIgnorePatterns: ['<rootDir>/build/'],
  verbose: true,
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        isolatedModules: true,
        diagnostics: false,
        tsconfig: '<rootDir>/test/tsconfig.json',
      },
    ],
  },
  testPathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/config.*.js'],
};
export default config;
