// src/models/tour.model.js
const mongoose = require('mongoose');

const TourSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, trim: true, maxlength: 5000 },
  locations: [{ type: String, trim: true }],
  duration: { type: Number, min: 1 },

  // ── NEW ──
  groupSize: { type: Number, min: 1 },
  difficulty: { 
    type: String, 
    enum: ['easy', 'moderate', 'challenging', 'extreme'], 
    default: 'moderate' 
  },
  includes: [{ type: String, trim: true }],  // what's included
  excludes: [{ type: String, trim: true }],  // what's excluded
  // ─────────

  coverImage: { type: String, default: null },
  coverImagePublicId: { type: String, default: null }, // ← NEW: needed for Cloudinary deletion

  images: [{
    url: String,
    publicId: String,
    width: Number,
    height: Number,
  }],

  published: { type: Boolean, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

TourSchema.index({ title: 'text', locations: 1 });
TourSchema.index({ published: 1, price: 1 });

module.exports = mongoose.model('Tour', TourSchema);