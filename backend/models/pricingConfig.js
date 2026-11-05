/**
 * Official Course & Program Pricing Configuration
 * Global Nagas Institute (GNI)
 * 
 * Exactly 4 canonical offerings: 2 Workshops + 2 Learning Journeys
 */

export const GNI_COURSE_PRICING = [
  // ==========================================
  // WORKSHOPS (1-9 Days) — Exactly 2
  // ==========================================
  {
    id: 'ancient-tamil-art-heritage-workshop',
    courseName: 'Ancient Tamil Art & Heritage Experience Workshop',
    pillarId: 4,
    pillarTitle: 'Heritage Applications & Interior Crafts',
    category: 'Workshop',
    description: 'A hands-on introduction to Tamil heritage, art, architectural woodwork, terracotta, and ancestral craftsmanship.',
    takeHome: 'Handmade terracotta craft artifact & authenticated GNI experience souvenir',
    durations: [
      {
        duration: '1 Day',
        fee: 4999,
        originalPrice: 9999,
        discount: 5000,
        taxes: 0,
        totalPayable: 4999,
        formattedFee: '₹4,999',
        formattedOriginal: '₹9,999',
        formattedDiscount: '₹5,000',
        formattedTotal: '₹4,999',
        mode: 'Studio Hands-on',
        note: 'Raw materials, live inscription plate, and certified craft kit.',
      },
    ],
  },
  {
    id: 'sacred-metal-casting-jewellery-workshop',
    courseName: 'Sacred Metal Casting & Jewellery Workshop',
    pillarId: 3,
    pillarTitle: 'Sculpturing & Sacred Nagas Metal Art',
    category: 'Workshop',
    description: 'A masterclass on traditional lost-wax casting and antique Naga jewellery chasing. Includes brass alloy stock and finished craft artifact.',
    takeHome: 'Lost-wax cast brass medallion & authenticated GNI guild certificate',
    durations: [
      {
        duration: '1 Day',
        fee: 5499,
        originalPrice: 10999,
        discount: 5500,
        taxes: 0,
        totalPayable: 5499,
        formattedFee: '₹5,499',
        formattedOriginal: '₹10,999',
        formattedDiscount: '₹5,500',
        formattedTotal: '₹5,499',
        mode: 'Master Metallurgy Forge',
        note: 'Brass alloy raw stock, chasing tools, and cast souvenir.',
      },
    ],
  },

  // ==========================================
  // LEARNING JOURNEYS (10+ Days) — Exactly 2
  // ==========================================
  {
    id: '60-day-heritage-creator-journey',
    courseName: '60-Day Heritage Creator Journey',
    pillarId: 1,
    pillarTitle: 'Painting & Natural Mineral Pigments',
    category: 'Learning Journey',
    description: 'Comprehensive 6-tier curriculum covering traditional Dravidian arts, epigraphy, and Nakshi metal crafts.',
    takeHome: 'Full 6-phase master portfolio, engraved bronze inscription plate & guild tools kit',
    durations: [
      {
        duration: '60 Days',
        fee: 9999,
        originalPrice: 19999,
        discount: 10000,
        taxes: 0,
        totalPayable: 9999,
        formattedFee: '₹9,999',
        formattedOriginal: '₹19,999',
        formattedDiscount: '₹10,000',
        formattedTotal: '₹9,999',
        mode: 'Full Master Immersion + On-site Field Visit',
        note: 'Complete 6-tier curriculum, tools kit & guild certification.',
      },
    ],
  },
  {
    id: '30-day-classical-iconography-sculptural-forms',
    courseName: '30-Day Classical Iconography & Sculptural Forms',
    pillarId: 3,
    pillarTitle: 'Sculpturing & Sacred Nagas Metal Art',
    category: 'Learning Journey',
    description: 'Intensive 30-day cohort focusing on dhyana sloka visualization, copper repousse sacred emblems, and miniature lost-wax deity casting.',
    takeHome: 'Master proportion grids, Tamili inscription plate & mineral mural fresco tablet',
    durations: [
      {
        duration: '30 Days',
        fee: 7499,
        originalPrice: 14999,
        discount: 7500,
        taxes: 0,
        totalPayable: 7499,
        formattedFee: '₹7,499',
        formattedOriginal: '₹14,999',
        formattedDiscount: '₹7,500',
        formattedTotal: '₹7,499',
        mode: 'Studio Immersion',
        note: 'Foundation modules & supervised studio practice.',
      },
    ],
  },
];

export function getCoursePrice(courseName, duration) {
  if (!courseName) return null;
  const cName = String(courseName).toLowerCase().trim();
  const dName = duration ? String(duration).toLowerCase().trim() : '';

  const found = GNI_COURSE_PRICING.find(
    (p) => p.courseName.toLowerCase().trim() === cName ||
           p.id.toLowerCase() === cName
  );

  if (!found) return null;

  if (!dName && found.durations && found.durations.length > 0) {
    return {
      courseName: found.courseName,
      pillarId: found.pillarId,
      pillarTitle: found.pillarTitle,
      category: found.category,
      ...found.durations[0],
    };
  }

  const durMatch = found.durations.find(
    (d) => d.duration.toLowerCase().trim() === dName ||
           d.duration.toLowerCase().includes(dName) ||
           dName.includes(d.duration.toLowerCase())
  );

  if (durMatch) {
    return {
      courseName: found.courseName,
      pillarId: found.pillarId,
      pillarTitle: found.pillarTitle,
      category: found.category,
      ...durMatch,
    };
  }

  return {
    courseName: found.courseName,
    pillarId: found.pillarId,
    pillarTitle: found.pillarTitle,
    category: found.category,
    ...found.durations[0],
  };
}

export default GNI_COURSE_PRICING;
