import { getPool } from '../config/mysql.js';
import { DEFAULT_COURSES } from '../models/defaultCourses.js';

// In-memory fallback cache if MySQL is temporarily offline
let memoryCourses = JSON.parse(JSON.stringify(DEFAULT_COURSES));

function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '') + '-' + Date.now().toString().slice(-4);
}

/**
 * Public: Get all active courses
 */
export const getActiveCourses = async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT * FROM `courses` WHERE `is_active` = 1 ORDER BY `id` ASC'
    );
    if (rows && rows.length > 0) {
      return res.status(200).json({ success: true, count: rows.length, data: rows });
    }
    // If table is empty, return memoryCourses active
    const active = memoryCourses.filter((c) => c.is_active === 1 || c.is_active === true);
    return res.status(200).json({ success: true, count: active.length, data: active });
  } catch (error) {
    console.warn('[Courses] MySQL fallback to in-memory store:', error.message);
    const active = memoryCourses.filter((c) => c.is_active === 1 || c.is_active === true);
    return res.status(200).json({ success: true, count: active.length, data: active, fallback: true });
  }
};

/**
 * Admin: Get all courses (active + inactive)
 */
export const getAllCourses = async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM `courses` ORDER BY `id` DESC');
    if (rows && rows.length > 0) {
      return res.status(200).json({ success: true, count: rows.length, data: rows });
    }
    return res.status(200).json({ success: true, count: memoryCourses.length, data: memoryCourses });
  } catch (error) {
    console.warn('[Courses] MySQL fallback to in-memory store:', error.message);
    return res.status(200).json({ success: true, count: memoryCourses.length, data: memoryCourses, fallback: true });
  }
};

/**
 * Admin: Create a new course
 */
