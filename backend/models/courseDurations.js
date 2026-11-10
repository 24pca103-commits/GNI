/**
 * Duration options for an offering, stored as JSON in `courses.durations`:
 *   [{ days, label, fee, original_price }]
 *
 * The first option is the main one: it decides Workshop vs Journey and the price
 * shown on the website, and is mirrored into `courses.duration`, `discount_price`
 * and `original_price`. The Register page and the fee charged at registration are
 * read from these options (see priceForCourse).
 */

export const DURATION_LIMITS = {
  maxOptions: 6,
  minDays: 1,
  maxDays: 365,
  labelMax: 20,
  maxPrice: 2000000,
};

const toInt = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n) : NaN;
};

/** "1 Day", "7 Days Intensive" */
export function durationText(opt) {
  const days = toInt(opt.days);
  const label = String(opt.label || '').trim();
  return `${days} ${days === 1 ? 'Day' : 'Days'}${label ? ` ${label}` : ''}`;
}

/** Split "1 Day Pilot Event" into { days: 1, label: 'Pilot Event' }. */
export function splitDurationText(text) {
  const m = String(text || '').match(/^\s*(\d+)\s*days?\b\s*(.*)$/i);
  if (!m) return null;
  return { days: Number(m[1]), label: m[2].trim() };
}

/** Normalise stored/incoming options; falls back to the course's single duration and prices. */
export function parseDurations(raw, course = {}) {
  let list = raw;
  if (typeof raw === 'string') {
    try {
      list = JSON.parse(raw);
    } catch (_) {
      list = null;
    }
  }
  const L = DURATION_LIMITS;
  const clean = (Array.isArray(list) ? list : [])
    .map((o) => {
      const fee = toInt(o.fee);
      const original = toInt(o.original_price ?? o.originalPrice);
      return {
        days: toInt(o.days),
        label: String(o.label || '').trim().slice(0, L.labelMax),
        fee,
        original_price: Number.isFinite(original) && original > fee ? original : fee,
      };
    })
    .filter((o) => o.days >= L.minDays && o.days <= L.maxDays && o.fee > 0 && o.fee <= L.maxPrice)
    .slice(0, L.maxOptions);

  if (clean.length) return clean;

  // Legacy offerings: one option from the course's own duration and prices
  const parsed = splitDurationText(course.duration);
  const fee = toInt(course.discount_price) || toInt(course.original_price);
  if (!parsed || !(fee > 0)) return [];
  const original = toInt(course.original_price);
  return [{ days: parsed.days, label: parsed.label, fee, original_price: original > fee ? original : fee }];
}

/**
 * Validate options sent by the admin. Returns { options, error }.
 * `type` is 'workshop' (main option 1–9 days) or 'journey' (main option 10+ days).
 */
