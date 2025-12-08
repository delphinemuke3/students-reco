require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'students_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Route: Display home page with form and student records
app.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [students] = await connection.query('SELECT * FROM students ORDER BY id DESC');
    connection.release();

    let studentRows = '';
    students.forEach(student => {
      studentRows += `
        <tr>
          <td>${student.id}</td>
          <td>${student.name}</td>
          <td>${student.age}</td>
          <td>${student.classroom}</td>
        </tr>
      `;
    });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Student Records App</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <div class="container">
          <h1>Student Records Management</h1>
          
          <div class="form-section">
            <h2>Add New Student</h2>
            <form method="POST" action="/add-student">
              <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
              </div>
              <div class="form-group">
                <label for="age">Age:</label>
                <input type="number" id="age" name="age" required min="1" max="100">
              </div>
              <div class="form-group">
                <label for="classroom">Classroom:</label>
                <input type="text" id="classroom" name="classroom" required>
              </div>
              <button type="submit">Add Student</button>
            </form>
          </div>

          <div class="records-section">
            <h2>Student Records</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Classroom</th>
                </tr>
              </thead>
              <tbody>
                ${studentRows || '<tr><td colspan="4">No students yet.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading students');
  }
});

// Route: Handle form submission to add a student
app.post('/add-student', async (req, res) => {
  const { name, age, classroom } = req.body;

  if (!name || !age || !classroom) {
    return res.status(400).send('All fields are required');
  }

  try {
    const connection = await pool.getConnection();
    await connection.query('INSERT INTO students (name, age, classroom) VALUES (?, ?, ?)', [name, age, classroom]);
    connection.release();
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding student');
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
