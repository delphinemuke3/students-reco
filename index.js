const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'students_db'
};

let db;

// Initialize database connection
async function initDB() {
  try {
    db = await mysql.createConnection(dbConfig);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        age INT NOT NULL,
        classroom VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    // eslint-disable-next-line no-console
    console.log('Database connected and students table created');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

// Routes
app.get('/', async (req, res) => {
  try {
    const [students] = await db.execute('SELECT * FROM students ORDER BY created_at DESC');
    res.render('index', { students });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching students:', error);
    res.status(500).send('Error loading students');
  }
});

// POST new student
app.post('/add-student', async (req, res) => {
  const { name, age, classroom } = req.body;
  
  if (!name || !age || !classroom) {
    return res.status(400).send('All fields are required');
  }

  try {
    await db.execute(
      'INSERT INTO students (name, age, classroom) VALUES (?, ?, ?)',
      [name, age, classroom]
    );
    res.redirect('/');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating student:', error);
    res.status(500).send('Failed to add student');
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  await initDB();
  
  // Set view engine
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
