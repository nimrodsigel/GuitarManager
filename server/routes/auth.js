const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');

// Add password_hash column if missing (migration)
try { db.exec(`ALTER TABLE users ADD COLUMN password_hash TEXT`); } catch(_) {}

const SALT_ROUNDS = 10;

// POST /api/auth/register  — create new account
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (existing) return res.status(409).json({ error: 'Email already registered. Please sign in.' });

  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const result = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)').run(
    name.trim(), email.toLowerCase().trim(), hash
  );
  const user = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(user);
});

// POST /api/auth/login  — sign in with email + password
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  // Legacy users (no password set) — require them to reset via register flow
  if (!user.password_hash) return res.status(401).json({ error: 'Please create a new account with a password.' });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

  const { password_hash, ...safeUser } = user;
  res.json(safeUser);
});

// GET /api/auth/me  — validate stored user id
router.get('/me', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });
  const user = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?').get(userId);
  if (!user) return res.status(401).json({ error: 'User not found' });
  res.json(user);
});

module.exports = router;
