// // src/models/tour.model.js
// const mongoose = require('mongoose');

// const TourSchema = new mongoose.Schema({
//   title: { type: String, required: true, trim: true, maxlength: 200 },
//   price: { type: Number, required: true, min: 0 },
//   description: { type: String, trim: true, maxlength: 5000 },
//   locations: [{ type: String, trim: true }],
//   duration: { type: Number, min: 1 },

//   // ── NEW ──
//   groupSize: { type: Number, min: 1 },
//   difficulty: { 
//     type: String, 
//     enum: ['easy', 'moderate', 'challenging', 'extreme'], 
//     default: 'moderate' 
//   },
//   includes: [{ type: String, trim: true }],  // what's included
//   excludes: [{ type: String, trim: true }],  // what's excluded
//   // ─────────

//   coverImage: { type: String, default: null },
//   coverImagePublicId: { type: String, default: null }, // ← NEW: needed for Cloudinary deletion

//   images: [{
//     url: String,
//     publicId: String,
//     width: Number,
//     height: Number,
//   }],

//   published: { type: Boolean, default: false },
//   owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
// }, { timestamps: true });

// TourSchema.index({ title: 'text', locations: 1 });
// TourSchema.index({ published: 1, price: 1 });

// module.exports = mongoose.model('Tour', TourSchema);































// src/models/tour.model.js
const mongoose = require('mongoose');

const PricingOptionSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'PricingCategory', required: true },
  hotelOptions: { type: String, trim: true },     // e.g. "Snow Land Hotel / Hotel Himalaya"
  price: { type: Number, required: true, min: 0 },
  priceUnit: {
    type: String,
    enum: ['per_person', 'per_couple', 'per_group'],
    default: 'per_couple',
  },
}, { _id: false });

const TourSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },

  // Fallback / "starting from" price — used for sorting & listing cards
  price: { type: Number, required: true, min: 0 },

  // Tiered pricing (Deluxe/Executive/Luxury/Premium Luxury style)
  pricingOptions: [PricingOptionSchema],

  description: { type: String, trim: true, maxlength: 5000 },
  locations: [{ type: String, trim: true }],
  duration: { type: Number, min: 1 },

  // ── Dynamic tour classification (Pakistan Tour Packages, Honeymoon, etc.) ──
  tourType: { type: mongoose.Schema.Types.ObjectId, ref: 'TourType', required: true },

  groupSize: { type: Number, min: 1 },
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'challenging', 'extreme'],
    default: 'moderate',
  },
  includes: [{ type: String, trim: true }],
  excludes: [{ type: String, trim: true }],

  coverImage: { type: String, default: null },
  coverImagePublicId: { type: String, default: null },
  images: [{
    url: String,
    publicId: String,
    width: Number,
    height: Number,
  }],

  published: { type: Boolean, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

TourSchema.index({ title: 'text', locations: 'text' });
TourSchema.index({ published: 1, price: 1 });
TourSchema.index({ tourType: 1 });
TourSchema.index({ 'pricingOptions.category': 1 });

module.exports = mongoose.model('Tour', TourSchema);