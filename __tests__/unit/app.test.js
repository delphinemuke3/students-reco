const app = require('../../server');

describe('Basic unit checks', () => {
  test('app should be an express instance (truthy)', () => {
    expect(app).toBeDefined();
  });
});
