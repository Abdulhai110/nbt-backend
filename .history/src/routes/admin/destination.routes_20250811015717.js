const router = require('express').Router();
const ctrl = require('../../controllers/destination.controller');
const requireAuth = require('../../middlewares/auth.middleware');
const restrictTo = require('../../middlewares/role.middleware');

// Admin-only routes
router.use(requireAuth, restrictTo('admin'));

router.post('/', ctrl.createDestination);
router.put('/:id', ctrl.updateDestination);
router.delete('/:id', ctrl.deleteDestination);

module.exports = router;
