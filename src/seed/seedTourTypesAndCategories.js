// src/seed/seedTourTypesAndCategories.js
require('dotenv').config();
const mongoose = require('mongoose');
const TourType = require('../models/tourType.model');
const PricingCategory = require('../models/pricingCategory.model');
const slugify = require('../utils/slugify');

const tourTypes = [
  { name: 'Pakistan Tour Packages', style: '', order: 1, description: 'General group tours across Pakistan' },
  { name: 'Honeymoon Packages', style: 'style2', order: 2, description: 'Romantic couple getaways' },
  { name: 'Adventure Tours', style: '', order: 3, description: 'Trekking, jeep safaris, and outdoor adventure' },
  { name: 'Group Tours', style: '', order: 4, description: 'Multi-day group itineraries' },
];

const pricingCategories = [
  { name: 'Deluxe', order: 1 },
  { name: 'Executive', order: 2 },
  { name: 'Luxury', order: 3 },
  { name: 'Premium Luxury', order: 4 },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB for seeding...');

  for (const t of tourTypes) {
    const slug = slugify(t.name);
    await TourType.findOneAndUpdate(
      { slug },
      { ...t, slug },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log(`Seeded ${tourTypes.length} tour types`);

  for (const c of pricingCategories) {
    const slug = slugify(c.name);
    await PricingCategory.findOneAndUpdate(
      { slug },
      { ...c, slug },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log(`Seeded ${pricingCategories.length} pricing categories`);

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});