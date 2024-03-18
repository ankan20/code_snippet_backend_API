const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;

// MySQL connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Route for form submission
app.post('/submit', (req, res) => {
  const { username, language, stdin, sourceCode } = req.body;

  const sql = 'INSERT INTO code_snippets (username, language, stdin, source_code) VALUES (?, ?, ?, ?)';
  db.query(sql, [username, language, stdin, sourceCode], (err, result) => {
    if (err) {
      console.error('Error submitting code snippet:', err);
      res.status(500).json({ error: 'Error submitting code snippet' });
    } else {
      res.status(201).json({ message: 'Code snippet submitted successfully' });
    }
  });
});

// Route to fetch all submitted code snippets
app.get('/snippets', (req, res) => {
  const sql = 'SELECT * FROM code_snippets';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching code snippets:', err);
      res.status(500).json({ error: 'Error fetching code snippets' });
    } else {
      res.json(results);
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
