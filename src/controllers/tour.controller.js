// src/controllers/tour.controller.js

const TourService = require("../services/tour");

exports.getAll = async (req, res, next) => {
  try {
    const tours = await TourService.getAllTours();
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: tours,
    });
  } catch (err) {
    next(err); // Let error middleware handle it
  }
};

exports.getAllPublic = async (req, res, next) => {
  try {
    const result = await TourService.getPublicTours(req.query);
    res.status(200).json({
      status: "success",
      ...result.pagination,
      data: result.tours,
    });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const tour = await TourService.getTourById(req.params.id, req.user);
    res.status(200).json({
      status: "success",
      data: tour,
    });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body };

    ["locations", "includes", "excludes"].forEach((key) => {
      if (typeof data[key] === "string") {
        try {
          data[key] = JSON.parse(data[key]);
        } catch {
          data[key] = [];
        }
      }
    });
    const tour = await TourService.createTour(data, req.files, req.user._id);
    res.status(201).json({
      status: "success",
      message: "Tour created successfully",
      data: tour,
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = { ...req.body };
    ["locations", "includes", "excludes"].forEach((key) => {
      if (typeof data[key] === "string") {
        try {
          data[key] = JSON.parse(data[key]);
        } catch {
          data[key] = [];
        }
      }
    });
    const tour = await TourService.updateTour(
      req.params.id,
      data,
      req.files,
      req.user,
    );
    res.status(200).json({
      status: "success",
      message: "Tour updated successfully",
      data: tour,
    });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const result = await TourService.deleteTour(req.params.id, req.user);
    res.status(200).json({
      status: "success",
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};
