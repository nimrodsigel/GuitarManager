const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM wishlist WHERE user_id = ? ORDER BY created_at DESC').all(req.userId));
});

router.post('/', (req, res) => {
  const { make, model, year_from, year_to, max_price, category, notes } = req.body;
  const result = db.prepare(`
    INSERT INTO wishlist (user_id, make, model, year_from, year_to, max_price, category, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(req.userId, make || null, model || null, year_from || null, year_to || null, max_price || null, category || 'electric', notes || null);
  res.status(201).json(db.prepare('SELECT * FROM wishlist WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/:id', (req, res) => {
  const { make, model, year_from, year_to, max_price, category, notes } = req.body;
  db.prepare(`
    UPDATE wishlist SET make=?, model=?, year_from=?, year_to=?, max_price=?, category=?, notes=? WHERE id=? AND user_id=?
  `).run(make || null, model || null, year_from || null, year_to || null, max_price || null, category || 'electric', notes || null, req.params.id, req.userId);
  res.json(db.prepare('SELECT * FROM wishlist WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM wishlist WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
  res.json({ ok: true });
});

module.exports = router;
