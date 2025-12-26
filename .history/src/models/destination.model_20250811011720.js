const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: String,
  location: String, // City/Region
  coverImage: String,
  images: [String],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // optional
  published: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Destination', DestinationSchema);
