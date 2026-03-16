const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/auth/login  — find or create user by email
router.post('/login', (req, res) => {
  const { name, email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (!user) {
    if (!name) return res.status(400).json({ error: 'Name is required for new users' });
    const result = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)').run(
      name.trim(), email.toLowerCase().trim()
    );
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  }
  res.json(user);
});

// GET /api/auth/me  — validate stored user id
router.get('/me', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  if (!user) return res.status(401).json({ error: 'User not found' });
  res.json(user);
});

module.exports = router;
