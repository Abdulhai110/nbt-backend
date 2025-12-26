const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true }, // Only path or URL
    title: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", GallerySchema, "gallery");
