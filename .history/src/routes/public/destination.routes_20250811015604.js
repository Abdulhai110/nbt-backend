// src/routes/public/destination.routes.js
const router = require('express').Router();
const ctrl = require('../../controllers/destination.controller');

// Public endpoints
router.get('/', ctrl.getDestinations);
router.get('/:id', ctrl.getDestinationById);

module.exports = router;