export const createCourse = async (req, res) => {
  try {
    const {
      title,
      category,
      badge = 'New Cohort',
      duration = '60 Days',
      mode = 'Studio Hands-on',
      original_price = 9999,
      discount_price = 4999,
      description,
      highlights = '',
      image_url = '/artisan/workshop.jpg',
      seats_total = 50,
      seats_available = 20,
      is_active = 1,
    } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title, Category, and Description are required.',
      });
    }

    const origPrice = Number(original_price) || 0;
    const discPrice = Number(discount_price) || 0;
    let discPercent = 0;
    if (origPrice > 0 && discPrice < origPrice) {
      discPercent = Math.round(((origPrice - discPrice) / origPrice) * 100);
    }

    const slug = req.body.slug ? req.body.slug.trim() : generateSlug(title);

    try {
      const pool = getPool();
      const insertQuery = `
        INSERT INTO \`courses\` (
          \`title\`, \`slug\`, \`category\`, \`badge\`, \`duration\`, \`mode\`,
          \`original_price\`, \`discount_price\`, \`discount_percent\`,
          \`description\`, \`highlights\`, \`image_url\`, \`seats_total\`,
          \`seats_available\`, \`is_active\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        title.trim(),
        slug,
        category.trim(),
        badge.trim(),
        duration.trim(),
        mode.trim(),
        origPrice,
        discPrice,
        discPercent,
        description.trim(),
        highlights ? highlights.trim() : '',
        image_url.trim() || '/artisan/workshop.jpg',
        Number(seats_total) || 50,
        Number(seats_available) || 20,
        Number(is_active) ? 1 : 0,
      ];

      const [result] = await pool.query(insertQuery, values);
      const newCourse = {
        id: result.insertId,
        title: title.trim(),
        slug,
        category: category.trim(),
        badge: badge.trim(),
        duration: duration.trim(),
        mode: mode.trim(),
        original_price: origPrice,
        discount_price: discPrice,
        discount_percent: discPercent,
        description: description.trim(),
        highlights: highlights ? highlights.trim() : '',
        image_url: image_url.trim() || '/artisan/workshop.jpg',
        seats_total: Number(seats_total) || 50,
        seats_available: Number(seats_available) || 20,
        is_active: Number(is_active) ? 1 : 0,
      };

      // Also update memory cache
      memoryCourses.unshift(newCourse);

      return res.status(201).json({
        success: true,
        message: `Course '${title}' added successfully!`,
        data: newCourse,
      });
    } catch (dbError) {
      // Fallback in-memory
      console.warn('[Courses] DB insert error, using memory fallback:', dbError.message);
      const newCourse = {
        id: Date.now(),
        title: title.trim(),
        slug,
        category: category.trim(),
        badge: badge.trim(),
        duration: duration.trim(),
        mode: mode.trim(),
        original_price: origPrice,
        discount_price: discPrice,
        discount_percent: discPercent,
        description: description.trim(),
        highlights: highlights ? highlights.trim() : '',
        image_url: image_url.trim() || '/artisan/workshop.jpg',
        seats_total: Number(seats_total) || 50,
        seats_available: Number(seats_available) || 20,
        is_active: Number(is_active) ? 1 : 0,
      };
      memoryCourses.unshift(newCourse);
      return res.status(201).json({
        success: true,
        message: `Course '${title}' added successfully! (In-memory mode)`,
        data: newCourse,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create course',
      error: error.message,
    });
  }
};

/**
 * Admin: Update an existing course & discount offers
 */
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      category,
      badge,
      duration,
      mode,
      original_price,
      discount_price,
      description,
      highlights,
      image_url,
      seats_total,
      seats_available,
      is_active,
    } = req.body;

    const origPrice = Number(original_price) || 0;
    const discPrice = Number(discount_price) || 0;
    let discPercent = 0;
    if (origPrice > 0 && discPrice < origPrice) {
      discPercent = Math.round(((origPrice - discPrice) / origPrice) * 100);
    }

    try {
      const pool = getPool();
      const updateQuery = `
        UPDATE \`courses\` SET
          \`title\` = COALESCE(?, \`title\`),
          \`category\` = COALESCE(?, \`category\`),
          \`badge\` = COALESCE(?, \`badge\`),
          \`duration\` = COALESCE(?, \`duration\`),
          \`mode\` = COALESCE(?, \`mode\`),
          \`original_price\` = ?,
          \`discount_price\` = ?,
          \`discount_percent\` = ?,
          \`description\` = COALESCE(?, \`description\`),
          \`highlights\` = COALESCE(?, \`highlights\`),
          \`image_url\` = COALESCE(?, \`image_url\`),
          \`seats_total\` = ?,
          \`seats_available\` = ?,
          \`is_active\` = ?
        WHERE \`id\` = ?
      `;

      const values = [
        title ? title.trim() : null,
        category ? category.trim() : null,
        badge ? badge.trim() : null,
        duration ? duration.trim() : null,
        mode ? mode.trim() : null,
        origPrice,
        discPrice,
        discPercent,
        description ? description.trim() : null,
        highlights !== undefined ? highlights.trim() : null,
        image_url ? image_url.trim() : null,
        Number(seats_total) || 50,
        Number(seats_available) || 20,
        is_active !== undefined ? (Number(is_active) ? 1 : 0) : 1,
        id,
      ];

      await pool.query(updateQuery, values);
    } catch (dbErr) {
      console.warn('[Courses] DB update error, falling back to memory:', dbErr.message);
    }

    // Update memory
    const idx = memoryCourses.findIndex((c) => String(c.id) === String(id));
    if (idx !== -1) {
      memoryCourses[idx] = {
        ...memoryCourses[idx],
        ...(title && { title: title.trim() }),
        ...(category && { category: category.trim() }),
        ...(badge && { badge: badge.trim() }),
        ...(duration && { duration: duration.trim() }),
        ...(mode && { mode: mode.trim() }),
        original_price: origPrice,
        discount_price: discPrice,
        discount_percent: discPercent,
        ...(description && { description: description.trim() }),
        ...(highlights !== undefined && { highlights: highlights.trim() }),
        ...(image_url && { image_url: image_url.trim() }),
        seats_total: Number(seats_total) || memoryCourses[idx].seats_total,
        seats_available: Number(seats_available) || memoryCourses[idx].seats_available,
        is_active: is_active !== undefined ? (Number(is_active) ? 1 : 0) : memoryCourses[idx].is_active,
      };
    }

    return res.status(200).json({
      success: true,
      message: 'Course & Discount offers updated successfully!',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update course',
      error: error.message,
    });
  }
};

/**
 * Admin: Toggle course active status
 */
export const toggleCourseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    const newStatus = Number(is_active) ? 1 : 0;

    try {
      const pool = getPool();
      await pool.query('UPDATE `courses` SET `is_active` = ? WHERE `id` = ?', [newStatus, id]);
    } catch (e) {
      console.warn('[Courses] DB toggle status fallback:', e.message);
    }

    const idx = memoryCourses.findIndex((c) => String(c.id) === String(id));
    if (idx !== -1) {
      memoryCourses[idx].is_active = newStatus;
    }

    return res.status(200).json({
      success: true,
      message: `Course status changed to ${newStatus ? 'Active' : 'Inactive'}.`,
      is_active: newStatus,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle course status',
      error: error.message,
    });
  }
};

/**
 * Admin: Delete a course
 */
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      const pool = getPool();
      await pool.query('DELETE FROM `courses` WHERE `id` = ?', [id]);
    } catch (e) {
      console.warn('[Courses] DB delete fallback:', e.message);
    }

    memoryCourses = memoryCourses.filter((c) => String(c.id) !== String(id));

    return res.status(200).json({
      success: true,
      message: 'Course deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete course',
      error: error.message,
    });
  }
};
