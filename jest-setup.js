// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DB_HOST = process.env.DB_HOST || 'localhost';
process.env.DB_USER = process.env.DB_USER || 'root';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'root_password';
process.env.DB_NAME = process.env.DB_NAME || 'students_db_test';
process.env.PORT = process.env.PORT || 3001;

// Suppress console logs during tests (optional)
// eslint-disable-next-line no-console
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  // Keeping error to see actual errors
  error: console.error,
};

// eslint-disable-next-line no-console
console.log('Test environment variables set.');
