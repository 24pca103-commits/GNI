import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Supported MIME types and extensions
const MIME_MAP = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

// Target upload directories
const backendUploadDir = path.resolve(__dirname, '../uploads');
const frontendUploadDir = path.resolve(__dirname, '../../frontend/public/uploads');

// Ensure upload directories exist
[backendUploadDir, frontendUploadDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (_) {}
  }
});

router.post('/', async (req, res) => {
  try {
    const { image, filename: clientFilename } = req.body;

    if (!image || typeof image !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'No image data provided. Please select an image file.',
      });
    }

    // Match Base64 format: data:image/xxx;base64,xxxx
    const match = image.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!match) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image format. Supported formats: PNG, JPG, JPEG, WEBP.',
      });
    }

    const mimeType = match[1].toLowerCase();
    const base64Data = match[2];

    const ext = MIME_MAP[mimeType];
    if (!ext) {
      return res.status(400).json({
        success: false,
        message: 'Unsupported image type. Only PNG, JPG, and WEBP are allowed.',
      });
    }

    const buffer = Buffer.from(base64Data, 'base64');

    // Max 5MB file size limit
    const MAX_SIZE = 5 * 1024 * 1024;
    if (buffer.length > MAX_SIZE) {
      return res.status(400).json({
        success: false,
        message: 'Image size exceeds the 5MB limit. Please upload a smaller image.',
      });
    }

    // Generate safe, unique filename
    const uniqueId = crypto.randomBytes(6).toString('hex');
    const safeFilename = `offering-${Date.now()}-${uniqueId}.${ext}`;

    // Write to backend uploads directory
    fs.writeFileSync(path.join(backendUploadDir, safeFilename), buffer);

    // Also write to frontend public uploads directory for instant dev availability
    if (fs.existsSync(path.dirname(frontendUploadDir))) {
      if (!fs.existsSync(frontendUploadDir)) {
        fs.mkdirSync(frontendUploadDir, { recursive: true });
      }
      fs.writeFileSync(path.join(frontendUploadDir, safeFilename), buffer);
    }

    const publicUrl = `/uploads/${safeFilename}`;

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: publicUrl,
      size: buffer.length,
      mimeType,
    });
  } catch (error) {
    console.error('[Upload] Error processing image:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process and save uploaded image.',
      error: error.message,
    });
  }
});

export default router;
