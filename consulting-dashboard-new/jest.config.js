// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Next.js appのディレクトリパス
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1',
    '^@/__mocks__/(.*)$': '<rootDir>/app/__mocks__/$1',
    '^@/lib/(.*)$': '<rootDir>/app/lib/$1',
    '^@/components/(.*)$': '<rootDir>/app/components/$1',
    '^@/types/(.*)$': '<rootDir>/app/types/$1',
  },
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '**/__tests__/**/*.{ts,tsx}',
    '**/*.test.{ts,tsx}',
  ],
  collectCoverageFrom: [
    'app/actions/**/*.{ts,tsx}',
    'app/lib/**/*.{ts,tsx}',
    'app/components/**/*.{ts,tsx}',
    '!app/components/ui/**', // shadcn/uiコンポーネントは除外
    '!app/**/*.d.ts',
    '!app/**/types.ts',
  ],
  clearMocks: true,
}

module.exports = createJestConfig(customJestConfig)