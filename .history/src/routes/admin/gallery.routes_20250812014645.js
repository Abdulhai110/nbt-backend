const express = require("express");
const router = express.Router();
const galleryController = require("../controllers/gallery.controller");

// Public route
router.get("/", galleryController.getAllGalleryItems);

// Admin routes
router.post("/", galleryController.createGalleryItem);
router.put("/:id", galleryController.updateGalleryItem);
router.delete("/:id", galleryController.deleteGalleryItem);

module.exports = router;
