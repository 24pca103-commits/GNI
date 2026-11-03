/**
 * Customer-facing offering details stored as JSON in `courses.details`.
 *
 * {
 *   inclusions: string,                       // what the fee covers
 *   field_visit: { enabled, title, description }
 * }
 */

export const DETAILS_LIMITS = {
  inclusions: 200,
  fieldVisitTitle: 80,
  fieldVisitDescription: 300,
};

const clip = (value, max) => String(value ?? '').trim().slice(0, max);

export function emptyDetails() {
  return {
    inclusions: '',
    field_visit: { enabled: false, title: '', description: '' },
  };
}

/** Normalise any stored/incoming value (object, JSON string, null) into a clean details object. */
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

  const L = DETAILS_LIMITS;
  const fv = obj.field_visit && typeof obj.field_visit === 'object' ? obj.field_visit : {};

  return {
    inclusions: clip(obj.inclusions, L.inclusions),
    field_visit: {
      enabled: Boolean(fv.enabled),
      title: clip(fv.title, L.fieldVisitTitle),
      description: clip(fv.description, L.fieldVisitDescription),
    },
  };
}

/** Serialise incoming details for storage. Returns null when the field was not provided. */
export function serializeDetails(raw) {
  if (raw === undefined || raw === null || raw === '') return null;
  return JSON.stringify(parseDetails(raw));
}
