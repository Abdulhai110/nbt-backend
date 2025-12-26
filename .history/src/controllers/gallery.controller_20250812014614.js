const Gallery = require("../models/gallery.model");

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
exports.getAllGalleryItems = async (req, res) => {
  try {
    const items = await Gallery.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Get all gallery items
// @route GET /api/gallery
// @access Public
exports.getAllGalleryItems = async (req, res) => {
  try {
    const items = await Gallery.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Create new gallery item
// @route POST /api/gallery
// @access Admin
exports.createGalleryItem = async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    const newItem = new Gallery({ title, description, imageUrl });
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Update gallery item
// @route PUT /api/gallery/:id
// @access Admin
exports.updateGalleryItem = async (req, res) => {
  try {
    const updated = await Gallery.findByIdAndUpdate(
      req.params.id,
      { 
        title: req.body.title, 
        description: req.body.description, 
        imageUrl: req.body.imageUrl 
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Gallery item not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Delete gallery item
// @route DELETE /api/gallery/:id
// @access Admin
exports.deleteGalleryItem = async (req, res) => {
  try {
    const deleted = await Gallery.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Gallery item not found" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
