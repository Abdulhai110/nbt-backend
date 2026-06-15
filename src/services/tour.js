// src/services/tour.service.js
const Tour = require('../models/tour.model');
const UploadService = require('./upload');

class TourService {
  // ===================== CREATE TOUR =====================
  static async createTour(data, files, userId) {
    const uploadData = {};

    if (files?.coverImage?.[0]) {
      const result = await UploadService.uploadSingle(
        files.coverImage[0].buffer,
        'tour_covers'
      );
      uploadData.coverImage = result.url;
    }

    if (files?.images?.length) {
      const results = await UploadService.uploadMultiple(files.images, 'tour_images');
      uploadData.images = results;
    }

    const tour = await Tour.create({ ...data, ...uploadData, owner: userId });
    return tour;
  }

  // ===================== UPDATE TOUR =====================
  static async updateTour(tourId, data, files, user) {
    let tour = await Tour.findById(tourId);
    if (!tour) throw new Error('Tour not found');

    if (
      tour.owner &&
      tour.owner.toString() !== user._id.toString() &&
      user.role !== 'admin'
    ) {
      throw new Error('Forbidden: You are not authorized');
    }

    const updateData = { ...data };

    // ── Cover image ────────────────────────────────────────────────────────
    if (data.removeCoverImage === 'true') {
      // Delete old cover from Cloudinary if publicId stored
      if (tour.coverImagePublicId) {
        await UploadService.deleteImage(tour.coverImagePublicId).catch(() => {});
      }
      updateData.coverImage = null;
      updateData.coverImagePublicId = null;
      delete updateData.removeCoverImage;
    } else if (files?.coverImage?.[0]) {
      // Delete old cover first
      if (tour.coverImagePublicId) {
        await UploadService.deleteImage(tour.coverImagePublicId).catch(() => {});
      }
      const result = await UploadService.uploadSingle(
        files.coverImage[0].buffer,
        'tour_covers'
      );
      updateData.coverImage = result.url;
      updateData.coverImagePublicId = result.publicId;
    }

    // ── Remove selected gallery images ─────────────────────────────────────
    let currentImages = [...(tour.images || [])];

    if (data.removeImages) {
      let removeIds = [];
      try { removeIds = JSON.parse(data.removeImages); } catch {}

      if (removeIds.length) {
        // Delete from Cloudinary
        await UploadService.deleteMultipleImages(removeIds).catch(() => {});
        // Remove from array
        currentImages = currentImages.filter(
          img => !removeIds.includes(img.publicId)
        );
      }
      delete updateData.removeImages;
    }

    // ── Upload new gallery images (append) ─────────────────────────────────
    if (files?.images?.length) {
      const newImages = await UploadService.uploadMultiple(files.images, 'tour_images');
      currentImages = [...currentImages, ...newImages];
    }

    updateData.images = currentImages;

    // Handle locations — may come as JSON string
    if (typeof updateData.locations === 'string') {
      try { updateData.locations = JSON.parse(updateData.locations); } catch {}
    }

    // Handle includes/excludes
    ['includes', 'excludes'].forEach(key => {
      if (typeof updateData[key] === 'string') {
        try { updateData[key] = JSON.parse(updateData[key]); } catch {}
      }
    });

    Object.keys(updateData).forEach(key => {
      tour[key] = updateData[key];
    });

    await tour.save();
    return tour;
  }

  // ===================== DELETE TOUR =====================
  static async deleteTour(tourId, user) {
    const tour = await Tour.findById(tourId);
    if (!tour) throw new Error('Tour not found');

    if (
      tour.owner &&
      tour.owner.toString() !== user._id.toString() &&
      user.role !== 'admin'
    ) {
      throw new Error('Forbidden');
    }

    if (tour.coverImagePublicId) {
      await UploadService.deleteImage(tour.coverImagePublicId).catch(() => {});
    }

    if (tour.images?.length) {
      const publicIds = tour.images.map(img => img.publicId).filter(Boolean);
      await UploadService.deleteMultipleImages(publicIds).catch(() => {});
    }

    await tour.deleteOne();
    return { message: 'Tour deleted successfully' };
  }

  // ===================== GET METHODS =====================
  static async getAllTours() {
    return Tour.find().sort({ createdAt: -1 });
  }

  static async getPublicTours(queryParams) {
    const { page = 1, limit = 8, search = '' } = queryParams;
    const skip = (page - 1) * limit;
    const query = { published: true };

    if (search) query.title = { $regex: search, $options: 'i' };

    const [tours, total] = await Promise.all([
      Tour.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Tour.countDocuments(query),
    ]);

    return {
      tours,
      pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) },
    };
  }

  static async getTourById(id, user = null) {
    const tour = await Tour.findById(id);
    if (!tour) throw new Error('Tour not found');

    if (
      !tour.published &&
      (!user || (user._id.toString() !== tour.owner?.toString() && user.role !== 'admin'))
    ) {
      throw new Error('Forbidden');
    }

    return tour;
  }
}

module.exports = TourService;