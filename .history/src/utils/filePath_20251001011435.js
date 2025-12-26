const path = require("path");

function buildFilePath(folder, filename, req) {
  const baseUrl = `${req.protocol}://${req.get("host")}`; // http://localhost:5000
  return `${baseUrl}/uploads/${folder}/${filename}`;
}

module.exports = buildFilePath;
