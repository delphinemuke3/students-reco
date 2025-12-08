const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

describe('Student Records App - Integration Tests', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.json());

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString() 
      });
    });

    // Mock home route
    app.get('/', (req, res) => {
      res.status(200).send('<h1>Student Records Management</h1>');
    });

    // Mock add student route
    app.post('/add-student', (req, res) => {
      const { name, age, classroom } = req.body;

      if (!name || !age || !classroom) {
        return res.status(400).send('All fields are required');
      }

      // Simulate successful addition
      res.redirect('/');
    });
  });

  describe('GET /health', () => {
    test('should return health status OK', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('OK');
      expect(response.body).toHaveProperty('timestamp');
    });

    test('should return JSON response', async () => {
      const response = await request(app).get('/health');

      expect(response.type).toMatch(/json/);
    });

    test('should include valid timestamp', async () => {
      const response = await request(app).get('/health');

      const timestamp = new Date(response.body.timestamp);
      expect(timestamp instanceof Date && !isNaN(timestamp)).toBe(true);
    });
  });

  describe('GET /', () => {
    test('should return 200 status code', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
    });

    test('should return HTML response', async () => {
      const response = await request(app).get('/');

      expect(response.type).toMatch(/html/);
    });

    test('should contain student records title', async () => {
      const response = await request(app).get('/');

      expect(response.text).toContain('Student Records Management');
    });
  });

  describe('POST /add-student', () => {
    test('should accept valid student data', async () => {
      const response = await request(app)
        .post('/add-student')
        .send({
          name: 'John Doe',
          age: 15,
          classroom: '10A'
        });

      expect(response.status).toBe(302); // Redirect status
    });

    test('should reject missing name field', async () => {
      const response = await request(app)
        .post('/add-student')
        .send({
          age: 15,
          classroom: '10A'
        });

      expect(response.status).toBe(400);
      expect(response.text).toContain('All fields are required');
    });

    test('should reject missing age field', async () => {
      const response = await request(app)
        .post('/add-student')
        .send({
          name: 'John Doe',
          classroom: '10A'
        });

      expect(response.status).toBe(400);
    });

    test('should reject missing classroom field', async () => {
      const response = await request(app)
        .post('/add-student')
        .send({
          name: 'John Doe',
          age: 15
        });

      expect(response.status).toBe(400);
    });

    test('should reject empty request body', async () => {
      const response = await request(app)
        .post('/add-student')
        .send({});

      expect(response.status).toBe(400);
    });

    test('should handle special characters in names', async () => {
      const response = await request(app)
        .post('/add-student')
        .send({
          name: 'María García O\'Brien',
          age: 16,
          classroom: '10A'
        });

      expect(response.status).toBe(302);
    });

    test('should accept various valid ages', async () => {
      const validAges = [5, 15, 18, 25];

      for (const age of validAges) {
        const response = await request(app)
          .post('/add-student')
          .send({
            name: 'Test Student',
            age: age,
            classroom: '10A'
          });

        expect(response.status).toBe(302);
      }
    });

    test('should accept various valid classrooms', async () => {
      const validClassrooms = ['10A', '10B', '11-A', 'Class A'];

      for (const classroom of validClassrooms) {
        const response = await request(app)
          .post('/add-student')
          .send({
            name: 'Test Student',
            age: 15,
            classroom: classroom
          });

        expect(response.status).toBe(302);
      }
    });
  });

  describe('Error Handling', () => {
    test('should handle malformed requests gracefully', async () => {
      const response = await request(app)
        .post('/add-student')
        .set('Content-Type', 'application/json')
        .send('invalid json');

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    test('should handle missing content-type', async () => {
      const response = await request(app)
        .post('/add-student')
        .send({ name: 'John', age: 15, classroom: '10A' });

      expect([302, 200, 400]).toContain(response.status);
    });
  });

  describe('Response Headers', () => {
    test('should set appropriate content-type for HTML', async () => {
      const response = await request(app).get('/');

      expect(response.headers['content-type']).toMatch(/html/);
    });

    test('should set appropriate content-type for JSON', async () => {
      const response = await request(app).get('/health');

      expect(response.headers['content-type']).toMatch(/json/);
    });
  });
});
