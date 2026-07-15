// src/services/tourType.service.js
const TourType = require('../models/tourType.model');
const Tour = require('../models/tour.model');
const slugify = require('../utils/slugify');

class TourTypeService {
  static async create(data) {
    const slug = data.slug ? slugify(data.slug) : slugify(data.name);
    const exists = await TourType.findOne({ slug });
    if (exists) throw new Error('A tour type with this slug already exists');
    return TourType.create({ ...data, slug });
  }

  static async update(id, data) {
    const tourType = await TourType.findById(id);
    if (!tourType) throw new Error('Tour type not found');

    if (data.slug || data.name) {
      const newSlug = slugify(data.slug || data.name);
      if (newSlug !== tourType.slug) {
        const clash = await TourType.findOne({ slug: newSlug, _id: { $ne: id } });
        if (clash) throw new Error('A tour type with this slug already exists');
        data.slug = newSlug;
      }
    }

    Object.assign(tourType, data);
    await tourType.save();
    return tourType;
  }

  static async remove(id) {
    const inUse = await Tour.exists({ tourType: id });
    if (inUse) throw new Error('Cannot delete: one or more tours use this tour type');
    const tourType = await TourType.findByIdAndDelete(id);
    if (!tourType) throw new Error('Tour type not found');
    return { message: 'Tour type deleted successfully' };
  }

  static async getAll({ activeOnly = false } = {}) {
    const query = activeOnly ? { active: true } : {};
    return TourType.find(query).sort({ order: 1, name: 1 });
  }

  static async getOne(id) {
    const tourType = await TourType.findById(id);
    if (!tourType) throw new Error('Tour type not found');
    return tourType;
  }
}

module.exports = TourTypeService;