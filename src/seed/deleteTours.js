// src/seed/deleteAllTours.js
require('dotenv').config();
const mongoose = require('mongoose');
const Tour = require('../models/tour.model');
const UploadService = require('../services/upload');

async function deleteAllTours() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB...');

  const tours = await Tour.find();
  console.log(`Found ${tours.length} tour(s) to delete.`);

  for (const tour of tours) {
    // Clean up Cloudinary images too, so you don't leave orphaned files
    if (tour.coverImagePublicId) {
      await UploadService.deleteImage(tour.coverImagePublicId).catch(() => {});
    }
    if (tour.images?.length) {
      const publicIds = tour.images.map((img) => img.publicId).filter(Boolean);
      await UploadService.deleteMultipleImages(publicIds).catch(() => {});
    }
  }

  const result = await Tour.deleteMany({});
  console.log(`Deleted ${result.deletedCount} tour(s).`);

  await mongoose.disconnect();
  console.log('Done.');
}

deleteAllTours().catch((err) => {
  console.error(err);
  process.exit(1);
});