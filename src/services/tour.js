// // src/services/tour.service.js
// const Tour = require('../models/tour.model');
// const UploadService = require('./upload');

// class TourService {
//   // ===================== CREATE TOUR =====================
//   static async createTour(data, files, userId) {
//     const uploadData = {};

//     if (files?.coverImage?.[0]) {
//       const result = await UploadService.uploadSingle(
//         files.coverImage[0].buffer,
//         'tour_covers'
//       );
//       uploadData.coverImage = result.url;
//     }

//     if (files?.images?.length) {
//       const results = await UploadService.uploadMultiple(files.images, 'tour_images');
//       uploadData.images = results;
//     }

//     const tour = await Tour.create({ ...data, ...uploadData, owner: userId });
//     return tour;
//   }

//   // ===================== UPDATE TOUR =====================
//   static async updateTour(tourId, data, files, user) {
//     let tour = await Tour.findById(tourId);
//     if (!tour) throw new Error('Tour not found');

//     if (
//       tour.owner &&
//       tour.owner.toString() !== user._id.toString() &&
//       user.role !== 'admin'
//     ) {
//       throw new Error('Forbidden: You are not authorized');
//     }

//     const updateData = { ...data };

//     // ── Cover image ────────────────────────────────────────────────────────
//     if (data.removeCoverImage === 'true') {
//       // Delete old cover from Cloudinary if publicId stored
//       if (tour.coverImagePublicId) {
//         await UploadService.deleteImage(tour.coverImagePublicId).catch(() => {});
//       }
//       updateData.coverImage = null;
//       updateData.coverImagePublicId = null;
//       delete updateData.removeCoverImage;
//     } else if (files?.coverImage?.[0]) {
//       // Delete old cover first
//       if (tour.coverImagePublicId) {
//         await UploadService.deleteImage(tour.coverImagePublicId).catch(() => {});
//       }
//       const result = await UploadService.uploadSingle(
//         files.coverImage[0].buffer,
//         'tour_covers'
//       );
//       updateData.coverImage = result.url;
//       updateData.coverImagePublicId = result.publicId;
//     }

//     // ── Remove selected gallery images ─────────────────────────────────────
//     let currentImages = [...(tour.images || [])];

//     if (data.removeImages) {
//       let removeIds = [];
//       try { removeIds = JSON.parse(data.removeImages); } catch {}

//       if (removeIds.length) {
//         // Delete from Cloudinary
//         await UploadService.deleteMultipleImages(removeIds).catch(() => {});
//         // Remove from array
//         currentImages = currentImages.filter(
//           img => !removeIds.includes(img.publicId)
//         );
//       }
//       delete updateData.removeImages;
//     }

//     // ── Upload new gallery images (append) ─────────────────────────────────
//     if (files?.images?.length) {
//       const newImages = await UploadService.uploadMultiple(files.images, 'tour_images');
//       currentImages = [...currentImages, ...newImages];
//     }

//     updateData.images = currentImages;

//     // Handle locations — may come as JSON string
//     if (typeof updateData.locations === 'string') {
//       try { updateData.locations = JSON.parse(updateData.locations); } catch {}
//     }

//     // Handle includes/excludes
//     ['includes', 'excludes'].forEach(key => {
//       if (typeof updateData[key] === 'string') {
//         try { updateData[key] = JSON.parse(updateData[key]); } catch {}
//       }
//     });

//     Object.keys(updateData).forEach(key => {
//       tour[key] = updateData[key];
//     });

//     await tour.save();
//     return tour;
//   }

//   // ===================== DELETE TOUR =====================
//   static async deleteTour(tourId, user) {
//     const tour = await Tour.findById(tourId);
//     if (!tour) throw new Error('Tour not found');

//     if (
//       tour.owner &&
//       tour.owner.toString() !== user._id.toString() &&
//       user.role !== 'admin'
//     ) {
//       throw new Error('Forbidden');
//     }

//     if (tour.coverImagePublicId) {
//       await UploadService.deleteImage(tour.coverImagePublicId).catch(() => {});
//     }

//     if (tour.images?.length) {
//       const publicIds = tour.images.map(img => img.publicId).filter(Boolean);
//       await UploadService.deleteMultipleImages(publicIds).catch(() => {});
//     }

//     await tour.deleteOne();
//     return { message: 'Tour deleted successfully' };
//   }

//   // ===================== GET METHODS =====================
//   static async getAllTours() {
//     return Tour.find().sort({ createdAt: -1 });
//   }

//   static async getPublicTours(queryParams) {
//     const { page = 1, limit = 8, search = '' } = queryParams;
//     const skip = (page - 1) * limit;
//     const query = { published: true };

//     if (search) query.title = { $regex: search, $options: 'i' };

//     const [tours, total] = await Promise.all([
//       Tour.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
//       Tour.countDocuments(query),
//     ]);

//     return {
//       tours,
//       pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) },
//     };
//   }

