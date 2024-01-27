import type { JestConfigWithTsJest } from 'ts-jest';

export default {
  moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },
  preset: 'ts-jest',
  testEnvironment: 'node',
} satisfies JestConfigWithTsJest;
