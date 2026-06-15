// src/services/destination.service.js
const Destination = require('../models/destination.model');
const UploadService = require('./upload');

function parseJsonField(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return []; }
  }
  return [];
}

function sanitizeData(data) {
  const d = { ...data };
  // Parse JSON-stringified array fields (come as strings from FormData)
  ['highlights'].forEach(key => {
    if (key in d) d[key] = parseJsonField(d[key]);
  });
  // Remove control flags from the data object before saving
  delete d.removeCoverImage;
  delete d.removeImages;
  return d;
}

class DestinationService {

  // ===================== CREATE =====================
  static async createDestination(data, files) {
    const clean = sanitizeData(data);
    const uploadData = {};

    if (files?.coverImage?.[0]) {
      const result = await UploadService.uploadSingle(
        files.coverImage[0].buffer,
        'destination_cover'
      );
      uploadData.coverImage = result.url;
      uploadData.coverImagePublicId = result.publicId;
    }

    if (files?.images?.length) {
      uploadData.images = await UploadService.uploadMultiple(
        files.images,
        'destination_images'
      );
    }

    return Destination.create({ ...clean, ...uploadData });
  }

  // ===================== UPDATE =====================
  static async updateDestination(id, data, files) {
    const destination = await Destination.findById(id);
    if (!destination) throw new Error('Destination not found');

    const clean = sanitizeData(data);

    // ── Cover image ──────────────────────────────────────────────────────────
    if (data.removeCoverImage === 'true') {
      if (destination.coverImagePublicId) {
        await UploadService.deleteImage(destination.coverImagePublicId).catch(() => {});
      }
      clean.coverImage = null;
      clean.coverImagePublicId = null;
    } else if (files?.coverImage?.[0]) {
      if (destination.coverImagePublicId) {
        await UploadService.deleteImage(destination.coverImagePublicId).catch(() => {});
      }
      const result = await UploadService.uploadSingle(
        files.coverImage[0].buffer,
        'destination_covers'
      );
      clean.coverImage = result.url;
      clean.coverImagePublicId = result.publicId;
    }

    // ── Gallery: remove selected ─────────────────────────────────────────────
    let currentImages = [...(destination.images || [])];

    if (data.removeImages) {
      const removeIds = parseJsonField(data.removeImages);
      if (removeIds.length) {
        await UploadService.deleteMultipleImages(removeIds).catch(() => {});
        currentImages = currentImages.filter(img => !removeIds.includes(img.publicId));
      }
    }

    // ── Gallery: upload new ──────────────────────────────────────────────────
    if (files?.images?.length) {
      const newImages = await UploadService.uploadMultiple(
        files.images,
        'destination_images'
      );
      currentImages = [...currentImages, ...newImages];
    }

    clean.images = currentImages;

    Object.keys(clean).forEach(key => { destination[key] = clean[key]; });
    await destination.save();
    return destination;
  }

  // ===================== DELETE =====================
  static async deleteDestination(id) {
    const destination = await Destination.findById(id);
    if (!destination) throw new Error('Destination not found');

    if (destination.coverImagePublicId) {
      await UploadService.deleteImage(destination.coverImagePublicId).catch(() => {});
    }
    if (destination.images?.length) {
      const ids = destination.images.map(i => i.publicId).filter(Boolean);
      await UploadService.deleteMultipleImages(ids).catch(() => {});
    }

    await destination.deleteOne();
    return { message: 'Destination deleted successfully' };
  }

  // ===================== GET ALL (admin) =====================
  static async getAllDestinations() {
    return Destination.find().sort({ createdAt: -1 });
  }

  // ===================== GET PUBLIC (paginated) =====================
  static async getPublicDestinations(queryParams) {
    const { page = 1, limit = 8, search = '', continent = '' } = queryParams;
    const skip = (page - 1) * Number(limit);

    const query = { published: true };
    if (search) query.name = { $regex: search, $options: 'i' };
    if (continent) query.continent = continent;

    const [destinations, total] = await Promise.all([
      Destination.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Destination.countDocuments(query),
    ]);

    return {
      destinations,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  // ===================== GET BY ID =====================
  static async getDestinationById(id) {
    const destination = await Destination.findById(id);
    if (!destination) throw new Error('Destination not found');
    return destination;
  }
}

module.exports = DestinationService;