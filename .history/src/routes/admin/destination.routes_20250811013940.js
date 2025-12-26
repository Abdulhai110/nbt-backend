const router = require('express').Router();
const ctrl = require('../../controllers/destination.controller');
const requireAuth = require('../../middlewares/auth.middleware');
const restrictTo = require('../../middlewares/role.middleware');

router.use(requireAuth, restrictTo('admin'));

router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
