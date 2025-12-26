const express = require("express");
const Gallery = require("../../models/gallery.model");

const router = express.Router();

// CREATE gallery item
router.post("/", async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    const newItem = new Gallery({ title, description, imageUrl });
    const saved = await newItem.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE gallery item
router.put("/:id", async (req, res) => {
  try {
    const updated = await Gallery.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, description: req.body.description, imageUrl: req.body.imageUrl },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE gallery item
router.delete("/:id", async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
