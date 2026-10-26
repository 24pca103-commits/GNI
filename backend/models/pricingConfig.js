/**
 * Official Course & Program Pricing Configuration
 * Global Nagas Institute (GNI)
 * 
 * Strict course-and-duration-based pricing approved by GNI.
 * Fees are not calculated by simple multiplication.
 */

export const GNI_COURSE_PRICING = [
  {
    id: 'heritage-creator-cohort',
    courseName: 'Heritage Creator Cohort',
    category: 'Learning Journey',
    description: 'Comprehensive 6-tier curriculum covering traditional Dravidian arts, epigraphy, and Nakshi metal crafts.',
    durations: [
      {
        duration: '30 Days',
        fee: 25000,
        originalPrice: 40000,
        discount: 15000,
        taxes: 0,
        totalPayable: 25000,
        formattedFee: '₹25,000',
        formattedOriginal: '₹40,000',
        formattedDiscount: '₹15,000',
        formattedTotal: '₹25,000',
        mode: 'Intensive Studio Sprint',
        note: 'Foundation modules & supervised studio practice.',
      },
      {
        duration: '60 Days',
        fee: 45000,
        originalPrice: 70000,
        discount: 25000,
        taxes: 0,
        totalPayable: 45000,
        formattedFee: '₹45,000',
        formattedOriginal: '₹70,000',
        formattedDiscount: '₹25,000',
        formattedTotal: '₹45,000',
        mode: 'Full Master Immersion + On-site Field Visit',
        note: 'Complete 6-tier curriculum, tools kit & guild certification.',
      },
    ],
  },
  {
    id: 'traditional-painting-workshop',
    courseName: 'Traditional Painting Workshop',
    category: 'Workshop',
    description: 'Ancient natural mineral rock pigments preparation, fresco grounds, and temple mural painting.',
    durations: [
      {
        duration: '1 Day',
        fee: 4500,
        originalPrice: 8500,
        discount: 4000,
        taxes: 0,
        totalPayable: 4500,
        formattedFee: '₹4,500',
        formattedOriginal: '₹8,500',
        formattedDiscount: '₹4,000',
        formattedTotal: '₹4,500',
        mode: 'Studio Hands-on',
        note: 'Raw mineral pigment kit and finished canvas plate.',
      },
      {
        duration: '7 Days',
        fee: 11500,
        originalPrice: 18000,
        discount: 6500,
        taxes: 0,
        totalPayable: 11500,
        formattedFee: '₹11,500',
        formattedOriginal: '₹18,000',
        formattedDiscount: '₹6,500',
        formattedTotal: '₹11,500',
        mode: 'Studio Hands-on Intensive',
        note: 'Fresco plaster formulation and natural organic binders.',
      },
      {
        duration: '15 Days',
        fee: 18000,
        originalPrice: 28000,
        discount: 10000,
        taxes: 0,
        totalPayable: 18000,
        formattedFee: '₹18,000',
        formattedOriginal: '₹28,000',
        formattedDiscount: '₹10,000',
        formattedTotal: '₹18,000',
        mode: 'Advanced Fresco Apprenticeship',
        note: 'Complete temple mural tablet and authentic master portfolio.',
      },
    ],
  },
  {
    id: 'epigraphy-ancient-scripts',
    courseName: 'Epigraphy & Ancient Scripts',
    category: 'Workshop & Curriculum',
    description: 'Deciphering Brahmi, Tamili scripts, copper plate engraving, and palm leaf manuscript scribing.',
    durations: [
      {
        duration: '1 Day',
        fee: 3999,
        originalPrice: 7999,
        discount: 4000,
        taxes: 0,
        totalPayable: 3999,
        formattedFee: '₹3,999',
        formattedOriginal: '₹7,999',
        formattedDiscount: '₹4,000',
        formattedTotal: '₹3,999',
        mode: 'Studio Hands-on',
        note: 'Engraved copper plate rubbing and take-home inscription stylus.',
      },
      {
        duration: '7 Days',
        fee: 9999,
        originalPrice: 16000,
        discount: 6001,
        taxes: 0,
        totalPayable: 9999,
        formattedFee: '₹9,999',
        formattedOriginal: '₹16,000',
        formattedDiscount: '₹6,001',
        formattedTotal: '₹9,999',
        mode: 'Studio Hands-on Intensive',
        note: 'Palm leaf preservation, archival rubbing, and paleographic decoding.',
      },
      {
        duration: '15 Days',
        fee: 15999,
        originalPrice: 25000,
        discount: 9001,
        taxes: 0,
        totalPayable: 15999,
        formattedFee: '₹15,999',
        formattedOriginal: '₹25,000',
        formattedDiscount: '₹9,001',
        formattedTotal: '₹15,999',
        mode: 'Archival Epigraphy Sprint',
        note: 'Temple stone inscription rubbings and archaeological documentation.',
      },
      {
        duration: '30 Days',
        fee: 22500,
        originalPrice: 35000,
        discount: 12500,
        taxes: 0,
        totalPayable: 22500,
        formattedFee: '₹22,500',
        formattedOriginal: '₹35,000',
        formattedDiscount: '₹12,500',
        formattedTotal: '₹22,500',
        mode: 'Master Epigraphist Track',
        note: 'Full Brahmi-Tamili paleography certificate and museum field study.',
      },
    ],
  },
  {
    id: 'sculpturing-nakshi-metal-craft',
    courseName: 'Sculpturing & Nakshi Metal Craft',
    category: 'Workshop',
    description: 'Traditional Dravidian lost-wax brass casting, antique Naga jewellery fabrication, and repousse chasing.',
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
        mode: 'Artisan Forge Intensive',
        note: 'Brass alloy raw stock, chasing tools, and cast souvenir.',
      },
      {
        duration: '7 Days',
        fee: 14500,
        originalPrice: 24000,
        discount: 9500,
        taxes: 0,
        totalPayable: 14500,
        formattedFee: '₹14,500',
        formattedOriginal: '₹24,000',
        formattedDiscount: '₹9,500',
        formattedTotal: '₹14,500',
        mode: 'Master Metallurgy Forge',
        note: 'Lost-wax mold crafting, kiln firing, and patina finishing.',
      },
      {
        duration: '15 Days',
        fee: 23000,
        originalPrice: 38000,
        discount: 15000,
        taxes: 0,
        totalPayable: 23000,
        formattedFee: '₹23,000',
        formattedOriginal: '₹38,000',
        formattedDiscount: '₹15,000',
        formattedTotal: '₹23,000',
        mode: 'Guild Apprenticeship',
        note: 'Antique repousse coil jewelry and sacred iconography casting.',
      },
    ],
  },
  {
    id: 'ancient-tamil-art-heritage-workshop',
    courseName: 'Ancient Tamil Art & Heritage Experience Workshop',
    category: 'Workshop',
    description: 'A one-day hands-on introduction to Tamil heritage, art, and craftsmanship.',
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
      {
        duration: '7 Days',
        fee: 12999,
        originalPrice: 22000,
        discount: 9001,
        taxes: 0,
        totalPayable: 12999,
        formattedFee: '₹12,999',
        formattedOriginal: '₹22,000',
        formattedDiscount: '₹9,001',
        formattedTotal: '₹12,999',
        mode: 'Studio Hands-on Sprint',
        note: 'Comprehensive multi-module artisan masterclass.',
      },
    ],
  },
];

