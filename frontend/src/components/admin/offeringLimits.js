/**
 * Character limits for the offering editor. Sized to what the public Workshop and
 * Learning Journey sections can show without overflowing (e.g. titles stay within
 * two lines on the picker cards). The server accepts slightly more, so these are
 * the effective limits.
 */
export const LIMITS = {
  title: { min: 5, max: 70 },
  badge: { min: 0, max: 28 },
  description: { min: 30, max: 320 },
  mode: { min: 3, max: 30 },
  durationLabel: { min: 0, max: 20 },
  inclusions: { min: 0, max: 160 },
  specLabel: { min: 2, max: 24 },
  specValue: { min: 2, max: 70 },
  takeaway: { min: 3, max: 70 },
  moduleDay: { min: 0, max: 16 },
  moduleTitle: { min: 3, max: 60 },
  moduleDesc: { min: 0, max: 180 },
  phaseTitle: { min: 3, max: 50 },
  phaseDetails: { min: 10, max: 220 },
  phaseOutcome: { min: 0, max: 90 },
  phaseMaterials: { min: 0, max: 160 },
  fieldVisitTitle: { min: 0, max: 60 },
  fieldVisitDescription: { min: 10, max: 260 },
};

export const MAX_MODULES = 12;
export const MAX_PHASES = 10;
export const MAX_SPECS = 6;
export const MAX_TAKEAWAYS = 8;
export const MAX_PRICE = 500000;
export const MAX_SEATS = 500;

export const DAY_RANGE = {
  workshop: { min: 1, max: 9 },
  journey: { min: 10, max: 365 },
};

export const PRESET_IMAGES = [
  { label: 'Heritage Workshop Studio', url: '/artisan/workshop.jpg' },
  { label: 'Lost-Wax Metallurgy Forge', url: '/artisan/pillar-metal.jpg' },
  { label: 'Sacred Iconography Studio', url: '/artisan/studio-iconography.jpg' },
  { label: 'Epigraphy & Tamili Scripts', url: '/artisan/pillar-epigraphy.jpg' },
  { label: 'Natural Mineral Pigments', url: '/artisan/studio-pigments.jpg' },
  { label: 'Architectural Craft Applications', url: '/artisan/pillar-applications.jpg' },
  { label: 'Heritage Creator Journey', url: '/artisan/pedagogy-practice.jpg' },
];
