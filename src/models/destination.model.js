// src/models/destination.model.js
const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, trim: true, maxlength: 5000 },
  location: { type: String, trim: true },          // City / Region
  country: { type: String, trim: true },
  continent: {
    type: String,
    enum: ['Asia', 'Europe', 'Africa', 'North America', 'South America', 'Oceania', 'Antarctica', ''],
    default: '',
  },
  highlights: [{ type: String, trim: true }],       // bullet points
  bestTimeToVisit: { type: String, trim: true },

  coverImage: { type: String, default: null },       // Cloudinary secure_url
  coverImagePublicId: { type: String, default: null },

  images: [{
    url:      String,
    publicId: String,
    width:    Number,
    height:   Number,
  }],

  published: { type: Boolean, default: true },
}, { timestamps: true });

DestinationSchema.index({ name: 'text', location: 1, country: 1 });
DestinationSchema.index({ published: 1 });

module.exports = mongoose.model('Destination', DestinationSchema);