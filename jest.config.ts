import type { Config } from '@jest/types'
const config: Config.InitialOptions = {
  testMatch: [
    '<rootDir>/src/**/*.spec.ts',
    '<rootDir>/src/**/*.spec.tsx'
  ],
  verbose: true
}
export default config