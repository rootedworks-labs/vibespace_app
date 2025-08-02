// utils/gdprUtils.js
const sharp = require('sharp');

exports.sanitizeFilename = (name) => {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_'); // Remove special chars
};

exports.removeExifMetadata = async (buffer) => {
  return sharp(buffer)
    .withMetadata({}) // Strip all metadata
    .toBuffer();
};