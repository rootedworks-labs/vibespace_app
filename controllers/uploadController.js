// controllers/uploadController.js
const { uploadToMinIO } = require('../services/fileStorage');
const { sanitizeFilename } = require('../utils/gdprUtils.js');

exports.uploadFile = async (req, res) => {
  try {
    const { userId } = req;
    const file = req.file;

    // GDPR: Strip metadata and sanitize filename
    const cleanFile = {
      buffer: await removeExifMetadata(file.buffer),
      originalname: sanitizeFilename(file.originalname)
    };

    // Upload to MinIO
    const fileUrl = await uploadToMinIO(
      `user-${userId}/uploads/${Date.now()}-${cleanFile.originalname}`,
      cleanFile.buffer
    );

    res.json({ 
      url: fileUrl,
      message: "File uploaded with GDPR compliance"
    });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
};