// src/validators/tour.validator.js
const Joi = require('joi');
const createTourSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().min(0),
  description: Joi.string().allow(''),
  locations: Joi.array().items(Joi.string()),
  images: Joi.array().items(Joi.string()),
  published: Joi.boolean()
});
module.exports = { createTourSchema };
