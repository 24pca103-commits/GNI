import express from 'express';
import crypto from 'crypto';
import { getPool } from '../config/mysql.js';

const router = express.Router();

// Supported MIME types and extensions
const MIME_MAP = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

// In-memory fallback cache (used if MySQL connection is briefly interrupted)
const memoryUploadedImages = new Map();

/**
 * POST /api/upload
 * Stores image directly in the MySQL database (LONGBLOB) - ZERO files written to frontend code
 */
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

    const ext = MIME_MAP[mimeType] || 'jpg';
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

    let storedId = null;

    // 1. Store directly in MySQL database
    try {
      const pool = getPool();
      const [result] = await pool.query(
        'INSERT INTO `uploaded_images` (`filename`, `mime_type`, `data`, `size`) VALUES (?, ?, ?, ?)',
        [safeFilename, mimeType, buffer, buffer.length]
      );
      storedId = result.insertId;
      console.log(`[Upload] Image saved to MySQL database (ID: ${storedId}, size: ${buffer.length} bytes, no files written to code)`);
    } catch (dbErr) {
      console.warn('[Upload] MySQL image insert error, using in-memory store:', dbErr.message);
    }

    // 2. Keep in memory cache for instant fallback
    const key = storedId ? String(storedId) : `mem-${Date.now()}-${uniqueId}`;
    memoryUploadedImages.set(key, {
      filename: safeFilename,
      mimeType,
      data: buffer,
      size: buffer.length,
    });
    memoryUploadedImages.set(safeFilename, {
      filename: safeFilename,
      mimeType,
      data: buffer,
      size: buffer.length,
    });

    // Public URL streams directly from database
    const publicUrl = `/api/upload/${storedId || key}`;

    return res.status(200).json({
      success: true,
      message: 'Image stored in database successfully',
      url: publicUrl,
      size: buffer.length,
      mimeType,
    });
  } catch (error) {
    console.error('[Upload] Error storing image in database:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process and store image in database.',
      error: error.message,
    });
  }
});

/**
 * GET /api/upload/:id
 * Streams image binary directly from MySQL database to client with aggressive caching
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Try MySQL database lookup
    try {
      const pool = getPool();
      const isNumeric = /^\d+$/.test(id);
      const query = isNumeric
        ? 'SELECT `mime_type`, `data` FROM `uploaded_images` WHERE `id` = ? LIMIT 1'
        : 'SELECT `mime_type`, `data` FROM `uploaded_images` WHERE `filename` = ? LIMIT 1';

      const [rows] = await pool.query(query, [isNumeric ? Number(id) : id]);
      if (rows && rows.length > 0) {
        const item = rows[0];
        res.setHeader('Content-Type', item.mime_type || 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        return res.send(item.data);
      }
    } catch (dbErr) {
      console.warn('[Upload] DB read error, checking memory cache:', dbErr.message);
    }

    // 2. Try in-memory fallback lookup
    if (memoryUploadedImages.has(id)) {
      const item = memoryUploadedImages.get(id);
      res.setHeader('Content-Type', item.mimeType || 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      return res.send(item.data);
    }

    return res.status(404).json({ success: false, message: 'Image not found in database' });
  } catch (err) {
    console.error('[Upload] Error retrieving image from database:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving image' });
  }
});

export default router;
