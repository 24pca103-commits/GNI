/**
 * Default Canonical Course Offerings for Global Nagas Institute (GNI)
 * Exactly 4 canonical offerings: 2 Workshops + 2 Learning Journeys
 */

import { DEFAULT_COURSE_CONTENT } from './offeringContent';

const BASE_COURSES = [
  // ==========================================
  // Workshops (1-9 Days) — Exactly 2
  // ==========================================
  {
    id: 101,
    title: 'Ancient Tamil Art & Heritage Experience Workshop',
    slug: 'ancient-tamil-art-heritage-workshop',
    category: 'Workshop',
    badge: 'Immersive Masterclass',
    duration: '1 Day Masterclass',
    mode: 'Studio Hands-on',
    original_price: 9999.00,
    discount_price: 4999.00,
    discount_percent: 50,
    description: 'A one-day hands-on introduction to Tamil heritage, art, and craftsmanship. Includes raw materials, live inscription plate, and craft kit.',
    highlights: 'Prehistoric Rock Painting; Tamili Writing; Iconography Basics; Naga Jewellery Concepts; Temple Architecture; Copper Plate Inscription Making',
    image_url: '/artisan/workshop.jpg',
    seats_total: 50,
    seats_available: 28,
    is_active: 1,
    pillar_id: 4,
    pillar_title: 'Heritage Applications & Interior Crafts',
  },
  {
    id: 102,
    title: 'Sacred Metal Casting & Jewellery Workshop',
    slug: 'sacred-metal-casting-jewellery-workshop',
    category: 'Workshop',
    badge: 'Artisan Metallurgy',
    duration: '1 Day Intensive',
    mode: 'Master Metallurgy Forge',
    original_price: 10999.00,
    discount_price: 5499.00,
    discount_percent: 50,
    description: 'A masterclass on traditional lost-wax casting and antique Naga jewellery chasing. Includes brass alloy stock and finished craft artifact.',
    highlights: 'Lost-Wax Mold Preparation; Dravidian Motifs; Repousse Chasing; Antique Naga Coil Jewelry; Furnace Pouring; Live Finishing & Patina',
    image_url: '/artisan/pillar-metal.jpg',
    seats_total: 35,
    seats_available: 18,
    is_active: 1,
    pillar_id: 3,
    pillar_title: 'Sculpturing & Sacred Nagas Metal Art',
  },

  // ==========================================
  // Learning Journeys (10+ Days) — Exactly 2
  // ==========================================
  {
    id: 201,
    title: '60-Day Heritage Creator Journey',
    slug: '60-day-heritage-creator-journey',
    category: 'Learning Journey',
    badge: 'Structured Curriculum',
    duration: '60 Days',
    mode: 'Full Cohort Immersion',
    original_price: 19999.00,
    discount_price: 9999.00,
    discount_percent: 50,
    description: '6 progressive 10-day phases covering drawing, Tamili epigraphy, rock pigments, sacred iconography, metalwork, plus on-site field visit.',
    highlights: 'Phase 1: Drawing & Symbols; Phase 2: Tamili Epigraphy; Phase 3: Rock Art & Pigments; Phase 4: Iconography; Phase 5: Naga Metal; Phase 6: Commercial Portfolio & Field Visit',
    image_url: '/artisan/pedagogy-practice.jpg',
    seats_total: 50,
    seats_available: 15,
    is_active: 1,
    pillar_id: 1,
    pillar_title: 'Painting & Natural Mineral Pigments',
  },
  {
    id: 202,
    title: '30-Day Classical Iconography & Sculptural Forms',
    slug: '30-day-classical-iconography-sculptural-forms',
    category: 'Learning Journey',
    badge: 'Cohort Roadmap',
    duration: '30 Days Sprint',
    mode: 'Studio Immersion',
    original_price: 14999.00,
    discount_price: 7499.00,
    discount_percent: 50,
    description: 'Intensive 30-day cohort focusing on dhyana sloka visualization, copper repousse sacred emblems, and miniature lost-wax deity casting.',
    highlights: 'Phase 1: Iconographic Canon; Phase 2: Sacred Proportion Metal; Phase 3: Patina & Final Consecration',
    image_url: '/artisan/pedagogy-history.jpg',
    seats_total: 30,
    seats_available: 12,
    is_active: 1,
    pillar_id: 3,
    pillar_title: 'Sculpturing & Sacred Nagas Metal Art',
  },
];

// Attach structured modules/phases and customer-facing details where available
export const DEFAULT_COURSES = BASE_COURSES.map((c) => {
  const content = DEFAULT_COURSE_CONTENT[c.slug];
  if (!content) return c;
  return { ...c, highlights: JSON.stringify(content.highlights), details: content.details };
});
