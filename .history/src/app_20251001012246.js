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
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(morgan('dev'));

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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(errorHandler);

module.exports = app;