//   static async getTourById(id, user = null) {
//     const tour = await Tour.findById(id);
//     if (!tour) throw new Error('Tour not found');

//     if (
//       !tour.published &&
//       (!user || (user._id.toString() !== tour.owner?.toString() && user.role !== 'admin'))
//     ) {
//       throw new Error('Forbidden');
//     }

//     return tour;
//   }
// }

// module.exports = TourService;


























// src/services/tour.service.js
const Tour = require('../models/tour.model');
const TourType = require('../models/tourType.model');
const PricingCategory = require('../models/pricingCategory.model');
const UploadService = require('./upload');

const POPULATE_FIELDS = [
  { path: 'tourType', select: 'name slug style icon' },
  { path: 'pricingOptions.category', select: 'name slug' },
];

// ── Attach uploaded itinerary images onto the itinerary array by index ──
function applyItineraryImageUploads(itinerary, uploadResults, imageMap) {
  uploadResults.forEach((result, i) => {
    const targetIdx = imageMap[i];
    if (itinerary[targetIdx]) {
      itinerary[targetIdx].image = result.url;
      itinerary[targetIdx].imagePublicId = result.publicId;
    }
  });
  return itinerary;
}

// ── Figure out which old itinerary images are no longer used, so we can delete them ──
function collectStaleItineraryImagePublicIds(oldItinerary = [], newItinerary = []) {
  const newById = new Map();
  newItinerary.forEach((d) => {
    if (d._id) newById.set(String(d._id), d.imagePublicId || null);
  });

  const stale = [];
  oldItinerary.forEach((d) => {
    if (!d.imagePublicId) return;
    const key = String(d._id);
    if (!newById.has(key)) {
      stale.push(d.imagePublicId); // day removed entirely
    } else if (newById.get(key) !== d.imagePublicId) {
      stale.push(d.imagePublicId); // image replaced or explicitly removed
    }
  });
  return stale;
}

class TourService {
  static async createTour(data, files, userId) {
    const uploadData = {};

    if (!data.tourType) throw new Error('tourType is required');
    const tourType = await TourType.findById(data.tourType);
    if (!tourType) throw new Error('Invalid tourType');

    if (Array.isArray(data.pricingOptions)) {
      for (const opt of data.pricingOptions) {
        if (!opt.category) throw new Error('Each pricing option requires a category');
        const cat = await PricingCategory.findById(opt.category);
        if (!cat) throw new Error(`Invalid pricing category: ${opt.category}`);
      }
    }

    if (files?.coverImage?.[0]) {
      const result = await UploadService.uploadSingle(files.coverImage[0].buffer, 'tour_covers');
      uploadData.coverImage = result.url;
      uploadData.coverImagePublicId = result.publicId;
    }

    if (files?.images?.length) {
      uploadData.images = await UploadService.uploadMultiple(files.images, 'tour_images');
    }

    // ── Itinerary images (optional, per day) ──
    let itinerary = Array.isArray(data.itinerary) ? data.itinerary : [];
    if (files?.itineraryImages?.length) {
      const imageMap = Array.isArray(data.itineraryImageMap) ? data.itineraryImageMap : [];
      const results = await UploadService.uploadMultiple(files.itineraryImages, 'tour_itinerary');
      itinerary = applyItineraryImageUploads(itinerary, results, imageMap);
    }
    uploadData.itinerary = itinerary;

    const tour = await Tour.create({ ...data, ...uploadData, owner: userId });
    return tour.populate(POPULATE_FIELDS);
  }

