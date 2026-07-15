// src/services/pricingCategory.service.js
const PricingCategory = require('../models/pricingCategory.model');
const Tour = require('../models/tour.model');
const slugify = require('../utils/slugify');

class PricingCategoryService {
  static async create(data) {
    const slug = data.slug ? slugify(data.slug) : slugify(data.name);
    const exists = await PricingCategory.findOne({ slug });
    if (exists) throw new Error('A pricing category with this slug already exists');
    return PricingCategory.create({ ...data, slug });
  }

  static async update(id, data) {
    const category = await PricingCategory.findById(id);
    if (!category) throw new Error('Pricing category not found');

    if (data.slug || data.name) {
      const newSlug = slugify(data.slug || data.name);
      if (newSlug !== category.slug) {
        const clash = await PricingCategory.findOne({ slug: newSlug, _id: { $ne: id } });
        if (clash) throw new Error('A pricing category with this slug already exists');
        data.slug = newSlug;
      }
    }

    Object.assign(category, data);
    await category.save();
    return category;
  }

  static async remove(id) {
    const inUse = await Tour.exists({ 'pricingOptions.category': id });
    if (inUse) throw new Error('Cannot delete: one or more tours use this pricing category');
    const category = await PricingCategory.findByIdAndDelete(id);
    if (!category) throw new Error('Pricing category not found');
    return { message: 'Pricing category deleted successfully' };
  }

  static async getAll({ activeOnly = false } = {}) {
    const query = activeOnly ? { active: true } : {};
    return PricingCategory.find(query).sort({ order: 1, name: 1 });
  }

  static async getOne(id) {
    const category = await PricingCategory.findById(id);
    if (!category) throw new Error('Pricing category not found');
    return category;
  }
}

module.exports = PricingCategoryService;