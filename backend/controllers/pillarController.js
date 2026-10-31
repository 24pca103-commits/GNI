import { getPool } from '../config/mysql.js';
import { DEFAULT_PILLARS } from '../models/defaultPillars.js';

// In-memory cache fallback if MySQL is offline or initializing
let memoryPillars = [...DEFAULT_PILLARS];

function formatPillar(row) {
  if (!row) return row;
  let tags = row.tags;
  if (typeof tags === 'string') {
    try {
      tags = JSON.parse(tags);
    } catch {
      tags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    }
  }
  return {
    ...row,
    id: Number(row.id),
    number: String(row.number || row.id),
    is_active: Number(row.is_active) === 1,
    display_order: Number(row.display_order || 0),
    tags: Array.isArray(tags) ? tags : [],
  };
}

/**
 * Public & Admin: Get all Heritage Pillars
 */
export const getAllPillars = async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM `pillars` ORDER BY `display_order` ASC, `id` ASC');
    if (rows && rows.length > 0) {
      const data = rows.map(formatPillar);
      memoryPillars = data;
      return res.status(200).json({ success: true, count: data.length, data });
    }
    return res.status(200).json({ success: true, count: memoryPillars.length, data: memoryPillars });
  } catch (err) {
    console.warn('[Pillars] Query warning (using fallback):', err.message);
    return res.status(200).json({ success: true, count: memoryPillars.length, data: memoryPillars });
  }
};

/**
 * Public: Get single pillar by ID
 */
export const getPillarById = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = getPool();
    if (pool) {
      try {
        const [rows] = await pool.query('SELECT * FROM `pillars` WHERE `id` = ?', [id]);
        if (rows && rows.length > 0) {
          return res.status(200).json({ success: true, data: formatPillar(rows[0]) });
        }
      } catch (dbErr) {
        console.warn('[Pillars] Single query warning:', dbErr.message);
      }
    }
    const mem = memoryPillars.find((p) => String(p.id) === String(id) || String(p.number) === String(id));
    if (mem) {
      return res.status(200).json({ success: true, data: mem });
    }
    return res.status(404).json({ success: false, message: 'Heritage Pillar not found' });
  } catch (err) {
    console.warn('[Pillars] Fallback error for getPillarById:', err.message);
    const mem = memoryPillars.find((p) => String(p.id) === String(id) || String(p.number) === String(id));
    if (mem) {
      return res.status(200).json({ success: true, data: mem });
    }
    return res.status(404).json({ success: false, message: 'Heritage Pillar not found' });
  }
};

/**
 * Admin: Create a new Heritage Pillar
 */
export const createPillar = async (req, res) => {
  try {
    const {
      title,
      category = 'Traditional Crafts & Epigraphy',
      badge = 'Core Studio Track',
      image = '/artisan/pillar-painting.jpg',
      description,
      subjects = '',
      tags = [],
      display_order,
      number,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Pillar Title and Description are required fields.',
      });
    }

    const titleStr = String(title).trim();
    const descStr = String(description).trim();
    const catStr = String(category || 'Traditional Crafts & Epigraphy').trim();
    const badgeStr = String(badge || 'Core Studio Track').trim();
    const imageStr = String(image || '/artisan/pillar-painting.jpg').trim();
    const subjectsStr = Array.isArray(subjects) ? subjects.join(', ') : String(subjects || '').trim();
    const tagsArr = Array.isArray(tags) ? tags : String(tags || '').split(',').map((t) => t.trim()).filter(Boolean);
    const tagsJson = JSON.stringify(tagsArr);

    let nextNum = number ? String(number) : String(memoryPillars.length + 1);
    let order = display_order !== undefined ? Number(display_order) : Number(nextNum) || (memoryPillars.length + 1);
    let insertId = Date.now();

    try {
      const pool = getPool();
      if (pool) {
        const [countRows] = await pool.query('SELECT COUNT(*) as cnt FROM `pillars`');
        if (!number) {
          nextNum = String((countRows[0]?.cnt || memoryPillars.length) + 1);
          if (display_order === undefined) order = Number(nextNum);
        }

        const insertQuery = `
          INSERT INTO \`pillars\` (
            \`number\`, \`title\`, \`category\`, \`badge\`, \`image\`,
            \`description\`, \`subjects\`, \`tags\`, \`display_order\`, \`is_active\`
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        `;

        const [result] = await pool.query(insertQuery, [
          nextNum,
          titleStr,
          catStr,
          badgeStr,
          imageStr,
          descStr,
          subjectsStr,
          tagsJson,
          order,
        ]);
        if (result && result.insertId) {
          insertId = result.insertId;
        }
      }
    } catch (dbErr) {
      console.warn('[Pillars] MySQL create error (saving to memory fallback):', dbErr.message);
    }

    const newPillar = formatPillar({
      id: insertId,
      number: nextNum,
      title: titleStr,
      category: catStr,
      badge: badgeStr,
      image: imageStr,
      description: descStr,
      subjects: subjectsStr,
      tags: tagsJson,
      display_order: order,
      is_active: 1,
    });

    memoryPillars.push(newPillar);

    return res.status(201).json({
      success: true,
      message: 'Heritage Pillar created successfully.',
      data: newPillar,
    });
  } catch (err) {
    console.error('[Pillars] Create unexpected error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create Heritage Pillar.',
      error: err.message,
    });
  }
};