  static async updateTour(tourId, data, files, user) {
    let tour = await Tour.findById(tourId);
    if (!tour) throw new Error('Tour not found');

    if (tour.owner && tour.owner.toString() !== user._id.toString() && user.role !== 'admin') {
      throw new Error('Forbidden: You are not authorized');
    }

    const updateData = { ...data };

    if (updateData.tourType) {
      const tourType = await TourType.findById(updateData.tourType);
      if (!tourType) throw new Error('Invalid tourType');
    }

    if (Array.isArray(updateData.pricingOptions)) {
      for (const opt of updateData.pricingOptions) {
        if (!opt.category) throw new Error('Each pricing option requires a category');
        const cat = await PricingCategory.findById(opt.category);
        if (!cat) throw new Error(`Invalid pricing category: ${opt.category}`);
      }
    }

    // ── Cover image ──
    if (data.removeCoverImage === 'true') {
      if (tour.coverImagePublicId) await UploadService.deleteImage(tour.coverImagePublicId).catch(() => {});
      updateData.coverImage = null;
      updateData.coverImagePublicId = null;
      delete updateData.removeCoverImage;
    } else if (files?.coverImage?.[0]) {
      if (tour.coverImagePublicId) await UploadService.deleteImage(tour.coverImagePublicId).catch(() => {});
      const result = await UploadService.uploadSingle(files.coverImage[0].buffer, 'tour_covers');
      updateData.coverImage = result.url;
      updateData.coverImagePublicId = result.publicId;
    }

    // ── Gallery images ──
    let currentImages = [...(tour.images || [])];
    if (data.removeImages) {
      let removeIds = [];
      try { removeIds = JSON.parse(data.removeImages); } catch {}
      if (removeIds.length) {
        await UploadService.deleteMultipleImages(removeIds).catch(() => {});
        currentImages = currentImages.filter((img) => !removeIds.includes(img.publicId));
      }
      delete updateData.removeImages;
    }
    if (files?.images?.length) {
      const newImages = await UploadService.uploadMultiple(files.images, 'tour_images');
      currentImages = [...currentImages, ...newImages];
    }
    updateData.images = currentImages;

    // ── Itinerary + its images ──
    ['locations', 'includes', 'excludes', 'pricingOptions', 'itinerary', 'itineraryImageMap'].forEach((key) => {
      if (typeof updateData[key] === 'string') {
        try { updateData[key] = JSON.parse(updateData[key]); } catch {}
      }
    });

    if (Array.isArray(updateData.itinerary)) {
      let newItinerary = updateData.itinerary.map((d) => ({ ...d }));

      // carry forward old image data for days that still exist and weren't marked for removal
      const oldById = new Map((tour.itinerary || []).map((d) => [String(d._id), d]));
      newItinerary = newItinerary.map((d) => {
        if (d._id && oldById.has(String(d._id)) && !d.removeImage) {
          const old = oldById.get(String(d._id));
          return { ...d, image: old.image, imagePublicId: old.imagePublicId };
        }
        return { ...d, image: null, imagePublicId: null };
      });

      // apply any newly uploaded itinerary images (overrides carried-forward values)
      if (files?.itineraryImages?.length) {
        const imageMap = Array.isArray(updateData.itineraryImageMap) ? updateData.itineraryImageMap : [];
        const results = await UploadService.uploadMultiple(files.itineraryImages, 'tour_itinerary');
        newItinerary = applyItineraryImageUploads(newItinerary, results, imageMap);
      }

      const staleIds = collectStaleItineraryImagePublicIds(tour.itinerary || [], newItinerary);
      if (staleIds.length) await UploadService.deleteMultipleImages(staleIds).catch(() => {});

      newItinerary.forEach((d) => delete d.removeImage);
      updateData.itinerary = newItinerary;
    }
    delete updateData.itineraryImageMap;

    Object.keys(updateData).forEach((key) => { tour[key] = updateData[key]; });
    await tour.save();
    return tour.populate(POPULATE_FIELDS);
  }

  static async deleteTour(tourId, user) {
    const tour = await Tour.findById(tourId);
    if (!tour) throw new Error('Tour not found');
    if (tour.owner && tour.owner.toString() !== user._id.toString() && user.role !== 'admin') {
      throw new Error('Forbidden');
    }
    if (tour.coverImagePublicId) await UploadService.deleteImage(tour.coverImagePublicId).catch(() => {});
    if (tour.images?.length) {
      await UploadService.deleteMultipleImages(tour.images.map((i) => i.publicId).filter(Boolean)).catch(() => {});
    }
    if (tour.itinerary?.length) {
      const itnIds = tour.itinerary.map((d) => d.imagePublicId).filter(Boolean);
      if (itnIds.length) await UploadService.deleteMultipleImages(itnIds).catch(() => {});
    }
    await tour.deleteOne();
    return { message: 'Tour deleted successfully' };
  }

  static async getAllTours() {
    return Tour.find().sort({ createdAt: -1 }).populate(POPULATE_FIELDS);
  }

  static async getPublicTours(queryParams) {
    const { page = 1, limit = 8, search = '', type = '', category = '' } = queryParams;
    const skip = (page - 1) * limit;
    const query = { published: true };
    if (search) query.title = { $regex: search, $options: 'i' };

    if (type) {
      const tourType = await TourType.findOne({ slug: type, active: true });
      if (!tourType) return { tours: [], pagination: { page: Number(page), limit: Number(limit), total: 0, totalPages: 0 } };
      query.tourType = tourType._id;
    }
    if (category) {
      const pricingCategory = await PricingCategory.findOne({ slug: category, active: true });
      if (!pricingCategory) return { tours: [], pagination: { page: Number(page), limit: Number(limit), total: 0, totalPages: 0 } };
      query['pricingOptions.category'] = pricingCategory._id;
    }

    const [tours, total] = await Promise.all([
      Tour.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate(POPULATE_FIELDS),
      Tour.countDocuments(query),
    ]);
    return { tours, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) } };
  }

  static async getTourById(id, user = null) {
    const tour = await Tour.findById(id).populate(POPULATE_FIELDS);
    if (!tour) throw new Error('Tour not found');
    if (!tour.published && (!user || (user._id.toString() !== tour.owner?.toString() && user.role !== 'admin'))) {
      throw new Error('Forbidden');
    }
    return tour;
  }
}

module.exports = TourService;