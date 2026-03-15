const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');

const uploadsDir = process.env.UPLOADS_DIR || path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

// POST /api/guitars/:id/photos
router.post('/:id/photos', upload.array('photos', 20), (req, res) => {
  const guitarId = req.params.id;
  const hasExisting = db.prepare('SELECT COUNT(*) as c FROM photos WHERE guitar_id = ?').get(guitarId).c > 0;
  const results = [];
  req.files.forEach((file, idx) => {
    const isCover = !hasExisting && idx === 0 ? 1 : 0;
    const result = db.prepare('INSERT INTO photos (guitar_id, filename, is_cover) VALUES (?, ?, ?)').run(guitarId, file.filename, isCover);
    results.push({ id: result.lastInsertRowid, filename: file.filename, is_cover: isCover });
  });
  res.status(201).json(results);
});

// DELETE /api/photos/:id
router.delete('/:id', (req, res) => {
  const photo = db.prepare('SELECT * FROM photos WHERE id = ?').get(req.params.id);
  if (!photo) return res.status(404).json({ error: 'Not found' });
  const filepath = path.join(uploadsDir, photo.filename);
  if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
  db.prepare('DELETE FROM photos WHERE id = ?').run(req.params.id);
  // If deleted photo was cover, assign new cover
  if (photo.is_cover) {
    const next = db.prepare('SELECT id FROM photos WHERE guitar_id = ? LIMIT 1').get(photo.guitar_id);
    if (next) db.prepare('UPDATE photos SET is_cover = 1 WHERE id = ?').run(next.id);
  }
  res.json({ ok: true });
});

// PATCH /api/photos/:id/cover
router.patch('/:id/cover', (req, res) => {
  const photo = db.prepare('SELECT * FROM photos WHERE id = ?').get(req.params.id);
  if (!photo) return res.status(404).json({ error: 'Not found' });
  db.prepare('UPDATE photos SET is_cover = 0 WHERE guitar_id = ?').run(photo.guitar_id);
  db.prepare('UPDATE photos SET is_cover = 1 WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
