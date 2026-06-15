// src/services/upload.service.js
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

class UploadService {
  /**
   * Upload single file to Cloudinary using preset
   * @param {Buffer} buffer - File buffer from multer
   * @param {string} presetName - Upload preset (e.g., 'tour_cover', 'gallery_image')
   * @returns {Promise<Object>} { url, publicId, width, height }
   */
  static async uploadSingle(buffer, presetName) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          upload_preset: presetName,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
          });
        }
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }

  /**
   * Upload multiple files
   * @param {Array} files - Array of multer files
   * @param {string} presetName - Upload preset
   * @returns {Promise<Array>} Array of upload results
   */
  static async uploadMultiple(files, presetName) {
    if (!files || files.length === 0) return [];

    const uploadPromises = files.map(file =>
      this.uploadSingle(file.buffer, presetName)
    );

    return Promise.all(uploadPromises);
  }

  /**
   * Delete single image from Cloudinary
   */
  static async deleteImage(publicId) {
    if (!publicId) return;
    return cloudinary.uploader.destroy(publicId);
  }

  /**
   * Delete multiple images
   */
  static async deleteMultipleImages(publicIds) {
    if (!publicIds || publicIds.length === 0) return;
    const deletePromises = publicIds.map(id => this.deleteImage(id));
    return Promise.all(deletePromises);
  }
}

module.exports = UploadService;