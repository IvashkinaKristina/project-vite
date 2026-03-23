const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'my-secret-key-change-in-production';

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error(err.message);
  console.log('Connected to SQLite database.');
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      name TEXT,
      role TEXT CHECK(role IN ('student', 'teacher')),
      group_name TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS lectures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      video_url TEXT,
      teacher_id INTEGER,
      teacher_name TEXT,
      questions TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

app.post('/api/register', async (req, res) => {
  const { email, password, name, role, group_name } = req.body;
  if (!email || !password || !name || !role) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (email, password, name, role, group_name) VALUES (?, ?, ?, ?, ?)');
    stmt.run(email, hashedPassword, name, role, group_name || null, function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Email уже зарегистрирован' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, message: 'Регистрация успешна' });
    });
    stmt.finalize();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Неверный email или пароль' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Неверный email или пароль' });
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, group_name: user.group_name } });
  });
});

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Нет токена' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Неверный токен' });
  }
};

app.post('/api/lectures', authenticate, upload.single('video'), (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ error: 'Доступ только преподавателям' });
  }
  const { title, questions } = req.body;
  if (!title || !req.file) {
    return res.status(400).json({ error: 'Название и видео обязательны' });
  }
  let parsedQuestions;
  try {
    parsedQuestions = JSON.parse(questions);
  } catch (e) {
    return res.status(400).json({ error: 'Некорректный формат вопросов' });
  }
  const videoUrl = `/uploads/${req.file.filename}`;
  const stmt = db.prepare(`
    INSERT INTO lectures (title, video_url, teacher_id, teacher_name, questions)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(title, videoUrl, req.user.id, req.user.name, JSON.stringify(parsedQuestions), function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: 'Лекция сохранена' });
  });
  stmt.finalize();
});

app.get('/api/lectures', authenticate, (req, res) => {
  let sql = 'SELECT * FROM lectures';
  let params = [];
  if (req.user.role === 'teacher') {
    sql += ' WHERE teacher_id = ?';
    params.push(req.user.id);
  }
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const lectures = rows.map(row => ({
      ...row,
      questions: JSON.parse(row.questions)
    }));
    res.json(lectures);
  });
});

app.get('/api/lectures/:id', authenticate, (req, res) => {
  db.get('SELECT * FROM lectures WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Лекция не найдена' });
    res.json({ ...row, questions: JSON.parse(row.questions) });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});