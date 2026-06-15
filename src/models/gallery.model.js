// src/models/gallery.model.js
const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema(
  {
    title:       { type: String, trim: true },
    description: { type: String, trim: true },
    imageUrl:    { type: String, required: true },   // Cloudinary secure_url
    publicId:    { type: String, default: null },     // for deletion
    published:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

GallerySchema.index({ published: 1, createdAt: -1 });

module.exports = mongoose.model("Gallery", GallerySchema, "gallery");