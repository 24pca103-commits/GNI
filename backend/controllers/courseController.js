import { getPool } from '../config/mysql.js';
import { DEFAULT_COURSES } from '../models/defaultCourses.js';
import { GNI_COURSE_PRICING, calculateTrustedFee } from '../models/pricingConfig.js';

// In-memory fallback cache if MySQL is temporarily offline
let memoryCourses = JSON.parse(JSON.stringify(DEFAULT_COURSES));

/**
 * Requirement 6: Automatically classify offering based strictly on Duration
 * 1–9 Days -> Workshop
 * 10+ Days -> Learning Journey
 */
export function determineOfferingType(durationStr) {
  if (!durationStr) return 'Workshop';
  const str = String(durationStr).trim();
  const dayMatch = str.match(/(\d+)\s*day/i);
  if (dayMatch) {
    const days = parseInt(dayMatch[1], 10);
    return days <= 9 ? 'Workshop' : 'Learning Journey';
  }
  const pureNum = str.match(/^(\d+)$/);
  if (pureNum) {
    const days = parseInt(pureNum[1], 10);
    return days <= 9 ? 'Workshop' : 'Learning Journey';
  }
  if (/month|cohort|year/i.test(str)) {
    return 'Learning Journey';
  }
  return 'Workshop';
}

function generateSlug(text) {
  return (
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-')
      .replace(/^-+|-+$/g, '') +
    '-' +
    Date.now().toString().slice(-4)
  );
}

/**
 * Calculate dynamic seat metrics & availability status for courses list
 * Available Seats = Total Seat Capacity − Confirmed Bookings
 */
async function enrichCoursesWithSeatMetrics(pool, coursesList) {
  try {
    const [bookingRows] = await pool.query(
      `SELECT LOWER(interested_skill) as skill, COUNT(*) as cnt 
       FROM \`registrations\` 
       WHERE payment_status NOT IN ('Cancelled', 'Rejected') 
       GROUP BY LOWER(interested_skill)`
    );

    const bookingMap = new Map();
    (bookingRows || []).forEach((row) => {
      bookingMap.set(String(row.skill || '').trim(), Number(row.cnt || 0));
    });

    return coursesList.map((c) => {
      const titleLower = String(c.title || '').toLowerCase().trim();
      let booked = 0;

      for (const [skill, count] of bookingMap.entries()) {
        if (skill.includes(titleLower) || titleLower.includes(skill)) {
          booked += count;
        }
      }

      const total = Number(c.seats_total ?? 50);
      const available = Math.max(0, total - booked);

      let availabilityStatus = 'Available';
      if (available === 0) {
        availabilityStatus = 'Full';
      } else if (available <= 5) {
        availabilityStatus = 'Almost Full';
      }

      const offType = determineOfferingType(c.duration);
      return {
        ...c,
        pillar_id: c.pillar_id ? Number(c.pillar_id) : null,
        pillar_title: c.pillar_title || '',
        offering_type: offType,
        seats_total: total,
        booked_seats: booked,
        seats_available: available,
        availability_status: availabilityStatus,
      };
    });
  } catch (err) {
    console.warn('[Courses] Seat metric enrichment fallback:', err.message);
    return coursesList.map((c) => {
      const total = Number(c.seats_total ?? 50);
      const available = Number(c.seats_available ?? 18);
      const booked = Math.max(0, total - available);

      let availabilityStatus = 'Available';
      if (available === 0) {
        availabilityStatus = 'Full';
      } else if (available <= 5) {
        availabilityStatus = 'Almost Full';
      }

      const offType = determineOfferingType(c.duration);
      return {
        ...c,
        pillar_id: c.pillar_id ? Number(c.pillar_id) : null,
        pillar_title: c.pillar_title || '',
        offering_type: offType,
        seats_total: total,
        booked_seats: booked,
        seats_available: available,
        availability_status: availabilityStatus,
      };
    });
  }
}

/**
 * Public: Get all active courses with real-time seat metrics
 */
