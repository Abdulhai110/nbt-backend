// src/routes/public/pricingCategory.routes.js
const router = require('express').Router();
const ctrl = require('../../controllers/pricingCategory.controller');

router.get('/', ctrl.getAllPublic);

module.exports = router;