require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'students_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

// Initialize database connection
async function initDB() {
  try {
    pool = mysql.createPool(dbConfig);
    const connection = await pool.getConnection();
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        age INT NOT NULL,
        classroom VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    connection.release();
    console.log('Database connected and students table created');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

// Routes
app.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [students] = await connection.execute('SELECT * FROM students ORDER BY created_at DESC');
    connection.release();
    
    res.render('index', { students });
  } catch (error) {
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
    const connection = await pool.getConnection();
    await connection.execute(
      'INSERT INTO students (name, age, classroom) VALUES (?, ?, ?)',
      [name, age, classroom]
    );
    connection.release();
    
    res.redirect('/');
  } catch (error) {
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
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
