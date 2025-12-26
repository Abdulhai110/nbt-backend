// src/controllers/tour.controller.js
const Tour = require('../models/tour.model');


// Helper to save uploaded files
const saveFiles = (files, fieldName) => {
  if (!files) return [];
  return Array.isArray(files) ? files.map(file => file.filename || file.path) : [files.filename || files.path];
};

// controllers/tour.controller.js
exports.getAll = async (req, res) => {
  try {
    // Fetch only published tours, sorted by newest first
    const tours = await Tour.find({ published: true }).sort({ createdAt: -1 });
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: tours,
    });
  } catch (err) {
    console.error("Get all tours error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch tours",
      error: err.message,
    });
  }
};


exports.getOne = async (req, res) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) return res.status(404).json({ message: 'Not found' });
  // If unpublished, only owner/admin can view:
  if (!tour.published && (!req.user || (req.user._id.toString() !== tour.owner?.toString() && req.user.role !== 'admin'))) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  res.json(tour);
};

// CREATE TOUR
exports.create = async (req, res) => {
  try {
    const data = { ...req.body, owner: req.user._id };

    // Handle coverImage
    console.log('<<<<<<<<<<----------------->>>>>>>>>>',req.body);
    
    if (req.files?.coverImage) {
      data.coverImage = req.files.coverImage[0].filename;
    }

    // Handle gallery images
    if (req.files?.images) {
      data.images = saveFiles(req.files.images);
    }

    const tour = await Tour.create(data);
    res.status(201).json(tour);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create tour', error: err.message });
  }
};

// UPDATE TOUR
exports.update = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });

    // Check ownership or admin
    if (tour.owner && tour.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Handle coverImage update
    if (req.files?.coverImage) {
      // optionally delete old cover image from storage
      if (tour.coverImage) {
        const oldPath = path.join(__dirname, '..', 'uploads', tour.coverImage);
        fs.existsSync(oldPath) && fs.unlinkSync(oldPath);
      }
      tour.coverImage = req.files.coverImage[0].filename;
    }

    // Handle gallery images update
    if (req.files?.images) {
      tour.images = saveFiles(req.files.images);
    }

    // Update other fields
    Object.keys(req.body).forEach(key => {
      tour[key] = req.body[key];
    });

    await tour.save();
    res.json(tour);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update tour', error: err.message });
  }
};

exports.remove = async (req, res) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) return res.status(404).json({ message: 'Not found' });
  if (tour.owner && tour.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  await tour.deleteOne();
  res.json({ message: 'Deleted' });
};
