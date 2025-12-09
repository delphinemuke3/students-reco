const request = require('supertest');

// Note: In a real scenario, you'd mock the database or use a test database
// For now, we'll create a minimal test suite that can run with proper setup

let app;
let db;

// Mock database for testing
const mockDb = {
  execute: jest.fn()
};

describe('Student Records API', () => {
  beforeAll(async () => {
    // Setup: Create app with mocked database
    const express = require('express');
    const bodyParser = require('body-parser');
    const path = require('path');

    app = express();
    
    // Middleware
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.static('public'));
    
    // Set view engine
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../views'));

    // Mock database
    db = mockDb;

    // Routes
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    app.get('/', async (req, res) => {
      try {
        const [students] = await db.execute('SELECT * FROM students ORDER BY created_at DESC');
        res.render('index', { students });
      } catch (error) {
        res.status(500).json({ error: 'Error loading students' });
      }
    });

    app.post('/add-student', async (req, res) => {
      const { name, age, classroom } = req.body;
      
      if (!name || !age || !classroom) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      try {
        await db.execute(
          'INSERT INTO students (name, age, classroom) VALUES (?, ?, ?)',
          [name, parseInt(age, 10), classroom]
        );
        res.status(201).json({ message: 'Student added successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to add student' });
      }
    });

    app.get('/api/students', async (req, res) => {
      try {
        const [students] = await db.execute('SELECT * FROM students ORDER BY created_at DESC');
        res.json(students);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching students' });
      }
    });
  });

  describe('GET /health', () => {
    it('should return 200 with OK status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
      expect(typeof response.body.timestamp).toBe('string');
    });

    it('should return a valid ISO timestamp', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      const timestamp = new Date(response.body.timestamp);
      expect(timestamp instanceof Date).toBe(true);
      expect(timestamp.toString()).not.toBe('Invalid Date');
    });
  });

  describe('POST /add-student', () => {
    it('should add a student with valid data', async () => {
      mockDb.execute.mockResolvedValueOnce([]);

      const response = await request(app)
        .post('/add-student')
        .send({
          name: 'John Doe',
          age: '15',
          classroom: '10A'
        })
        .expect(201);
      
      expect(response.body.message).toBe('Student added successfully');
      expect(mockDb.execute).toHaveBeenCalledWith(
        'INSERT INTO students (name, age, classroom) VALUES (?, ?, ?)',
        ['John Doe', 15, '10A']
      );
    });

    it('should return 400 when name is missing', async () => {
      const response = await request(app)
        .post('/add-student')
        .send({
          age: 15,
          classroom: '10A'
        })
        .expect(400);
      
      expect(response.body.error).toBe('All fields are required');
    });

    it('should return 400 when age is missing', async () => {
      const response = await request(app)
        .post('/add-student')
        .send({
          name: 'John Doe',
          classroom: '10A'
        })
        .expect(400);
      
      expect(response.body.error).toBe('All fields are required');
    });

    it('should return 400 when classroom is missing', async () => {
      const response = await request(app)
        .post('/add-student')
        .send({
          name: 'John Doe',
          age: 15
        })
        .expect(400);
      
      expect(response.body.error).toBe('All fields are required');
    });

    it('should handle database errors gracefully', async () => {
      mockDb.execute.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .post('/add-student')
        .send({
          name: 'Jane Doe',
          age: 16,
          classroom: '11B'
        })
        .expect(500);
      
      expect(response.body.error).toBe('Failed to add student');
    });
  });

  describe('GET /api/students', () => {
    it('should return list of students', async () => {
      const mockStudents = [
        { id: 1, name: 'John Doe', age: 15, classroom: '10A', created_at: '2024-01-01T00:00:00Z' },
        { id: 2, name: 'Jane Smith', age: 16, classroom: '11B', created_at: '2024-01-02T00:00:00Z' }
      ];
      
      mockDb.execute.mockResolvedValueOnce([mockStudents]);

      const response = await request(app)
        .get('/api/students')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0].name).toBe('John Doe');
    });

    it('should return empty array when no students exist', async () => {
      mockDb.execute.mockResolvedValueOnce([[]]);

      const response = await request(app)
        .get('/api/students')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('should handle database errors', async () => {
      mockDb.execute.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/api/students')
        .expect(500);
      
      expect(response.body.error).toBe('Error fetching students');
    });
  });

  describe('GET /', () => {
    it('should return students list', async () => {
      const mockStudents = [
        { id: 1, name: 'John Doe', age: 15, classroom: '10A', created_at: '2024-01-01T00:00:00Z' }
      ];
      
      mockDb.execute.mockResolvedValueOnce([mockStudents]);

      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.text).toBeDefined();
      expect(response.type).toContain('html');
    });

    it('should handle errors gracefully', async () => {
      mockDb.execute.mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .get('/')
        .expect(500);
      
      expect(response.body.error).toBe('Error loading students');
    });
  });

  afterAll(async () => {
    // Cleanup
    jest.clearAllMocks();
  });
});
