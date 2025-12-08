module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'index.js',
    '!node_modules/**',
    '!coverage/**',
    '!__tests__/**'
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60
    }
  },
  testTimeout: 10000,
  verbose: true,
  forceExit: true,
  clearMocks: true
};