export const getActiveCourses = async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT * FROM `courses` WHERE `is_active` = 1 ORDER BY `id` ASC'
    );

    const baseList =
      rows && rows.length > 0
        ? rows
        : memoryCourses.filter((c) => c.is_active === 1 || c.is_active === true);

    const enriched = await enrichCoursesWithSeatMetrics(pool, baseList);
    return res.status(200).json({ success: true, count: enriched.length, data: enriched });
  } catch (error) {
    console.warn('[Courses] MySQL fallback to in-memory store:', error.message);
    const active = memoryCourses.filter((c) => c.is_active === 1 || c.is_active === true);
    return res.status(200).json({ success: true, count: active.length, data: active, fallback: true });
  }
};

/**
 * Admin: Get all courses (active + inactive) with full seat analytics
 */
export const getAllCourses = async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM `courses` ORDER BY `id` DESC');

    const baseList = rows && rows.length > 0 ? rows : memoryCourses;
    const enriched = await enrichCoursesWithSeatMetrics(pool, baseList);

    return res.status(200).json({ success: true, count: enriched.length, data: enriched });
  } catch (error) {
    console.warn('[Courses] MySQL fallback to in-memory store:', error.message);
    return res.status(200).json({ success: true, count: memoryCourses.length, data: memoryCourses, fallback: true });
  }
};

