const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/guitars
router.get('/', (req, res) => {
  const { category, status, search } = req.query;
  let query = `
    SELECT g.*, p.filename as cover_photo
    FROM guitars g
    LEFT JOIN photos p ON p.guitar_id = g.id AND p.is_cover = 1
    WHERE 1=1
  `;
  const params = [];
  if (category && category !== 'all') {
    query += ' AND g.category = ?';
    params.push(category);
  }
  if (status && status !== 'all') {
    query += ' AND g.status = ?';
    params.push(status);
  }
  if (search) {
    query += ' AND (g.make LIKE ? OR g.model LIKE ? OR g.serial_number LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s, s);
  }
  query += ' ORDER BY g.created_at DESC';
  const guitars = db.prepare(query).all(...params);
  res.json(guitars);
});

// GET /api/guitars/summary
router.get('/summary', (req, res) => {
  const total = db.prepare("SELECT COUNT(*) as count FROM guitars WHERE status != 'sold'").get();
  const sold = db.prepare("SELECT COUNT(*) as count FROM guitars WHERE status = 'sold'").get();
  const totalBought = db.prepare("SELECT SUM(price_bought) as total FROM guitars").get();
  const totalSold = db.prepare("SELECT SUM(price_sold) as total FROM guitars WHERE status = 'sold'").get();
  const byCategory = db.prepare(`
    SELECT category, COUNT(*) as count FROM guitars GROUP BY category
  `).all();
  const recent = db.prepare(`
    SELECT g.*, p.filename as cover_photo
    FROM guitars g
    LEFT JOIN photos p ON p.guitar_id = g.id AND p.is_cover = 1
    ORDER BY g.created_at DESC LIMIT 5
  `).all();
  res.json({ total: total.count, sold: sold.count, totalBought: totalBought.total || 0, totalSold: totalSold.total || 0, byCategory, recent });
});

// GET /api/guitars/:id
router.get('/:id', (req, res) => {
  const guitar = db.prepare('SELECT * FROM guitars WHERE id = ?').get(req.params.id);
  if (!guitar) return res.status(404).json({ error: 'Not found' });
  const photos = db.prepare('SELECT * FROM photos WHERE guitar_id = ? ORDER BY is_cover DESC, created_at ASC').all(req.params.id);
  res.json({ ...guitar, photos });
});

// POST /api/guitars
router.post('/', (req, res) => {
  const { make, model, year, serial_number, category, condition, status, price_bought, year_bought, price_sold, comments } = req.body;
  const result = db.prepare(`
    INSERT INTO guitars (make, model, year, serial_number, category, condition, status, price_bought, year_bought, price_sold, comments)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(make, model, year || null, serial_number || null, category || 'electric', condition || 'Good', status || 'in_stock',
         price_bought || null, year_bought || null, price_sold || null, comments || null);
  const guitar = db.prepare('SELECT * FROM guitars WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(guitar);
});

// PUT /api/guitars/:id
router.put('/:id', (req, res) => {
  const { make, model, year, serial_number, category, condition, status, price_bought, year_bought, price_sold, comments } = req.body;
  db.prepare(`
    UPDATE guitars SET make=?, model=?, year=?, serial_number=?, category=?, condition=?, status=?,
    price_bought=?, year_bought=?, price_sold=?, comments=?
    WHERE id=?
  `).run(make, model, year || null, serial_number || null, category, condition, status,
         price_bought || null, year_bought || null, price_sold || null, comments || null, req.params.id);
  const guitar = db.prepare('SELECT * FROM guitars WHERE id = ?').get(req.params.id);
  res.json(guitar);
});

// DELETE /api/guitars/:id
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM guitars WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
