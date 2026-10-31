/**
 * Shared helpers for turning admin-managed course rows into what the public
 * Workshop and Learning Journey sections render. Nothing here invents content:
 * a field the admin left empty stays empty and the UI hides that block.
 */

export function emptyDetails() {
  return {
    inclusions: '',
    specs: [],
    takeaways: [],
    field_visit: { enabled: false, title: '', description: '' },
  };
}

/** Normalise `course.details` (object, JSON string or null). */
export function parseDetails(raw) {
  let obj = raw;
  if (typeof raw === 'string') {
    try {
      obj = JSON.parse(raw);
    } catch (_) {
      obj = null;
    }
  }
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return emptyDetails();
  const fv = obj.field_visit && typeof obj.field_visit === 'object' ? obj.field_visit : {};
  return {
    inclusions: String(obj.inclusions || '').trim(),
    specs: (Array.isArray(obj.specs) ? obj.specs : [])
      .map((s) => ({ label: String(s?.label || '').trim(), value: String(s?.value || '').trim() }))
      .filter((s) => s.label && s.value),
    takeaways: (Array.isArray(obj.takeaways) ? obj.takeaways : [])
      .map((t) => String(t || '').trim())
      .filter(Boolean),
    field_visit: {
      enabled: Boolean(fv.enabled),
      title: String(fv.title || '').trim(),
      description: String(fv.description || '').trim(),
    },
  };
}

function parseJsonArray(highlights) {
  if (typeof highlights !== 'string') return Array.isArray(highlights) ? highlights : null;
  const trimmed = highlights.trim();
  if (!trimmed.startsWith('[')) return null;
  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed : null;
  } catch (_) {
    return null;
  }
}

function splitLegacyList(highlights) {
  return String(highlights || '')
    .split(/[;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Workshop modules: [{ day, title, desc }] */
export function parseWorkshopModules(highlights) {
  const json = parseJsonArray(highlights);
  if (json) {
    return json
      .map((m) => ({
        day: String(m.day || m.period || '').trim(),
        title: String(m.title || m.name || '').trim(),
        desc: String(m.desc || m.details || m.description || '').trim(),
      }))
      .filter((m) => m.title);
  }
  // Legacy "Title: description; Title 2" strings
  return splitLegacyList(highlights).map((part) => {
    const idx = part.indexOf(':');
    return idx > 0
      ? { day: '', title: part.slice(0, idx).trim(), desc: part.slice(idx + 1).trim() }
      : { day: '', title: part, desc: '' };
  });
}

const hasDayRange = (period) => /day/i.test(period) && /\d/.test(period);

/** Split `totalDays` evenly across `count` phases: ["Day 1–15", "Day 16–30", ...] */
export function evenDayRanges(totalDays, count) {
  if (!totalDays || !count) return Array(count).fill('');
  const base = Math.floor(totalDays / count);
  const extra = totalDays % count;
  let start = 1;
  return Array.from({ length: count }, (_, i) => {
    const len = Math.max(1, base + (i < extra ? 1 : 0));
    const end = Math.min(totalDays, start + len - 1);
    const label = start === end ? `Day ${start}` : `Day ${start}–${end}`;
    start = end + 1;
    return label;
  });
}

/**
 * Journey phases: [{ period, title, details, outcome, materials[] }]
 * Phases saved without a day range (e.g. legacy "Phase 1: Title") get one by
 * splitting `totalDays` evenly, so every phase shows real days.
 */
export function parseJourneyPhases(highlights, totalDays = null) {
  const json = parseJsonArray(highlights);
  let phases;
  if (json) {
    phases = json
      .map((p) => ({
        period: String(p.period || '').trim(),
        title: String(p.title || '').trim(),
        details: String(p.details || p.desc || '').trim(),
        outcome: String(p.outcome || '').trim(),
        materials: (Array.isArray(p.materials) ? p.materials : String(p.materials || '').split(','))
          .map((m) => String(m).trim())
          .filter(Boolean),
      }))
      .filter((p) => p.title);
  } else {
    // Legacy "Phase 1: Title; Day 11–20: Title" strings
    phases = splitLegacyList(highlights).map((part) => {
      const match = part.match(/^((?:Day|Phase)\s*[\d–-]+)\s*:\s*(.+)$/i);
      return {
        period: match && /^day/i.test(match[1]) ? match[1] : '',
        title: match ? match[2].trim() : part,
        details: '',
        outcome: '',
        materials: [],
      };
    });
  }

  if (phases.length && !phases.every((p) => hasDayRange(p.period))) {
    const ranges = evenDayRanges(totalDays, phases.length);
    phases = phases.map((p, i) => ({ ...p, period: ranges[i] }));
  }
  return phases;
}

/** Number of days covered by a "Day 11–20" style period (1 if unknown). */
export function periodLength(period) {
  const nums = String(period || '').match(/\d+/g);
  if (!nums || nums.length < 2) return 1;
  return Math.max(1, parseInt(nums[1], 10) - parseInt(nums[0], 10) + 1);
}

export function getDayCount(duration) {
  const match = String(duration || '').match(/(\d+)\s*day/i) || String(duration || '').match(/^\s*(\d+)\s*$/);
  return match ? parseInt(match[1], 10) : null;
}

/** Mirrors backend `determineOfferingType`: 1–9 days → workshop, 10+ → journey. */
export function getOfferingKind(course) {
  if (!course) return 'workshop';
  const type = String(course.offering_type || '').toLowerCase();
  if (type.includes('journey')) return 'journey';
  if (type.includes('workshop')) return 'workshop';
  const days = getDayCount(course.duration);
  if (days !== null) return days <= 9 ? 'workshop' : 'journey';
  if (/month|cohort|year/i.test(String(course.duration || ''))) return 'journey';
  return 'workshop';
}

export function formatINR(value) {
  const n = Number(value) || 0;
  return `₹${n.toLocaleString('en-IN')}`;
}

export function getPricing(course) {
  const original = Number(course.original_price) || 0;
  const price = Number(course.discount_price) || original;
  const savePercent =
    original > price && original > 0 ? Math.round(((original - price) / original) * 100) : 0;
  return { price, original: original > price ? original : 0, savePercent };
}

export function getSeats(course) {
  const total = Math.max(0, Number(course.seats_total) || 0);
  const available = Math.max(0, Math.min(total, Number(course.seats_available ?? total) || 0));
  const isFull = total > 0 && available === 0;
  const isLow = !isFull && available > 0 && available <= 5;
  const filledPercent = total > 0 ? Math.round(((total - available) / total) * 100) : 0;
  return { total, available, isFull, isLow, filledPercent };
}

export function registerLink(course) {
  const durationLabel = String(course.duration || '').match(/\d+\s*day[s]?/i)?.[0] || course.duration || '';
  return `/register?course=${encodeURIComponent(course.title)}&duration=${encodeURIComponent(durationLabel)}`;
}

/** Keep canonical offerings in their established order; anything new from admin follows by id. */
export function sortOfferings(list, canonicalIds = []) {
  return [...list].sort((a, b) => {
    const ai = canonicalIds.indexOf(Number(a.id));
    const bi = canonicalIds.indexOf(Number(b.id));
    const ar = ai === -1 ? Infinity : ai;
    const br = bi === -1 ? Infinity : bi;
    if (ar !== br) return ar - br;
    return Number(a.id) - Number(b.id);
  });
}