/**
 * Admin: Create a new course offering with strict character-length validation
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
      pillar_id = null,
      pillar_title = '',
      is_active = 1,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Offering Title and Description are required.',
      });
    }

    const trimmedTitle = String(title).trim();
    const trimmedDesc = String(description).trim();
    const trimmedBadge = String(badge || '').trim();
    const trimmedDuration = String(duration || '60 Days').trim();
    const trimmedMode = String(mode || 'Studio Hands-on').trim();
    const trimmedHighlights = String(highlights || '').trim();

    // Automatically classify offering based on duration
    const autoType = determineOfferingType(trimmedDuration);
    let trimmedCategory = category ? String(category).trim() : '';
    if (!trimmedCategory || trimmedCategory === 'Workshop' || trimmedCategory === 'Learning Journey') {
      trimmedCategory = pillar_title ? `${pillar_title} • ${autoType}` : autoType;
    }

    const resolvedImageUrl = image_url && typeof image_url === 'string' && image_url.trim()
      ? image_url.trim()
      : (autoType === 'workshop' ? '/artisan/workshop.jpg' : null);

    // CHARACTER COUNT VALIDATION (Not word count)
    if (trimmedTitle.length < 5 || trimmedTitle.length > 100) {
      return res.status(400).json({
        success: false,
        message: `Offering Title must be between 5 and 100 characters (${trimmedTitle.length} entered).`,
      });
    }
    if (trimmedCategory.length < 3 || trimmedCategory.length > 60) {
      return res.status(400).json({
        success: false,
        message: `Category must be between 3 and 60 characters (${trimmedCategory.length} entered).`,
      });
    }
    if (trimmedBadge && trimmedBadge.length > 40) {
      return res.status(400).json({
        success: false,
        message: `Badge / Tag cannot exceed 40 characters (${trimmedBadge.length} entered).`,
      });
    }
    if (trimmedDuration && (trimmedDuration.length < 2 || trimmedDuration.length > 30)) {
      return res.status(400).json({
        success: false,
        message: `Duration must be between 2 and 30 characters (${trimmedDuration.length} entered).`,
      });
    }
    if (trimmedMode && (trimmedMode.length < 3 || trimmedMode.length > 40)) {
      return res.status(400).json({
        success: false,
        message: `Learning Mode must be between 3 and 40 characters (${trimmedMode.length} entered).`,
      });
    }
    if (trimmedDesc.length < 15 || trimmedDesc.length > 500) {
      return res.status(400).json({
        success: false,
        message: `Description must be between 15 and 500 characters (${trimmedDesc.length} entered).`,
      });
    }
    if (trimmedHighlights && trimmedHighlights.length > 2000) {
      return res.status(400).json({
        success: false,
        message: `Curriculum highlights / roadmap cannot exceed 2000 characters (${trimmedHighlights.length} entered).`,
      });
    }

    const parsedTotalSeats = Math.max(1, Number(seats_total) || 50);
    const parsedAvailSeats = Math.min(
      parsedTotalSeats,
      Math.max(0, Number(seats_available !== undefined ? seats_available : parsedTotalSeats))
    );

    const origPrice = Number(original_price) || 0;
    const discPrice = Number(discount_price) || 0;
    let discPercent = 0;
    if (origPrice > 0 && discPrice < origPrice) {
      discPercent = Math.round(((origPrice - discPrice) / origPrice) * 100);
    }

    const slug = req.body.slug ? String(req.body.slug).trim() : generateSlug(trimmedTitle);

    try {
      const pool = getPool();
      const insertQuery = `
        INSERT INTO \`courses\` (
          \`title\`, \`slug\`, \`category\`, \`badge\`, \`duration\`, \`mode\`,
          \`original_price\`, \`discount_price\`, \`discount_percent\`,
          \`description\`, \`highlights\`, \`image_url\`, \`seats_total\`,
          \`seats_available\`, \`pillar_id\`, \`pillar_title\`, \`is_active\`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        trimmedTitle,
        slug,
        trimmedCategory,
        trimmedBadge,
        trimmedDuration,
        trimmedMode,
        origPrice,
        discPrice,
        discPercent,
        trimmedDesc,
        trimmedHighlights,
        resolvedImageUrl,
        parsedTotalSeats,
        parsedAvailSeats,
        pillar_id ? Number(pillar_id) : null,
        pillar_title ? String(pillar_title).trim() : null,
        Number(is_active) ? 1 : 0,
      ];

      const [result] = await pool.query(insertQuery, values);
      const newCourse = {
        id: result.insertId,
        title: trimmedTitle,
        slug,
        category: trimmedCategory,
        badge: trimmedBadge,
        duration: trimmedDuration,
        mode: trimmedMode,
        original_price: origPrice,
        discount_price: discPrice,
        discount_percent: discPercent,
        description: trimmedDesc,
        highlights: trimmedHighlights,
        image_url: resolvedImageUrl,
        seats_total: parsedTotalSeats,
        booked_seats: 0,
        seats_available: parsedAvailSeats,
        availability_status: parsedAvailSeats > 5 ? 'Available' : parsedAvailSeats > 0 ? 'Almost Full' : 'Full',
        pillar_id: pillar_id ? Number(pillar_id) : null,
        pillar_title: pillar_title ? String(pillar_title).trim() : '',
        offering_type: autoType,
        is_active: Number(is_active) ? 1 : 0,
      };

      memoryCourses.unshift(newCourse);

      return res.status(201).json({
        success: true,
        message: `Offering '${trimmedTitle}' added successfully!`,
        data: newCourse,
      });
    } catch (dbError) {
      console.warn('[Courses] DB insert error, using memory fallback:', dbError.message);
      const newCourse = {
        id: Date.now(),
        title: trimmedTitle,
        slug,
        category: trimmedCategory,
        badge: trimmedBadge,
        duration: trimmedDuration,
        mode: trimmedMode,
        original_price: origPrice,
        discount_price: discPrice,
        discount_percent: discPercent,
        description: trimmedDesc,
        highlights: trimmedHighlights,
        image_url: resolvedImageUrl,
        seats_total: parsedTotalSeats,
        booked_seats: 0,
        seats_available: parsedAvailSeats,
        availability_status: parsedAvailSeats > 5 ? 'Available' : parsedAvailSeats > 0 ? 'Almost Full' : 'Full',
        pillar_id: pillar_id ? Number(pillar_id) : null,
        pillar_title: pillar_title ? String(pillar_title).trim() : '',
        offering_type: autoType,
        is_active: Number(is_active) ? 1 : 0,
      };
      memoryCourses.unshift(newCourse);

      return res.status(201).json({
        success: true,
        message: `Offering '${trimmedTitle}' added successfully! (In-memory mode)`,
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
 * Admin: Update course, seat capacity & discount offers
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
      pillar_id,
      pillar_title,
      is_active,
    } = req.body;

    const trimmedTitle = title ? String(title).trim() : null;
    const trimmedDesc = description ? String(description).trim() : null;
    const trimmedBadge = badge !== undefined ? String(badge).trim() : null;
    const trimmedDuration = duration ? String(duration).trim() : null;
    const trimmedMode = mode ? String(mode).trim() : null;
    const trimmedHighlights = highlights !== undefined ? String(highlights).trim() : null;

    let trimmedCategory = category ? String(category).trim() : null;
    if (trimmedDuration && (!trimmedCategory || trimmedCategory === 'Workshop' || trimmedCategory === 'Learning Journey')) {
      const autoType = determineOfferingType(trimmedDuration);
      trimmedCategory = pillar_title ? `${pillar_title} • ${autoType}` : autoType;
    }

    // CHARACTER COUNT VALIDATION (Not word count)
    if (trimmedTitle && (trimmedTitle.length < 5 || trimmedTitle.length > 100)) {
      return res.status(400).json({
        success: false,
        message: `Offering Title must be between 5 and 100 characters (${trimmedTitle.length} entered).`,
      });
    }
    if (trimmedCategory && (trimmedCategory.length < 3 || trimmedCategory.length > 60)) {
      return res.status(400).json({
        success: false,
        message: `Category must be between 3 and 60 characters (${trimmedCategory.length} entered).`,
      });
    }
    if (trimmedBadge && trimmedBadge.length > 40) {
      return res.status(400).json({
        success: false,
        message: `Badge / Tag cannot exceed 40 characters (${trimmedBadge.length} entered).`,
      });
    }
    if (trimmedDuration && (trimmedDuration.length < 2 || trimmedDuration.length > 30)) {
      return res.status(400).json({
        success: false,
        message: `Duration must be between 2 and 30 characters (${trimmedDuration.length} entered).`,
      });
    }
    if (trimmedMode && (trimmedMode.length < 3 || trimmedMode.length > 40)) {
      return res.status(400).json({
        success: false,
        message: `Learning Mode must be between 3 and 40 characters (${trimmedMode.length} entered).`,
      });
    }
    if (trimmedDesc && (trimmedDesc.length < 15 || trimmedDesc.length > 500)) {
      return res.status(400).json({
        success: false,
        message: `Description must be between 15 and 500 characters (${trimmedDesc.length} entered).`,
      });
    }
    if (trimmedHighlights && trimmedHighlights.length > 2000) {
      return res.status(400).json({
        success: false,
        message: `Curriculum highlights / roadmap cannot exceed 2000 characters (${trimmedHighlights.length} entered).`,
      });
    }

    const origPrice = Number(original_price) || 0;
    const discPrice = Number(discount_price) || 0;
    let discPercent = 0;
    if (origPrice > 0 && discPrice < origPrice) {
      discPercent = Math.round(((origPrice - discPrice) / origPrice) * 100);
    }

    try {
      const pool = getPool();

      // Retrieve current course details & confirmed bookings
      const [existingCourse] = await pool.query('SELECT * FROM `courses` WHERE `id` = ?', [id]);
      const current = existingCourse[0] || {};
      const courseTitleToMatch = trimmedTitle || current.title || '';

      const [bookingRows] = await pool.query(
        `SELECT COUNT(*) as cnt FROM \`registrations\` 
         WHERE (LOWER(interested_skill) LIKE ? OR interested_skill = ?) 
         AND payment_status NOT IN ('Cancelled', 'Rejected')`,
        [`%${courseTitleToMatch.toLowerCase()}%`, courseTitleToMatch]
      );
      const confirmedBookings = bookingRows[0]?.cnt || 0;

      // VALIDATE SEAT CAPACITY: Total seat capacity can NEVER be reduced below confirmed bookings!
      const requestedTotalSeats = seats_total !== undefined ? Number(seats_total) : (current.seats_total || 50);

      if (requestedTotalSeats < confirmedBookings) {
        return res.status(400).json({
          success: false,
          message: `Total seat capacity (${requestedTotalSeats}) cannot be reduced below the ${confirmedBookings} currently confirmed bookings.`,
        });
      }

      // Automatically calculate available seats:
      // Available Seats = Total Seat Capacity − Confirmed Bookings
      const calculatedAvailableSeats = Math.max(0, requestedTotalSeats - confirmedBookings);

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
          \`pillar_id\` = COALESCE(?, \`pillar_id\`),
          \`pillar_title\` = COALESCE(?, \`pillar_title\`),
          \`is_active\` = ?
        WHERE \`id\` = ?
      `;

      const values = [
        trimmedTitle,
        trimmedCategory,
        trimmedBadge,
        trimmedDuration,
        trimmedMode,
        origPrice,
        discPrice,
        discPercent,
        trimmedDesc,
        trimmedHighlights,
        image_url && typeof image_url === 'string' ? image_url.trim() : null,
        requestedTotalSeats,
        calculatedAvailableSeats,
        pillar_id !== undefined ? (pillar_id ? Number(pillar_id) : null) : null,
        pillar_title !== undefined ? String(pillar_title).trim() : null,
        is_active !== undefined ? (Number(is_active) ? 1 : 0) : 1,
        id,
      ];

      await pool.query(updateQuery, values);
    } catch (dbErr) {
      console.warn('[Courses] DB update error, falling back to memory:', dbErr.message);
    }

    // Update memory cache
    const idx = memoryCourses.findIndex((c) => String(c.id) === String(id));
    if (idx !== -1) {
      const prev = memoryCourses[idx];
      const newTotal = seats_total !== undefined ? Number(seats_total) : prev.seats_total;
      const booked = prev.booked_seats || 0;
      const newAvailable = Math.max(0, newTotal - booked);

      memoryCourses[idx] = {
        ...prev,
        ...(trimmedTitle && { title: trimmedTitle }),
        ...(trimmedCategory && { category: trimmedCategory }),
        ...(trimmedBadge !== null && { badge: trimmedBadge }),
        ...(trimmedDuration && { duration: trimmedDuration }),
        ...(trimmedMode && { mode: trimmedMode }),
        original_price: origPrice,
        discount_price: discPrice,
        discount_percent: discPercent,
        ...(trimmedDesc && { description: trimmedDesc }),
        ...(trimmedHighlights !== null && { highlights: trimmedHighlights }),
        ...(image_url !== undefined && { image_url: image_url && typeof image_url === 'string' ? image_url.trim() : null }),
        seats_total: newTotal,
        seats_available: newAvailable,
        availability_status: newAvailable === 0 ? 'Full' : newAvailable <= 5 ? 'Almost Full' : 'Available',
        ...(pillar_id !== undefined && { pillar_id: pillar_id ? Number(pillar_id) : null }),
        ...(pillar_title !== undefined && { pillar_title }),
        offering_type: determineOfferingType(trimmedDuration || prev.duration),
        is_active: is_active !== undefined ? (Number(is_active) ? 1 : 0) : prev.is_active,
      };
    }

    return res.status(200).json({
      success: true,
      message: 'Offering & seat configuration updated successfully!',
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
      message: `Offering status changed to ${newStatus ? 'Active' : 'Inactive'}.`,
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
      message: 'Course offering deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete course',
      error: error.message,
    });
  }
};

/**
 * Public: Get course pricing configuration with supported durations & fees
 */
export const getPricingConfig = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      count: GNI_COURSE_PRICING.length,
      data: GNI_COURSE_PRICING,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve pricing configuration',
      error: error.message,
    });
  }
};

/**
 * Public/Protected: Calculate trusted course fee based on course and duration
 */
export const calculateCourseFee = async (req, res) => {
  try {
    const { courseId, courseName, duration } = req.body;
    const identifier = courseName || courseId;

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Course Name or Course ID is required.',
      });
    }

    const calculated = calculateTrustedFee(identifier, duration);
    if (!calculated) {
      return res.status(404).json({
        success: false,
        message: 'Pricing not found for the requested course/duration.',
      });
    }

    return res.status(200).json({
      success: true,
      data: calculated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate course fee',
      error: error.message,
    });
  }
};
