# Testing Guide

This document provides information about testing the Student Records App.

## Testing Documentation

Comprehensive guide for running, writing, and understanding tests in the Student Records App.

### Overview

This project uses **Jest** for testing with **Supertest** for HTTP assertions and integration tests.

### Test Setup

#### Configuration Files

- **jest.config.js**: Main Jest configuration
- **jest-setup.js**: Test environment setup (env vars, console suppression)

#### Environment Variables

The following are set for tests (`jest-setup.js`):

```javascript
NODE_ENV=test
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root_password
DB_NAME=students_db_test
PORT=3001
```

## Test Structure

```
__tests__/
├── unit/
│   └── index.test.js          # Unit tests for core logic
└── integration/
    └── app.integration.test.js # Integration tests for endpoints
```

## Running Tests

### Basic Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- index.test.js

# Generate coverage report
npm test -- --coverage

# Run tests with verbose output
npm test -- --verbose

# Clear Jest cache
npm test -- --clearCache
```

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### Watch Mode (Auto-rerun on changes)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm test -- --coverage
```

## Test Coverage

The project maintains coverage thresholds:
- **Branches**: 60%
- **Functions**: 60%
- **Lines**: 60%
- **Statements**: 60%

Current thresholds (configured in `jest.config.js`):

| Metric | Threshold |
|--------|-----------|
| Branches | 60% |
| Functions | 60% |
| Lines | 60% |
| Statements | 60% |

View coverage report:
```bash
npm test -- --coverage
open coverage/lcov-report/index.html
```

## Unit Tests

Unit tests validate:
- Environment configuration
- Input validation (name, age, classroom)
- Data sanitization
- Error handling
- Utility functions
- Data formatting
- Student sorting

## Integration Tests

Integration tests validate:
- GET / (home page)
- POST /add-student (form submission)
- GET /health (health check)
- HTTP status codes
- Response types
- Error handling
- Request validation
- Response headers

### Example Test Suite

```javascript
describe('API Endpoints', () => {
  describe('GET /health', () => {
    it('should return 200 with OK status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('POST /add-student', () => {
    it('should add a student and redirect', async () => {
      const response = await request(app)
        .post('/add-student')
        .send({
          name: 'John Doe',
          age: 15,
          classroom: '10A'
        })
        .expect(302);
      
      expect(response.headers.location).toBe('/');
    });

    it('should return 400 for missing fields', async () => {
      await request(app)
        .post('/add-student')
        .send({ name: 'John Doe' })
        .expect(400);
    });
  });
});
```

## Writing Tests

### Test Naming Convention

```javascript
describe('Feature/Component Name', () => {
  it('should [expected behavior]', () => {
    // Test implementation
  });
});
```

### Example: Testing an Endpoint

```javascript
describe('POST /add-student', () => {
  it('should create a new student record', async () => {
    // Arrange
    const studentData = {
      name: 'Jane Smith',
      age: 16,
      classroom: '11B'
    };

    // Act
    const response = await request(app)
      .post('/add-student')
      .send(studentData)
      .expect(302); // Expect redirect on success

    // Assert
    expect(response.headers.location).toBe('/');
  });
});
```

### Example: Testing Error Handling

```javascript
describe('Error Handling', () => {
  it('should return 400 when required fields are missing', async () => {
    const response = await request(app)
      .post('/add-student')
      .send({ name: 'John' }) // Missing age and classroom
      .expect(400);

    expect(response.text).toContain('All fields are required');
  });
});
```

## Debugging Tests

### Run specific test file
```bash
npm test -- __tests__/unit/index.test.js
```

### Run tests matching pattern
```bash
npm test -- --testNamePattern="validation"
```

### Debug mode
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Run Single Test

```bash
npm test -- --testNamePattern="should add a student"
```

### Debug with Node Inspector

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Then open `chrome://inspect` in Chrome.

### Console Output in Tests

```javascript
it('should log output', () => {
  console.log('Debug info');
  expect(true).toBe(true);
});
```

Run with verbose flag to see console output:
```bash
npm test -- --verbose
```

## Troubleshooting

### Tests timeout
Increase timeout in jest.config.js:
```javascript
testTimeout: 10000 // 10 seconds
```

### MySQL connection errors
Ensure MySQL service is running:
```bash
docker-compose up -d db
```

### Coverage thresholds
If coverage is below threshold, add more tests or update `jest.config.js`

## Best Practices

1. **Isolation** - Each test should be independent
2. **Clarity** - Test names should clearly describe what's being tested
3. **AAA Pattern** - Arrange, Act, Assert
4. **Mocking** - Mock external dependencies (database, external APIs)
5. **Cleanup** - Clean up resources after each test
6. **Assertions** - Use specific assertions instead of generic ones

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://testingjavascript.com/)

## CI/CD Pipeline

The project uses GitHub Actions for automated testing:

### Triggers
- Push to main or develop branch
- Pull requests to main or develop branch

### Pipeline Steps

1. **Checkout** - Clone repository
2. **Setup Node.js** - Install Node 18
3. **Install Dependencies** - npm install
4. **Lint** - Run ESLint checks
5. **Unit Tests** - Run unit tests
6. **Integration Tests** - Run integration tests
7. **Coverage** - Generate coverage report
8. **Upload Coverage** - Send to Codecov
9. **Notify Slack** - Send status notification
10. **Notify Email** - Send failure email
11. **Docker Build** - Build Docker image (main branch only)

## Test Notifications

### Slack Notifications

Set the `SLACK_WEBHOOK_URL` secret in GitHub Settings.

Notifications include:
- Pipeline status (success/failure)
- Commit SHA
- Author name
- Branch name
- Link to workflow

### Email Notifications

Set these secrets in GitHub Settings:
- `EMAIL_SERVER` - SMTP server
- `EMAIL_PORT` - SMTP port
- `EMAIL_USERNAME` - SMTP username
- `EMAIL_PASSWORD` - SMTP password
- `EMAIL_RECIPIENT` - Recipient email
- `EMAIL_FROM` - Sender email

Emails are sent only on pipeline failure.

## Database Testing

### Test Database Setup

The test database (`students_db_test`) is automatically created by:
1. MySQL Docker image initialization
2. `init.sql` script execution

### Mocking Database

For unit tests, mock database calls:

```javascript
jest.mock('mysql2/promise', () => ({
  createConnection: jest.fn().mockResolvedValue({
    execute: jest.fn().mockResolvedValue([[]]),
  }),
}));
```

### Clearing Test Data

To clear test data between test runs:

```javascript
beforeEach(async () => {
  await db.execute('TRUNCATE TABLE students');
});
```

## Common Test Patterns

### Testing Async Functions

```javascript
it('should handle async operations', async () => {
  const result = await someAsyncFunction();
  expect(result).toEqual(expectedValue);
});
```

### Testing Promises

```javascript
it('should resolve with data', () => {
  return functionReturningPromise()
    .then(data => {
      expect(data).toEqual(expectedData);
    });
});
```

### Testing Error Cases

```javascript
it('should throw an error on invalid input', () => {
  expect(() => functionThatThrows()).toThrow('Error message');
});
```

### Testing with Mocks

```javascript
jest.mock('./module', () => ({
  functionName: jest.fn().mockReturnValue('mocked value')
}));

it('should call mocked function', () => {
  const result = functionName();
  expect(functionName).toHaveBeenCalled();
  expect(result).toBe('mocked value');
});
```

## GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root_password
          MYSQL_DATABASE: students_db_test
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run lint
```
