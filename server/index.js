const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded images
const uploadsDir = process.env.UPLOADS_DIR || path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Routes
const guitarsRouter = require('./routes/guitars');
const photosRouter = require('./routes/photos');
const wishlistRouter = require('./routes/wishlist');
const sharingRouter = require('./routes/sharing');

app.use('/api/guitars', guitarsRouter);
app.use('/api/guitars', photosRouter);  // handles POST /:id/photos
app.use('/api/photos', photosRouter);   // handles DELETE /:id, PATCH /:id/cover
app.use('/api/wishlist', wishlistRouter);
app.use('/api', sharingRouter);

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
  );
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Guitar Manager API running on port ${PORT}`));
