const router = require("express").Router();
const upload = require("../../config/multer");
const ctrl = require("../../controllers/tour.controller");
const requireAuth = require("../../middlewares/auth.middleware");
const restrictTo = require("../../middlewares/role.middleware");

router.use(requireAuth, restrictTo("admin"));


router.get('',ctrl.getAll);

router.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  ctrl.create
);

router.put(
  "/:id",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  ctrl.update
);

router.get('/:id',ctrl.getOne);

router.delete("/:id", ctrl.remove);

module.exports = router;
