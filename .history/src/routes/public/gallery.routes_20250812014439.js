const express = require("express");
const router = express.Router();
const galleryController = require("../../controllers/gallery.controller");

// Public route
router.get("/", galleryController.getAllGalleryItems);

module.exports = router;