/**
 * Server-side trusted calculation of course fee
 */
export function calculateTrustedFee(courseNameOrId, requestedDuration) {
  if (!courseNameOrId) return null;
  const normalizedCourse = String(courseNameOrId).trim().toLowerCase();

  const found = GNI_COURSE_PRICING.find(
    (c) =>
      c.id.toLowerCase() === normalizedCourse ||
      c.courseName.toLowerCase() === normalizedCourse ||
      c.courseName.toLowerCase().includes(normalizedCourse) ||
      normalizedCourse.includes(c.courseName.toLowerCase())
  );

  if (!found) {
    // Dynamic fallback for custom courses created via admin panel
    return {
      courseName: courseNameOrId,
      duration: requestedDuration || '1 Day',
      fee: 4999,
      originalPrice: 9999,
      discount: 5000,
      taxes: 0,
      totalPayable: 4999,
      formattedFee: '₹4,999',
      formattedOriginal: '₹9,999',
      formattedDiscount: '₹5,000',
      formattedTotal: '₹4,999',
      mode: 'Hands-on Learning',
      note: 'Standard cohort rate pending GNI custom confirmation.',
    };
  }

  if (!requestedDuration) {
    // Return first duration as default preview
    const firstDur = found.durations[0];
    return {
      courseName: found.courseName,
      duration: firstDur.duration,
      ...firstDur,
    };
  }

  const normDur = String(requestedDuration).trim().toLowerCase();
  const durMatch = found.durations.find(
    (d) =>
      d.duration.toLowerCase() === normDur ||
      d.duration.toLowerCase().includes(normDur) ||
      normDur.includes(d.duration.toLowerCase())
  );

  if (durMatch) {
    return {
      courseName: found.courseName,
      ...durMatch,
    };
  }

  // If specific duration not matched, fallback to first available duration
  return {
    courseName: found.courseName,
    ...found.durations[0],
  };
}
