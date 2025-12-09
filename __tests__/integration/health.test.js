const request = require('supertest');
const app = require('../../server');

describe('Integration: /health', () => {
  test('GET /health -> 200 and status OK', async () => {
    const res = await request(app).get('/health').expect(200);
    expect(res.body).toHaveProperty('status', 'OK');
    expect(res.body).toHaveProperty('timestamp');
  });
});
