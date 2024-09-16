import 'reflect-metadata';
import 'dotenv/config';
import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from '../tsconfig.json';

export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '..',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  globalSetup: './test/jest.global-setup.ts',
  globalTeardown: './test/jest.global-teardown.ts',
};
