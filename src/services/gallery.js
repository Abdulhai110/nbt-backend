// src/services/gallery.service.js
const Gallery = require('../models/gallery.model');
const UploadService = require('./upload');

class GalleryService {

  // ===================== CREATE =====================
  static async createItem(data, file) {
    if (!file) throw new Error('Image is required');

    const result = await UploadService.uploadSingle(file.buffer, 'gallery_image');

    return Gallery.create({
      title:       data.title || '',
      description: data.description || '',
      published:   data.published !== undefined ? data.published === 'true' || data.published === true : true,
      imageUrl:    result.url,
      publicId:    result.publicId,
    });
  }

  // ===================== UPDATE =====================
  static async updateItem(id, data, file) {
    const item = await Gallery.findById(id);
    if (!item) throw new Error('Gallery item not found');

    const update = {
      title:       data.title       ?? item.title,
      description: data.description ?? item.description,
      published:   data.published !== undefined
        ? data.published === 'true' || data.published === true
        : item.published,
    };

    // New image uploaded — replace old one
    if (file) {
      if (item.publicId) await UploadService.deleteImage(item.publicId).catch(() => {});
      const result = await UploadService.uploadSingle(file.buffer, 'gallery_image');
      update.imageUrl = result.url;
      update.publicId = result.publicId;
    }

    Object.assign(item, update);
    await item.save();
    return item;
  }

  // ===================== DELETE =====================
  static async deleteItem(id) {
    const item = await Gallery.findById(id);
    if (!item) throw new Error('Gallery item not found');
    if (item.publicId) await UploadService.deleteImage(item.publicId).catch(() => {});
    await item.deleteOne();
    return { message: 'Deleted successfully' };
  }

  // ===================== GET ALL (admin) =====================
  static async getAllAdmin() {
    return Gallery.find().sort({ createdAt: -1 });
  }

  // ===================== GET PUBLIC (paginated) =====================
  static async getPublic(queryParams) {
    const { page = 1, limit = 12, search = '' } = queryParams;
    const skip = (page - 1) * Number(limit);
    const query = { published: true };
    if (search) query.title = { $regex: search, $options: 'i' };

    const [items, total] = await Promise.all([
      Gallery.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Gallery.countDocuments(query),
    ]);

    return {
      data: items,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    };
  }

  // ===================== GET BY ID =====================
  static async getById(id) {
    const item = await Gallery.findById(id);
    if (!item) throw new Error('Gallery item not found');
    return item;
  }
}

module.exports = GalleryService;