export function validateDurations(raw, type) {
  const L = DURATION_LIMITS;
  const list = Array.isArray(raw) ? raw : [];
  if (list.length === 0) return { error: 'Add at least one duration option with a fee.' };
  if (list.length > L.maxOptions) return { error: `A maximum of ${L.maxOptions} duration options is allowed.` };

  const options = [];
  const seen = new Set();
  for (let i = 0; i < list.length; i++) {
    const o = list[i] || {};
    const days = toInt(o.days);
    const label = String(o.label || '').trim();
    const fee = toInt(o.fee);
    const original = o.original_price === '' || o.original_price === undefined || o.original_price === null ? fee : toInt(o.original_price);
    const n = i + 1;
    if (!(days >= L.minDays && days <= L.maxDays)) return { error: `Duration option ${n}: days must be between ${L.minDays} and ${L.maxDays}.` };
    if (type === 'workshop' && days > 9) return { error: `Duration option ${n}: Double digits not allowed for Workshop (${days} days). Workshops must strictly be 1–9 days (single digit).` };
    if (type === 'journey' && days < 10) return { error: `Duration option ${n}: Single digit not allowed for Learning Journey (${days} days). Learning journeys must start from 10 days (10+ days).` };
    if (label.length > L.labelMax) return { error: `Duration option ${n}: label can be at most ${L.labelMax} characters.` };
    if (!Number.isFinite(fee) || fee <= 0) return { error: `Duration option ${n}: enter an offer fee greater than ₹0.` };
    if (fee > L.maxPrice) return { error: `Duration option ${n}: offer fee cannot exceed ₹${L.maxPrice.toLocaleString('en-IN')}.` };
    if (o.original_price !== '' && o.original_price !== undefined && o.original_price !== null) {
      if (!Number.isFinite(original) || original < fee) {
        return { error: `Duration option ${n}: regular fee (₹${Number(original || 0).toLocaleString('en-IN')}) must be equal to or higher than offer fee (₹${fee.toLocaleString('en-IN')}).` };
      }
      if (original > L.maxPrice) {
        return { error: `Duration option ${n}: regular fee cannot exceed ₹${L.maxPrice.toLocaleString('en-IN')}.` };
      }
    }
    const key = durationText({ days, label }).toLowerCase();
    if (seen.has(key)) return { error: `Duration option ${n} repeats "${durationText({ days, label })}".` };
    seen.add(key);
    options.push({ days, label, fee, original_price: original });
  }

  const main = options[0].days;
  if (type === 'workshop' && main > 9) return { error: 'The main duration of a workshop must be 1–9 days.' };
  if (type === 'journey' && main < 10) return { error: 'The main duration of a learning journey must be 10 days or more.' };
  return { options };
}

/** Columns mirrored from the main (first) option. */
export function mainOptionColumns(options) {
  const main = options[0];
  const discountPercent =
    main.original_price > main.fee ? Math.round(((main.original_price - main.fee) / main.original_price) * 100) : 0;
  return {
    duration: durationText(main),
    discount_price: main.fee,
    original_price: main.original_price,
    discount_percent: discountPercent,
  };
}

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

/** Fee breakdown in the shape the Register page and registration emails use. */
export function feeBreakdown(courseTitle, opt, mode = '') {
  const discount = Math.max(0, opt.original_price - opt.fee);
  return {
    courseName: courseTitle,
    duration: durationText(opt),
    fee: opt.fee,
    originalPrice: opt.original_price,
    discount,
    taxes: 0,
    totalPayable: opt.fee,
    formattedFee: inr(opt.fee),
    formattedOriginal: inr(opt.original_price),
    formattedDiscount: inr(discount),
    formattedTotal: inr(opt.fee),
    mode,
    note: '',
  };
}

/** Register-page catalog entry for an offering. */
export function catalogEntry(course, isJourney) {
  const options = parseDurations(course.durations, course);
  return {
    id: String(course.slug || course.id),
    courseId: course.id,
    courseName: course.title,
    pillarId: course.pillar_id ? Number(course.pillar_id) : null,
    pillarTitle: course.pillar_title || '',
    category: isJourney ? 'Learning Journey' : 'Workshop',
    description: course.description || '',
    durations: options.map((o) => feeBreakdown(course.title, o, course.mode || '')),
  };
}

/**
 * Find the active offering and duration option a student chose, from the database.
 * Returns the fee breakdown, or null when the course or duration is not offered.
 */
export async function priceForCourse(pool, courseName, durationLabel) {
  const name = String(courseName || '').trim();
  if (!name) return null;
  const [rows] = await pool.query(
    'SELECT * FROM `courses` WHERE `is_active` = 1 AND LOWER(`title`) = LOWER(?) LIMIT 1',
    [name]
  );
  const course = rows && rows[0];
  if (!course) return null;
  const options = parseDurations(course.durations, course);
  if (!options.length) return null;
  const wanted = String(durationLabel || '').trim().toLowerCase();
  const opt = wanted
    ? options.find((o) => durationText(o).toLowerCase() === wanted) ||
      options.find((o) => {
        const p = splitDurationText(wanted);
        return p && p.days === o.days;
      })
    : options[0];
  if (!opt) return null;
  return feeBreakdown(course.title, opt, course.mode || '');
}
