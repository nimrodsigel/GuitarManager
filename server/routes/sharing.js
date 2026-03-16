const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../db');

// Strips price fields from a guitar object
function publicGuitar(g) {
  const { price_bought, price_sold, year_bought, ...pub } = g;
  return pub;
}

// Middleware: validate token for /shared/:token routes
function validateToken(req, res, next) {
  const token = db.prepare('SELECT * FROM share_tokens WHERE token = ? AND active = 1').get(req.params.token);
  if (!token) return res.status(404).json({ error: 'Invalid or revoked link' });
  req.shareToken = token;
  next();
}

// ─── Owner: manage share links ───────────────────────────────────────────────

// GET /api/shares
router.get('/shares', (req, res) => {
  res.json(db.prepare('SELECT * FROM share_tokens WHERE user_id = ? ORDER BY created_at DESC').all(req.userId));
});

// POST /api/shares
router.post('/shares', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const token = crypto.randomUUID();
  const result = db.prepare('INSERT INTO share_tokens (user_id, token, name) VALUES (?, ?, ?)').run(req.userId, token, name);
  res.status(201).json(db.prepare('SELECT * FROM share_tokens WHERE id = ?').get(result.lastInsertRowid));
});

// PATCH /api/shares/:id/revoke
router.patch('/shares/:id/revoke', (req, res) => {
  db.prepare('UPDATE share_tokens SET active = 0 WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
  res.json({ ok: true });
});

// ─── Owner: offers inbox ──────────────────────────────────────────────────────

// GET /api/offers
router.get('/offers', (req, res) => {
  const { status } = req.query;
  let query = `
    SELECT o.*, g.make, g.model, g.year, g.category,
           p.filename as cover_photo, s.name as share_name
    FROM offers o
    JOIN guitars g ON g.id = o.guitar_id
    LEFT JOIN photos p ON p.guitar_id = g.id AND p.is_cover = 1
    JOIN share_tokens s ON s.id = o.token_id
    WHERE g.user_id = ?
  `;
  const params = [req.userId];
  if (status && status !== 'all') { query += ' AND o.status = ?'; params.push(status); }
  query += ' ORDER BY o.created_at DESC';
  res.json(db.prepare(query).all(...params));
});

// GET /api/offers/count  — pending count for badge
router.get('/offers/count', (req, res) => {
  const row = db.prepare(`
    SELECT COUNT(*) as count FROM offers o
    JOIN guitars g ON g.id = o.guitar_id
    WHERE g.user_id = ? AND o.status = 'pending'
  `).get(req.userId);
  res.json({ count: row.count });
});

// PATCH /api/offers/:id
router.patch('/offers/:id', (req, res) => {
  const { status } = req.body;
  if (!['pending', 'accepted', 'declined'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  db.prepare('UPDATE offers SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ ok: true });
});

// ─── Public: shared collection view ──────────────────────────────────────────

// GET /api/shared/:token  — validate + list in-stock guitars (no prices)
router.get('/shared/:token', validateToken, (req, res) => {
  const { category } = req.query;
  const ownerId = req.shareToken.user_id;
  let query = `
    SELECT g.id, g.make, g.model, g.year, g.serial_number, g.category,
           g.condition, g.status, g.comments, g.created_at,
           p.filename as cover_photo
    FROM guitars g
    LEFT JOIN photos p ON p.guitar_id = g.id AND p.is_cover = 1
    WHERE g.status = 'in_stock' AND g.user_id = ?
  `;
  const params = [ownerId];
  if (category && category !== 'all') { query += ' AND g.category = ?'; params.push(category); }
  query += ' ORDER BY g.created_at DESC';
  res.json({ share: { name: req.shareToken.name }, guitars: db.prepare(query).all(...params) });
});

// GET /api/shared/:token/guitars/:id
router.get('/shared/:token/guitars/:id', validateToken, (req, res) => {
  const guitar = db.prepare(`
    SELECT id, make, model, year, serial_number, category, condition, status, comments, created_at
    FROM guitars WHERE id = ? AND status = 'in_stock' AND user_id = ?
  `).get(req.params.id, req.shareToken.user_id);
  if (!guitar) return res.status(404).json({ error: 'Not found' });
  const photos = db.prepare('SELECT * FROM photos WHERE guitar_id = ? ORDER BY is_cover DESC, created_at ASC').all(req.params.id);
  res.json({ ...guitar, photos });
});

// POST /api/shared/:token/offers
router.post('/shared/:token/offers', validateToken, (req, res) => {
  const { guitar_id, guest_name, guest_contact, offer_type, message } = req.body;
  if (!guitar_id || !guest_name || !guest_contact || !offer_type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!['buy', 'trade'].includes(offer_type)) {
    return res.status(400).json({ error: 'offer_type must be buy or trade' });
  }
  // Make sure guitar exists and is in stock
  const guitar = db.prepare("SELECT id FROM guitars WHERE id = ? AND status = 'in_stock'").get(guitar_id);
  if (!guitar) return res.status(404).json({ error: 'Guitar not found or not available' });

  const result = db.prepare(`
    INSERT INTO offers (token_id, guitar_id, guest_name, guest_contact, offer_type, message)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(req.shareToken.id, guitar_id, guest_name, guest_contact, offer_type, message || null);
  res.status(201).json({ id: result.lastInsertRowid, ok: true });
});

module.exports = router;
