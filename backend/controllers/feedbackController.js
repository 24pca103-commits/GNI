import { getPool } from '../config/mysql.js';
import { DEFAULT_FEEDBACKS } from '../models/defaultFeedbacks.js';

// In-memory fallback if MySQL is offline
let memoryFeedbacks = [...DEFAULT_FEEDBACKS];

export const getPublicFeedbacks = async (req, res) => {
  try {
    const pool = getPool();
    if (pool) {
      const [rows] = await pool.query(
        'SELECT * FROM `feedbacks` WHERE `status` = "approved" ORDER BY `id` DESC'
      );
      if (rows && rows.length > 0) {
        return res.json({ success: true, data: rows });
      }
    }
  } catch (err) {
    console.warn('[Feedbacks] DB fetch failed, using fallback:', err.message);
  }

  const approved = memoryFeedbacks.filter((f) => f.status === 'approved');
  return res.json({ success: true, data: approved });
};

export const getAllAdminFeedbacks = async (req, res) => {
  try {
    const pool = getPool();
    if (pool) {
      const [rows] = await pool.query(
        'SELECT * FROM `feedbacks` ORDER BY `id` DESC'
      );
      return res.json({ success: true, data: rows });
    }
  } catch (err) {
    console.warn('[Feedbacks Admin] DB fetch failed, using fallback:', err.message);
  }

  return res.json({ success: true, data: memoryFeedbacks });
};

export const submitFeedback = async (req, res) => {
  try {
    const { name, role, batch, location, review, rating } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your full name.' });
    }
    if (!review || !review.trim() || review.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Review message must be at least 10 characters.' });
    }

    const cleanRating = Math.min(5, Math.max(1, Number(rating) || 5));
    const newFeedback = {
      name: name.trim(),
      role: (role || 'Heritage Enthusiast').trim(),
      batch: (batch || 'Community Member').trim(),
      location: (location || 'Tamil Nadu').trim(),
      review: review.trim(),
      rating: cleanRating,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    const pool = getPool();
    if (pool) {
      const [result] = await pool.query(
        `INSERT INTO \`feedbacks\` (\`name\`, \`role\`, \`batch\`, \`location\`, \`review\`, \`rating\`, \`status\`)
         VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
        [newFeedback.name, newFeedback.role, newFeedback.batch, newFeedback.location, newFeedback.review, newFeedback.rating]
      );
      newFeedback.id = result.insertId;
    } else {
      newFeedback.id = Date.now();
    }

    memoryFeedbacks.unshift(newFeedback);

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your feedback has been received and submitted for faculty verification.',
      data: newFeedback,
    });
  } catch (err) {
    console.error('[Feedback Submit Error]:', err);
    return res.status(500).json({ success: false, message: 'Server error while submitting feedback.' });
  }
};

export const updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid feedback status.' });
    }

    const pool = getPool();
    if (pool) {
      await pool.query('UPDATE `feedbacks` SET `status` = ? WHERE `id` = ?', [status, id]);
    }

    memoryFeedbacks = memoryFeedbacks.map((f) =>
      String(f.id) === String(id) ? { ...f, status } : f
    );

    return res.json({
      success: true,
      message: `Feedback status updated to "${status}".`,
    });
  } catch (err) {
    console.error('[Feedback Update Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to update feedback status.' });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = getPool();
    if (pool) {
      await pool.query('DELETE FROM `feedbacks` WHERE `id` = ?', [id]);
    }

    memoryFeedbacks = memoryFeedbacks.filter((f) => String(f.id) !== String(id));

    return res.json({ success: true, message: 'Feedback entry deleted successfully.' });
  } catch (err) {
    console.error('[Feedback Delete Error]:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete feedback entry.' });
  }
};
