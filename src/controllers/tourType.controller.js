// src/controllers/tourType.controller.js
const TourTypeService = require('../services/tourType.service');

exports.getAllAdmin = async (req, res, next) => {
  try {
    const tourTypes = await TourTypeService.getAll();
    res.status(200).json({ status: 'success', results: tourTypes.length, data: tourTypes });
  } catch (err) { next(err); }
};

exports.getAllPublic = async (req, res, next) => {
  try {
    const tourTypes = await TourTypeService.getAll({ activeOnly: true });
    res.status(200).json({ status: 'success', results: tourTypes.length, data: tourTypes });
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const tourType = await TourTypeService.getOne(req.params.id);
    res.status(200).json({ status: 'success', data: tourType });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const tourType = await TourTypeService.create(req.body);
    res.status(201).json({ status: 'success', message: 'Tour type created', data: tourType });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const tourType = await TourTypeService.update(req.params.id, req.body);
    res.status(200).json({ status: 'success', message: 'Tour type updated', data: tourType });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const result = await TourTypeService.remove(req.params.id);
    res.status(200).json({ status: 'success', message: result.message });
  } catch (err) { next(err); }
};