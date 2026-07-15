// src/models/tourType.model.js
const mongoose = require('mongoose');

const TourTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },      // "Honeymoon Packages"
  slug: { type: String, required: true, trim: true, unique: true, lowercase: true }, // "honeymoon-packages"
  description: { type: String, trim: true },
  icon: { type: String, default: null },
  style: { type: String, default: '' }, // FE button style hook e.g. "style2"
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

TourTypeSchema.index({ order: 1 });

module.exports = mongoose.model('TourType', TourTypeSchema);