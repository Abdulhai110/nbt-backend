// src/models/tour.model.js
const mongoose = require('mongoose');
const TourSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  price: { type: Number, default: 0 },
  description: String,
  locations: [String],
  coverImage: { type: String, default: null },
  images: [String],
  published: { type: Boolean, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // optional
}, { timestamps: true });

module.exports = mongoose.model('Tours', TourSchema);
