/**
 * Customer-facing offering details stored as JSON in `courses.details`.
 *
 * {
 *   inclusions: string,                       // what the fee covers
 *   specs: [{ label: string, value: string }], // "At a glance" facts
 *   takeaways: string[],                      // what the student takes home
 *   field_visit: { enabled, title, description }
 * }
 */

export const DETAILS_LIMITS = {
  inclusions: 200,
  specsMax: 6,
  specLabel: 30,
  specValue: 90,
  takeawaysMax: 8,
  takeaway: 90,
  fieldVisitTitle: 80,
  fieldVisitDescription: 300,
};

const clip = (value, max) => String(value ?? '').trim().slice(0, max);

export function emptyDetails() {
  return {
    inclusions: '',
    specs: [],
    takeaways: [],
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
  const specs = (Array.isArray(obj.specs) ? obj.specs : [])
    .map((s) => ({ label: clip(s?.label, L.specLabel), value: clip(s?.value, L.specValue) }))
    .filter((s) => s.label && s.value)
    .slice(0, L.specsMax);

  const takeaways = (Array.isArray(obj.takeaways) ? obj.takeaways : [])
    .map((t) => clip(t, L.takeaway))
    .filter(Boolean)
    .slice(0, L.takeawaysMax);

  const fv = obj.field_visit && typeof obj.field_visit === 'object' ? obj.field_visit : {};

  return {
    inclusions: clip(obj.inclusions, L.inclusions),
    specs,
    takeaways,
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
