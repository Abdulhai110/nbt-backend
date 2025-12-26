// src/routes/tour.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/tour.controller');
const requireAuth = require('../middlewares/auth.middleware');
const restrictTo = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { createTourSchema } = require('../validators/tour.validator');

// Public
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);

// Protected (user must be logged in)
router.post('/', requireAuth, validate(createTourSchema), ctrl.create);
router.put('/:id', requireAuth, ctrl.update);

// Only admin can hard-delete (example)
router.delete('/:id', requireAuth, restrictTo('admin'), ctrl.remove);

module.exports = router;
