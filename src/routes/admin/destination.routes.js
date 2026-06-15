// src/routes/admin/destination.routes.js
const router = require('express').Router();
const ctrl = require('../../controllers/destination.controller');
const requireAuth = require('../../middlewares/auth.middleware');
const restrictTo = require('../../middlewares/role.middleware');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });
const imageFields = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'images',     maxCount: 15 },
]);

// All admin routes require auth + admin role
router.use(requireAuth, restrictTo('admin'));

router.get('/',      ctrl.getAllDestinationsAdmin);
router.get('/:id',   ctrl.getDestinationByIdAdmin);
router.post('/',     imageFields, ctrl.createDestination);
router.put('/:id',   imageFields, ctrl.updateDestination);
router.delete('/:id',             ctrl.deleteDestination);

module.exports = router;


// ─────────────────────────────────────────────────────────────────────────────
// src/routes/public/destination.routes.js  (public-facing)
// ─────────────────────────────────────────────────────────────────────────────
// const router = require('express').Router();
// const ctrl = require('../../controllers/destination.controller');
//
// router.get('/',    ctrl.getDestinations);
// router.get('/:id', ctrl.getDestinationById);
//
// module.exports = router;