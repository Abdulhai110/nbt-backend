const express = require("express");
const Gallery = require("../../models/Gallery");

const router = express.Router();

// GET all gallery items (public)
router.get("/", async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
