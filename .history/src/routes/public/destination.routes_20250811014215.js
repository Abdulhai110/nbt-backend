const router = require('express').Router();
const ctrl = require('../../controllers/destination.controller.js');

// Public endpoints
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);

module.exports = router;
