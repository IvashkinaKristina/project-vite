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

  db.run(`
    CREATE TABLE IF NOT EXISTS progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      lecture_id INTEGER NOT NULL,
      question_time REAL NOT NULL,
      answer TEXT,
      correct BOOLEAN,
      hint_used BOOLEAN DEFAULT 0,
      attempts INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES users(id),
      FOREIGN KEY (lecture_id) REFERENCES lectures(id)
    )
  `);
});

// Регистрация
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

// Вход
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

// Middleware аутентификации
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

// Создание лекции
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

// Получение списка лекций
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

// Получение одной лекции
app.get('/api/lectures/:id', authenticate, (req, res) => {
  db.get('SELECT * FROM lectures WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Лекция не найдена' });
    res.json({ ...row, questions: JSON.parse(row.questions) });
  });
});

// Редактирование лекции (PUT)
app.put('/api/lectures/:id', authenticate, upload.single('video'), (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ error: 'Доступ только преподавателям' });
  }
  const lectureId = req.params.id;
  const { title, questions } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Название обязательно' });
  }
  let parsedQuestions;
  try {
    parsedQuestions = JSON.parse(questions);
  } catch (e) {
    return res.status(400).json({ error: 'Некорректный формат вопросов' });
  }
  db.get('SELECT * FROM lectures WHERE id = ?', [lectureId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Лекция не найдена' });
    if (row.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'Нельзя редактировать чужую лекцию' });
    }
    let videoUrl = row.video_url;
    if (req.file) {
      const oldPath = path.join(__dirname, row.video_url);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      videoUrl = `/uploads/${req.file.filename}`;
    }
    const stmt = db.prepare('UPDATE lectures SET title = ?, video_url = ?, questions = ? WHERE id = ?');
    stmt.run(title, videoUrl, JSON.stringify(parsedQuestions), lectureId, function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Лекция обновлена' });
    });
    stmt.finalize();
  });
});

// Сохранение ответа студента
app.post('/api/progress', authenticate, (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Только студенты могут сохранять ответы' });
  }
  const { lecture_id, question_time, answer, correct, hint_used, attempts } = req.body;
  const stmt = db.prepare(`
    INSERT INTO progress (student_id, lecture_id, question_time, answer, correct, hint_used, attempts)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(req.user.id, lecture_id, question_time, answer, correct ? 1 : 0, hint_used ? 1 : 0, attempts, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
  stmt.finalize();
});

// Получение статистики по лекции для преподавателя
app.get('/api/statistics/:lectureId', authenticate, (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ error: 'Доступ только преподавателям' });
  }
  const lectureId = req.params.lectureId;
  db.get('SELECT questions FROM lectures WHERE id = ?', [lectureId], (err, lecture) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!lecture) return res.status(404).json({ error: 'Лекция не найдена' });
    const questions = JSON.parse(lecture.questions);
    db.all(`
      SELECT DISTINCT u.id, u.name, p.question_time, p.correct, p.hint_used
      FROM progress p
      JOIN users u ON u.id = p.student_id
      WHERE p.lecture_id = ?
      ORDER BY u.id, p.question_time
    `, [lectureId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      const studentsMap = new Map();
      rows.forEach(row => {
        if (!studentsMap.has(row.id)) {
          studentsMap.set(row.id, { id: row.id, name: row.name, answers: {} });
        }
        const student = studentsMap.get(row.id);
        student.answers[row.question_time] = { correct: row.correct === 1, hintUsed: row.hint_used === 1 };
      });
      const result = {
        questions: questions.map(q => ({ time: q.time, text: q.text })),
        students: Array.from(studentsMap.values()).map(s => ({
          id: s.id,
          name: s.name,
          answers: questions.map(q => {
            const ans = s.answers[q.time];
            return {
              correct: ans ? ans.correct : false,
              hintUsed: ans ? ans.hintUsed : false,
              answered: !!ans
            };
          })
        }))
      };
      res.json(result);
    });
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});