/**
 * Admin: Update an existing Heritage Pillar
 */
export const updatePillar = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      category,
      badge,
      image,
      description,
      subjects,
      tags,
      display_order,
      number,
      is_active,
    } = req.body;

    const existingMem = memoryPillars.find((p) => String(p.id) === String(id) || String(p.number) === String(id));
    const current = existingMem || {};

    const updatedTitle = title !== undefined ? String(title).trim() : (current.title || '');
    const updatedCat = category !== undefined ? String(category).trim() : (current.category || 'Traditional Crafts & Epigraphy');
    const updatedBadge = badge !== undefined ? String(badge).trim() : (current.badge || 'Core Studio Track');
    const updatedImage = image !== undefined ? String(image).trim() : (current.image || '/artisan/pillar-painting.jpg');
    const updatedDesc = description !== undefined ? String(description).trim() : (current.description || '');
    const updatedSubjects = subjects !== undefined ? (Array.isArray(subjects) ? subjects.join(', ') : String(subjects).trim()) : (current.subjects || '');
    const updatedNumber = number !== undefined ? String(number) : String(current.number || id);
    const updatedOrder = display_order !== undefined ? Number(display_order) : Number(current.display_order || 0);
    const updatedActive = is_active !== undefined ? (is_active ? 1 : 0) : (current.is_active ? 1 : 0);

    let updatedTagsJson = current.tags;
    if (tags !== undefined) {
      const tagsArr = Array.isArray(tags) ? tags : String(tags).split(',').map((t) => t.trim()).filter(Boolean);
      updatedTagsJson = JSON.stringify(tagsArr);
    } else if (typeof updatedTagsJson !== 'string') {
      updatedTagsJson = JSON.stringify(updatedTagsJson || []);
    }

    try {
      const pool = getPool();
      if (pool) {
        await pool.query(
          `UPDATE \`pillars\` SET
            \`number\` = ?, \`title\` = ?, \`category\` = ?, \`badge\` = ?,
            \`image\` = ?, \`description\` = ?, \`subjects\` = ?, \`tags\` = ?,
            \`display_order\` = ?, \`is_active\` = ?
          WHERE \`id\` = ?`,
          [
            updatedNumber,
            updatedTitle,
            updatedCat,
            updatedBadge,
            updatedImage,
            updatedDesc,
            updatedSubjects,
            updatedTagsJson,
            updatedOrder,
            updatedActive,
            id,
          ]
        );
      }
    } catch (dbErr) {
      console.warn('[Pillars] MySQL update error (saving to memory fallback):', dbErr.message);
    }

    const updatedPillar = formatPillar({
      id: Number(id),
      number: updatedNumber,
      title: updatedTitle,
      category: updatedCat,
      badge: updatedBadge,
      image: updatedImage,
      description: updatedDesc,
      subjects: updatedSubjects,
      tags: updatedTagsJson,
      display_order: updatedOrder,
      is_active: updatedActive,
    });

    memoryPillars = memoryPillars.map((p) => (String(p.id) === String(id) ? updatedPillar : p));

    return res.status(200).json({
      success: true,
      message: 'Heritage Pillar updated successfully.',
      data: updatedPillar,
    });
  } catch (err) {
    console.error('[Pillars] Update error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update Heritage Pillar.',
      error: err.message,
    });
  }
};

/**
 * Admin: Delete a Heritage Pillar
 */
export const deletePillar = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      const pool = getPool();
      if (pool) {
        const [linkedCourses] = await pool.query('SELECT COUNT(*) as cnt FROM `courses` WHERE `pillar_id` = ?', [id]);
        if (linkedCourses && linkedCourses[0]?.cnt > 0) {
          await pool.query('UPDATE `courses` SET `pillar_id` = NULL, `pillar_title` = NULL WHERE `pillar_id` = ?', [id]);
        }
        await pool.query('DELETE FROM `pillars` WHERE `id` = ?', [id]);
      }
    } catch (dbErr) {
      console.warn('[Pillars] MySQL delete warning:', dbErr.message);
    }

    memoryPillars = memoryPillars.filter((p) => String(p.id) !== String(id));

    return res.status(200).json({
      success: true,
      message: 'Heritage Pillar deleted successfully.',
    });
  } catch (err) {
    console.error('[Pillars] Delete error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete Heritage Pillar.',
      error: err.message,
    });
  }
};

export default {
  getAllPillars,
  getPillarById,
  createPillar,
  updatePillar,
  deletePillar,
};
