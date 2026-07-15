// src/routes/admin/pricingCategory.routes.js
const router = require('express').Router();
const ctrl = require('../../controllers/pricingCategory.controller');
const requireAuth = require('../../middlewares/auth.middleware');
const restrictTo = require('../../middlewares/role.middleware');

router.use(requireAuth, restrictTo('admin'));

router.get('', ctrl.getAllAdmin);
router.get('/:id', ctrl.getOne);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;