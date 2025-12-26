const express = require("express");
const Gallery = require("../../models/gallery.model");

const router = express.Router();

// GET all gallery items (public)
router.get("/", async (req, res) => {
  try {
    const items = await Gallery.find();
    console.log(items);
    
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
