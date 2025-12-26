const router = require('express').Router();
const ctrl = require('../../controllers/tour.controller');

// Public endpoints
router.get('/', ctrl.getAllPublic);
router.get('/:id', ctrl.getOne);

module.exports = router;
