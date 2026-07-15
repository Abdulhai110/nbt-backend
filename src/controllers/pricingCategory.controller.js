// src/controllers/pricingCategory.controller.js
const PricingCategoryService = require('../services/pricingCategory.service');

exports.getAllAdmin = async (req, res, next) => {
  try {
    const categories = await PricingCategoryService.getAll();
    res.status(200).json({ status: 'success', results: categories.length, data: categories });
  } catch (err) { next(err); }
};

exports.getAllPublic = async (req, res, next) => {
  try {
    const categories = await PricingCategoryService.getAll({ activeOnly: true });
    res.status(200).json({ status: 'success', results: categories.length, data: categories });
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const category = await PricingCategoryService.getOne(req.params.id);
    res.status(200).json({ status: 'success', data: category });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const category = await PricingCategoryService.create(req.body);
    res.status(201).json({ status: 'success', message: 'Pricing category created', data: category });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const category = await PricingCategoryService.update(req.params.id, req.body);
    res.status(200).json({ status: 'success', message: 'Pricing category updated', data: category });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const result = await PricingCategoryService.remove(req.params.id);
    res.status(200).json({ status: 'success', message: result.message });
  } catch (err) { next(err); }
};