# Testing Guide

This document provides information about testing the Student Records App.

## Test Structure

```
__tests__/
├── unit/
│   └── index.test.js          # Unit tests for core logic
└── integration/
    └── app.integration.test.js # Integration tests for endpoints
```

## Running Tests

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

## Writing New Tests

### Unit Test Template

```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  test('should do something specific', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = functionUnderTest(input);

    // Assert
    expect(result).toBe('expected output');
  });
});
```

### Integration Test Template

```javascript
describe('API Endpoint', () => {
  let app;

  beforeEach(() => {
    app = setupApp();
  });

  test('should return 200 for valid request', async () => {
    const response = await request(app)
      .post('/endpoint')
      .send({ data: 'value' });

    expect(response.status).toBe(200);
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
