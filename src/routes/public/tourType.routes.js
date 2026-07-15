// src/routes/public/tourType.routes.js
const router = require('express').Router();
const ctrl = require('../../controllers/tourType.controller');

router.get('/', ctrl.getAllPublic);

module.exports = router;