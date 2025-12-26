// src/app.js
const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const path = require("path");

const errorHandler = require('./middlewares/error.middleware.js');

const app = express();

// Security & parsing
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));

app.set('trust proxy', true);

const FRONTEND_ORIGINS = process.env.ALLOWED_ORIGINS || '*';

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (FRONTEND_ORIGINS === '*') return cb(null, true);
    const allowed = FRONTEND_ORIGINS.split(',').map(s => s.trim());
    return allowed.includes(origin) ? cb(null, true) : cb(new Error('Not allowed by CORS'));
  }
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', FRONTEND_ORIGINS === '*' ? '*' : FRONTEND_ORIGINS);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
}));

// simple rate limiter for all requests (tweak for production)
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

// Public Routes
app.use('/api/public/tours', require('./routes/public/tour.routes'));
app.use('/api/public/destinations', require('./routes/public/destination.routes'));
app.use("/api/public/gallery", require("./routes/public/gallery.routes"));
app.use("/api/public/auth", require("./routes/auth.routes"));

// Admin routes
app.use('/api/admin/tours', require('./routes/admin/tour.routes'));
app.use('/api/admin/destinations', require('./routes/admin/destination.routes'));
app.use("/api/admin/gallery",require("./routes/admin/gallery.routes") );

// mixed (public + protected)

// error handler - must be last

// Serve uploaded images

app.use(errorHandler);

module.exports = app;
