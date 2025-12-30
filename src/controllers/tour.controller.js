// src/controllers/tour.controller.js
const fs = require("fs");
const path = require("path");
const Tour = require("../models/tour.model");
const buildFilePath = require("../utils/filePath");

const saveFiles = (files) => {
  if (!files) return [];
  return Array.isArray(files)
    ? files.map((file) => file.filename || file.path)
    : [files.filename || files.path];
};

// ===================== GET ALL TOURS =====================
exports.getAll = async (req, res) => {
  try {
    const tours = await Tour.find({ published: true }).sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      results: tours.length,
      data: tours,
    });
  } catch (err) {
    console.error("Get all tours error:", err);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch tours",
      error: err.message,
    });
  }
};

// ===================== GET PUBLIC TOURS =====================
exports.getAllPublic = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const query = {
      published: true,
    };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const [tours, total] = await Promise.all([
      Tour.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Tour.countDocuments(query),
    ]);

    res.status(200).json({
      status: "success",
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: tours,
    });
  } catch (err) {
    console.error("Get public tours error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch public tours",
    });
  }
};

// ===================== GET ONE TOUR =====================
exports.getOne = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({
        status: "fail",
        message: "Tour not found",
      });
    }

    // If unpublished, restrict access
    if (
      !tour.published &&
      (!req.user ||
        (req.user._id.toString() !== tour.owner?.toString() &&
          req.user.role !== "admin"))
    ) {
      return res.status(403).json({
        status: "fail",
        message: "Forbidden",
      });
    }

    return res.status(200).json({
      status: "success",
      data: tour,
    });
  } catch (err) {
    console.error("Get tour error:", err);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch tour",
      error: err.message,
    });
  }
};

// ===================== CREATE TOUR =====================
exports.create = async (req, res) => {
  try {
    const data = { ...req.body, owner: req.user._id };

    if (req.files?.coverImage) {
      const filename = req.files.coverImage[0].filename;
      data.coverImage = buildFilePath("tours/temp", filename, req); // full URL
    }

    if (req.files?.images) {
      data.images = req.files.images.map((f) =>
        buildFilePath("tours/temp", f.filename, req)
      );
    }

    const tour = await Tour.create(data);

    return res.status(201).json({
      status: "success",
      message: "Tour created successfully",
      data: tour,
    });
  } catch (err) {
    console.error("Create tour error:", err);
    return res.status(500).json({
      status: "error",
      message: "Failed to create tour",
      error: err.message,
    });
  }
};

// ===================== UPDATE TOUR =====================
exports.update = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({
        status: "fail",
        message: "Tour not found",
      });
    }

    if (
      tour.owner &&
      tour.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        status: "fail",
        message: "Forbidden",
      });
    }

    if (req.files?.coverImage) {
      const filename = req.files.coverImage[0].filename;
      tour.coverImage = buildFilePath(`tours/${req.params.id}`, filename, req);
    }

    if (req.files?.images) {
      tour.images = req.files.images.map((f) =>
        buildFilePath(`tours/${req.params.id}`, f.filename, req)
      );
    }

    Object.keys(req.body).forEach((key) => {
      tour[key] = req.body[key];
    });

    await tour.save();

    return res.status(200).json({
      status: "success",
      message: "Tour updated successfully",
      data: tour,
    });
  } catch (err) {
    console.error("Update tour error:", err);
    return res.status(500).json({
      status: "error",
      message: "Failed to update tour",
      error: err.message,
    });
  }
};

// ===================== DELETE TOUR =====================
exports.remove = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({
        status: "fail",
        message: "Tour not found",
      });
    }

    if (
      tour.owner &&
      tour.owner.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        status: "fail",
        message: "Forbidden",
      });
    }

    await tour.deleteOne();

    return res.status(200).json({
      status: "success",
      message: "Tour deleted successfully",
    });
  } catch (err) {
    console.error("Delete tour error:", err);
    return res.status(500).json({
      status: "error",
      message: "Failed to delete tour",
      error: err.message,
    });
  }
};
