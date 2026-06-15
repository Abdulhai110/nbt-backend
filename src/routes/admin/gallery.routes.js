// src/routes/admin/gallery.routes.js
const router      = require('express').Router();
const ctrl        = require('../../controllers/gallery.controller');
const requireAuth = require('../../middlewares/auth.middleware');
const restrictTo  = require('../../middlewares/role.middleware');
const multer      = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.use(requireAuth, restrictTo('admin'));

router.get('/',      ctrl.getAllAdmin);
router.get('/:id',   ctrl.getByIdAdmin);
router.post('/',     upload.single('image'), ctrl.createGalleryItem);
router.put('/:id',   upload.single('image'), ctrl.updateGalleryItem);
router.delete('/:id',                        ctrl.deleteGalleryItem);

module.exports = router;


// ─────────────────────────────────────────────────────────────────────────────
// src/routes/public/gallery.routes.js
// ─────────────────────────────────────────────────────────────────────────────
// const router = require('express').Router();
// const ctrl   = require('../../controllers/gallery.controller');
// router.get('/',    ctrl.getAllGalleryItems);
// router.get('/:id', ctrl.getGalleryItemById);
// module.exports = router;