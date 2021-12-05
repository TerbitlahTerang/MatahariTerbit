import type { Config } from '@jest/types'
const config: Config.InitialOptions = {
  testMatch: [
    '<rootDir>/src/**/*.spec.ts',
    '<rootDir>/src/**/*.spec.tsx'
  ],
  verbose: true,
  reporters: ['default', 'jest-junit']
}
export default config