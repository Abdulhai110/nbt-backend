const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const path = require('path');

const errorHandler = require('./middlewares/error.middleware.js');

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to NBT API' });
});

// Public routes
app.use('/api/public/tours',        require('./routes/public/tour.routes'));
app.use('/api/public/destinations', require('./routes/public/destination.routes'));
app.use('/api/public/gallery',      require('./routes/public/gallery.routes'));
app.use('/api/public/auth',         require('./routes/auth.routes'));
app.use('/api/public/contact',      require('./routes/public/contact.routes'));

// Admin routes
app.use('/api/admin/tours',         require('./routes/admin/tour.routes'));
app.use('/api/admin/destinations',  require('./routes/admin/destination.routes'));
app.use('/api/admin/gallery',       require('./routes/admin/gallery.routes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler — must be last
app.use(errorHandler);

module.exports = app;