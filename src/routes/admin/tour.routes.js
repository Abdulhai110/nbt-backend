const router = require("express").Router();
const upload = require("../../config/multer");
const ctrl = require("../../controllers/tour.controller");
const requireAuth = require("../../middlewares/auth.middleware");
const restrictTo = require("../../middlewares/role.middleware");

router.use(requireAuth, restrictTo("admin"));

router.get("", ctrl.getAll);
router.get("/:id", ctrl.getOne);
router.delete("/:id", ctrl.remove);

router.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 15 }, // increased limit
    { name: "itineraryImages", maxCount: 30 }, // ← new
  ]),
  ctrl.create,
);

router.put(
  "/:id",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 15 },
    { name: "itineraryImages", maxCount: 30 }, // ← new
  ]),
  ctrl.update,
);

module.exports = router;
