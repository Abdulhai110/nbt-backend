const router = require("express").Router();
const upload = require("../../config/multer");
const ctrl = require("../../controllers/tour.controller");
const requireAuth = require("../../middlewares/auth.middleware");
const restrictTo = require("../../middlewares/role.middleware");

router.use(requireAuth, restrictTo("admin"));

router.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  ctrl.create
);

router.get('/',ctrl.getAll);

router.put(
  "/:id",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  ctrl.update
);
router.delete("/:id", ctrl.remove);

module.exports = router;
