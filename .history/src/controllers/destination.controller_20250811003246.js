// src/controllers/tour.controller.js
const Tour = require('../models/tour.model');

exports.getAll = async (req, res) => {
  const tours = await Tour.find({ published: true }).sort({ createdAt: -1 });
  res.json(tours);
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

exports.create = async (req, res) => {
  const data = { ...req.body, owner: req.user._id };
  const tour = await Tour.create(data);
  res.status(201).json(tour);
};

exports.update = async (req, res) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) return res.status(404).json({ message: 'Not found' });
  if (tour.owner && tour.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  Object.assign(tour, req.body);
  await tour.save();
  res.json(tour);
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
