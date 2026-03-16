const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded images
const uploadsDir = process.env.UPLOADS_DIR || path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Routes
const authRouter = require('./routes/auth');
const guitarsRouter = require('./routes/guitars');
const photosRouter = require('./routes/photos');
const wishlistRouter = require('./routes/wishlist');
const sharingRouter = require('./routes/sharing');

// Auth routes (public)
app.use('/api/auth', authRouter);

// Middleware: require authenticated user for all /api routes below
function requireUser(req, res, next) {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  if (!user) return res.status(401).json({ error: 'User not found' });
  req.userId = user.id;
  next();
}

app.use('/api/guitars', requireUser, guitarsRouter);
app.use('/api/guitars', requireUser, photosRouter);  // handles POST /:id/photos
app.use('/api/photos', requireUser, photosRouter);   // handles DELETE /:id, PATCH /:id/cover
app.use('/api/wishlist', requireUser, wishlistRouter);
// Sharing: public /api/shared/:token routes skip auth; owner routes require auth
app.use('/api', (req, res, next) => {
  if (req.path.startsWith('/shared/')) return next();
  requireUser(req, res, next);
}, sharingRouter);

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
  );
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Guitar Manager API running on port ${PORT}`));
