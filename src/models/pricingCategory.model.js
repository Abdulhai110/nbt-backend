// src/models/pricingCategory.model.js
const mongoose = require('mongoose');

const PricingCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },      // "Deluxe"
  slug: { type: String, required: true, trim: true, unique: true, lowercase: true }, // "deluxe"
  description: { type: String, trim: true },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

PricingCategorySchema.index({ order: 1 });

module.exports = mongoose.model('PricingCategory', PricingCategorySchema);