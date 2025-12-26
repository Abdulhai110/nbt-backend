const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use tour ID if updating, or temp folder if creating
    let tourId = req.params.id || "temp";

    // uploads/tours/:id/
    const uploadPath = path.join(__dirname, "..", "uploads", "tours", tourId);

    // Auto create folder
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

module.exports = upload;
