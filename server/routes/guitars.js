const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/guitars
router.get('/', (req, res) => {
  const { category, status, search } = req.query;
  const userId = req.userId;
  let query = `
    SELECT g.*, p.filename as cover_photo
    FROM guitars g
    LEFT JOIN photos p ON p.guitar_id = g.id AND p.is_cover = 1
    WHERE g.user_id = ?
  `;
  const params = [userId];
  if (category && category !== 'all') { query += ' AND g.category = ?'; params.push(category); }
  if (status && status !== 'all') { query += ' AND g.status = ?'; params.push(status); }
  if (search) {
    query += ' AND (g.make LIKE ? OR g.model LIKE ? OR g.serial_number LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s, s);
  }
  query += ' ORDER BY g.created_at DESC';
  res.json(db.prepare(query).all(...params));
});

// GET /api/guitars/summary
router.get('/summary', (req, res) => {
  const uid = req.userId;
  const total = db.prepare("SELECT COUNT(*) as count FROM guitars WHERE user_id=? AND status != 'sold'").get(uid);
  const sold = db.prepare("SELECT COUNT(*) as count FROM guitars WHERE user_id=? AND status = 'sold'").get(uid);
  const totalBought = db.prepare("SELECT SUM(price_bought) as total FROM guitars WHERE user_id=?").get(uid);
  const totalSold = db.prepare("SELECT SUM(price_sold) as total FROM guitars WHERE user_id=? AND status = 'sold'").get(uid);
  const byCategory = db.prepare(`SELECT category, COUNT(*) as count FROM guitars WHERE user_id=? GROUP BY category`).all(uid);
  const recent = db.prepare(`
    SELECT g.*, p.filename as cover_photo FROM guitars g
    LEFT JOIN photos p ON p.guitar_id = g.id AND p.is_cover = 1
    WHERE g.user_id=? ORDER BY g.created_at DESC LIMIT 5
  `).all(uid);
  res.json({ total: total.count, sold: sold.count, totalBought: totalBought.total || 0, totalSold: totalSold.total || 0, byCategory, recent });
});

// GET /api/guitars/:id
router.get('/:id', (req, res) => {
  const guitar = db.prepare('SELECT * FROM guitars WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!guitar) return res.status(404).json({ error: 'Not found' });
  const photos = db.prepare('SELECT * FROM photos WHERE guitar_id = ? ORDER BY is_cover DESC, created_at ASC').all(req.params.id);
  res.json({ ...guitar, photos });
});

// POST /api/guitars
router.post('/', (req, res) => {
  const { make, model, year, serial_number, category, condition, status, price_bought, year_bought, price_sold, comments } = req.body;
  const result = db.prepare(`
    INSERT INTO guitars (user_id, make, model, year, serial_number, category, condition, status, price_bought, year_bought, price_sold, comments)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(req.userId, make, model, year || null, serial_number || null, category || 'electric', condition || 'Good',
         status || 'in_stock', price_bought || null, year_bought || null, price_sold || null, comments || null);
  res.status(201).json(db.prepare('SELECT * FROM guitars WHERE id = ?').get(result.lastInsertRowid));
});

// PUT /api/guitars/:id
router.put('/:id', (req, res) => {
  const { make, model, year, serial_number, category, condition, status, price_bought, year_bought, price_sold, comments } = req.body;
  db.prepare(`
    UPDATE guitars SET make=?, model=?, year=?, serial_number=?, category=?, condition=?, status=?,
    price_bought=?, year_bought=?, price_sold=?, comments=? WHERE id=? AND user_id=?
  `).run(make, model, year || null, serial_number || null, category, condition, status,
         price_bought || null, year_bought || null, price_sold || null, comments || null,
         req.params.id, req.userId);
  res.json(db.prepare('SELECT * FROM guitars WHERE id = ?').get(req.params.id));
});

// DELETE /api/guitars/:id
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM guitars WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
  res.json({ ok: true });
});

module.exports = router;
