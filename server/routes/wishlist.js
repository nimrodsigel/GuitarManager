const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const items = db.prepare('SELECT * FROM wishlist ORDER BY created_at DESC').all();
  res.json(items);
});

router.post('/', (req, res) => {
  const { make, model, year_from, year_to, max_price, category, notes } = req.body;
  const result = db.prepare(`
    INSERT INTO wishlist (make, model, year_from, year_to, max_price, category, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(make || null, model || null, year_from || null, year_to || null, max_price || null, category || 'electric', notes || null);
  res.status(201).json(db.prepare('SELECT * FROM wishlist WHERE id = ?').get(result.lastInsertRowid));
});

router.put('/:id', (req, res) => {
  const { make, model, year_from, year_to, max_price, category, notes } = req.body;
  db.prepare(`
    UPDATE wishlist SET make=?, model=?, year_from=?, year_to=?, max_price=?, category=?, notes=? WHERE id=?
  `).run(make || null, model || null, year_from || null, year_to || null, max_price || null, category || 'electric', notes || null, req.params.id);
  res.json(db.prepare('SELECT * FROM wishlist WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM wishlist WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
