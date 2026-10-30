import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  Hand,
  ArrowRight,
  Hammer,
  Palette,
  Flame,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Award,
  Check,
  BookOpen,
} from 'lucide-react';
import Reveal from './Reveal';
import { fetchActiveCourses } from '../services/api';

// Fallback workshop presets in case API is temporarily unavailable
const DEFAULT_WORKSHOPS = [
  {
    id: 'sacred-metal',
    tabLabel: 'Artisan Metallurgy Forge',
    tag: 'Artisan Metallurgy Forge',
    title: 'Sacred Metal Casting & Jewellery Workshop',
    subtitle: 'A hands-on masterclass in traditional lost-wax (cire-perdue) casting and antique Naga repoussé jewellery chasing.',
    image: '/artisan/pillar-metal.jpg',
    imageAlt: 'Sacred metal casting and Naga jewellery workshop forge',
    feeBadge: 'Guild Studio Access',
    fee: '₹5,499',
    feeNote: 'Includes brass alloy raw stock, chasing tools, and finished craft artifact.',
    seatsTotal: 35,
    seatsAvailable: 18,
    seatsInfo: 'Limited Seats (18 of 35 Available) • Fee: ₹5,499',
    seatsDesc: 'Direct sthapathi guild apprenticeship & custom cast takeaway.',
    highlights: [
      { icon: Calendar, label: '1 Day Intensive' },
      { icon: Users, label: 'Max 35 Apprentices' },
      { icon: Flame, label: 'Live Metal Chasing' },
      { icon: Award, label: 'Guild Certificate' },
    ],
    foundrySpecs: {
      process: 'Lost-Wax (Cire-Perdue) & Repoussé',
      metals: 'Solid Brass & Traditional Bell Metal',
      ratio: '1 Master Sthapathi : 6 Apprentices',
      tools: 'Pitch bowl, steel chisels, wooden mallet, fire apron',
    },
    takeaways: [
      'Handcrafted Antique Naga Brass Medallion',
      'Guild Repoussé Chasing & Punch Tool',
      'Official Guild Apprenticeship Certificate',
      'Archival Studio Documentary Photos',
    ],
    activities: [
      {
        step: '01',
        day: 'Day 01',
        title: 'Sacred Dravidian Wax Modeling',
        desc: 'Draft canonic proportion grids and hand-carve pure beeswax & dammar resin blanks into sacred serpent forms.',
      },
      {
        step: '02',
        day: 'Day 01',
        title: 'Clay Investment Mold Coating',
        desc: 'Apply layered river silt and termite-clay slurry around the wax model, reinforced with cotton husk fibers.',
      },
      {
        step: '03',
        day: 'Day 01',
        title: 'Crucible Pouring & Metallurgy',
        desc: 'Melt antique brass alloy in a graphite crucible kiln and pour molten metal into the de-waxed cavity.',
      },
      {
        step: '04',
        day: 'Day 01',
        title: 'Quenching & Core De-molding',
        desc: 'Quench hot casting in water, break the fired clay core, and inspect the raw cast bronze artifact.',
      },
      {
        step: '05',
        day: 'Day 01',
        title: 'Repoussé Relief & Chasing',
        desc: 'Anchor metal onto pine-rosin pitch bowls; chase fine relief scales, eyes, and traditional shilpa engravings.',
      },
      {
        step: '06',
        day: 'Day 01',
        title: 'Patina Chemistry & Polishing',
        desc: 'Treat with traditional herbal and mineral oxidizers for antique heirloom luster, followed by buffing.',
      },
    ],
  },
  {
    id: 'tamil-heritage',
    tabLabel: 'Art & Epigraphy Studio',
    tag: 'Heritage Art & Epigraphy',
    title: 'Ancient Tamil Art & Epigraphy Masterclass',
    subtitle: 'A tactile introduction to prehistoric rock art, natural earth pigment grinding, and Tamili copper plate scribing.',
    image: '/artisan/workshop.jpg',
    imageAlt: 'Tamil heritage workshop hands-on experience',
    feeBadge: 'Archival Studio Access',
    fee: '₹4,999',
    feeNote: 'Includes raw mineral pigments, copper plate, and scribing kit.',
    seatsTotal: 50,
    seatsAvailable: 28,
    seatsInfo: 'Limited Seats (28 of 50 Available) • Fee: ₹4,999',
    seatsDesc: 'Hands-on learning, live sthapathi guidance & take-home craft.',
    highlights: [
      { icon: Calendar, label: '1 Day Intensive' },
      { icon: Users, label: 'Max 50 Participants' },
      { icon: Hand, label: 'Live Inscription Scribing' },
      { icon: Award, label: 'Guild Certificate' },
    ],
    foundrySpecs: {
      process: 'Natural Pigments & Epigraphical Scribing',
      metals: 'Annealed Pure Copper & Mineral Ochre',
      ratio: '1 Epigraphist : 8 Participants',
      tools: 'Granite mortar, hardened stylus, archival rubbing ink',
    },
    takeaways: [
      'Hand-Engraved Copper Inscription Charter',
      'Authentic Mineral Fresco Artwork Tablet',
      'Official Guild Archival Certificate',
      'Archival Studio Documentary Photos',
    ],
    activities: [
      {
        step: '01',
        day: 'Day 01',
        title: 'Prehistoric Rock Pigment Grinding',
        desc: 'Grind raw mineral red ochre and yellow limonite with granite mortars, blending with organic tree gum.',
      },
      {
        step: '02',
        day: 'Day 01',
        title: 'Ancient Tamili Script Decoding',
        desc: 'Decode Sangam-era Tamili Brahmi letterforms and master classical orthography under archival historians.',
      },
      {
        step: '03',
        day: 'Day 01',
        title: 'Temple Geometry & Proportion Canons',
        desc: 'Construct sacred geometric layouts and divine grid proportions on handmade palm-leaf sheets.',
      },
      {
        step: '04',
        day: 'Day 01',
        title: 'Copper Plate Royal Charter Scribing',
        desc: 'Scribe ancient verses into annealed copper sheets using traditional hardened steel styluses.',
      },
      {
        step: '05',
        day: 'Day 01',
        title: 'Archival Ink Rubbing & Conservation',
        desc: 'Take authentic heritage ink rubbings of historical inscriptions for archival portfolio records.',
      },
      {
        step: '06',
        day: 'Day 01',
        title: 'Takeaway Finishing & Presentation',
        desc: 'Mount and seal your handmade copper inscription and fresco tablet in a certified GNI archival portfolio.',
      },
    ],
  },
  {
    id: 'traditional-painting',
    tabLabel: 'Natural Mineral Pigments',
    tag: 'Fresco & Mineral Masterclass',
    title: 'Traditional Painting & Natural Mineral Pigments Workshop',
    subtitle: 'Ancient natural mineral rock pigments preparation, fresco grounds, and authentic temple mural painting techniques.',
    image: '/artisan/studio-pigments.jpg',
    imageAlt: 'Traditional Painting and Natural Mineral Pigments Workshop',
    feeBadge: 'Fresco Studio Access',
    fee: '₹4,500',
    feeNote: 'Includes raw mineral stones, limestone mortar slab, and natural binder extracts.',
    seatsTotal: 40,
    seatsAvailable: 20,
    seatsInfo: 'Limited Seats (20 of 40 Available) • Fee: ₹4,500',
    seatsDesc: 'Hands-on natural fresco preparation & individual mural tablet.',
    highlights: [
      { icon: Calendar, label: '1 Day Intensive' },
      { icon: Users, label: 'Max 40 Participants' },
      { icon: Palette, label: 'Raw Pigment Grinding' },
      { icon: Award, label: 'Guild Credential' },
    ],
    foundrySpecs: {
      process: 'Buon Fresco & Natural Earth Pigments',
      metals: 'Natural Ochres, Malachite & Lapis Lazuli',
      ratio: '1 Fresco Master : 8 Apprentices',
      tools: 'Granite pestle, lime plaster tablet, squirrel hair brushes',
    },
    takeaways: [
      'Finished Natural Mineral Fresco Plaque',
      'Curated Earth Pigment Sample Palette',
      'Guild Certificate in Traditional Mural Arts',
      'Archival Studio Documentary Photos',
    ],
    activities: [
      {
        step: '01',
        day: 'Day 01',
        title: 'Raw Earth Mineral Identification',
        desc: 'Identify and sort natural iron oxides, red cinnabar, copper carbonates, and lapis stones from historical quarry sites.',
      },
      {
        step: '02',
        day: 'Day 01',
        title: 'Granite Pestle Wet Milling',
        desc: 'Grind raw mineral rocks into microfine powder using traditional granite muller slabs and pure mountain spring water.',
      },
      {
        step: '03',
        day: 'Day 01',
        title: 'Natural Organic Binder Formulation',
        desc: 'Blend natural tree gums, tender coconut water, and neem resin extracts to achieve permanent archival binding.',
      },
      {
        step: '04',
        day: 'Day 01',
        title: 'Wet Lime Plaster Ground Laying',
        desc: 'Prepare seasoned slaked lime and river sand substrate on porous terracotta tiles in the classic Chola fresco tradition.',
      },
      {
        step: '05',
        day: 'Day 01',
        title: 'Canonic Iconographic Brushwork',
        desc: 'Execute sacred deity outlines and ornamental floral creepers using authentic handcrafted bamboo and hair brushes.',
      },
      {
        step: '06',
        day: 'Day 01',
        title: 'Burnishing & Agate Stone Polishing',
        desc: 'Gently burnish the damp pigment surface with polished river agates to seal vibrant permanent mineral hues.',
      },
    ],
  },
  {
    id: 'epigraphy-scripts',
    tabLabel: 'Ancient Tamili Epigraphy',
    tag: 'Archival Epigraphy Forge',
    title: 'Epigraphy & Ancient Tamili Inscriptions Workshop',
    subtitle: 'Deciphering Brahmi, Tamili scripts, royal copper plate engraving, and palm leaf manuscript scribing.',
    image: '/artisan/pillar-epigraphy.jpg',
    imageAlt: 'Epigraphy and Ancient Tamili Inscriptions Workshop',
    feeBadge: 'Archival Studio Access',
    fee: '₹3,999',
    feeNote: 'Includes polished copper plate, palm leaves, stylus, and archival ink.',
    seatsTotal: 35,
    seatsAvailable: 15,
    seatsInfo: 'Limited Seats (15 of 35 Available) • Fee: ₹3,999',
    seatsDesc: 'Hands-on epigraphy transcription & personal engraved copper charter.',
    highlights: [
      { icon: Calendar, label: '1 Day Intensive' },
      { icon: Users, label: 'Max 35 Participants' },
      { icon: Hammer, label: 'Copper Plate Engraving' },
      { icon: Award, label: 'Guild Credential' },
    ],
    foundrySpecs: {
      process: 'Tamili Inscription & Palm Leaf Scribing',
      metals: 'Annealed Pure Copper & Dried Palm Folios',
      ratio: '1 Epigraphist : 7 Apprentices',
      tools: 'Hardened iron stylus, soot ink, rubbing pads, stone chisels',
    },
    takeaways: [
      'Hand-Engraved Royal Copper Charter Plate',
      'Inscribed Palm Leaf Manuscript Folio',
      'Tamili Script Alphabet Concordance Chart',
      'Guild Archival Milestone Certificate',
    ],
    activities: [
      {
        step: '01',
        day: 'Day 01',
        title: 'Evolution of Sangam Tamili Script',
        desc: 'Examine ancient hero-stone inscriptions and trace the morphological development of Tamili from Asokan Brahmi.',
      },
      {
        step: '02',
        day: 'Day 01',
        title: 'Palm Leaf Folio Preparation',
        desc: 'Season dried palmyra leaves with turmeric and herbal smoke to render them resilient and moisture-resistant.',
      },
      {
        step: '03',
        day: 'Day 01',
        title: 'Iron Stylus Incision Techniques',
        desc: 'Master the delicate single-stroke incision technique without piercing through delicate dried palm leaf fibers.',
      },
      {
        step: '04',
        day: 'Day 01',
        title: 'Lampblack & Herbal Inking',
        desc: 'Rub lampblack soot mixed with aromatic herbal oils across incisions to reveal stark, jet-black lettering.',
      },
      {
        step: '05',
        day: 'Day 01',
        title: 'Chased Copper Plate Charter Scribing',
        desc: 'Transfer classical royal epigraphs onto annealed copper plates with engraved dynastic emblems and seals.',
      },
      {
        step: '06',
        day: 'Day 01',
        title: 'Conservation & Archival Mounting',
        desc: 'Clean, lubricate, and bind folio codices with sacred red silk cord and protective seasoned wooden covers.',
      },
    ],
  },
];

// Helper to determine if an offering qualifies as a workshop (1-9 days course or workshop offering)
export function isWorkshopOffering(item) {
  if (!item) return false;
  if (item.offering_type === 'workshop') return true;
  if (item.offering_type === 'journey') return false;

  const cat = (item.category || '').toLowerCase();
  const title = (item.title || '').toLowerCase();
  const dur = (item.duration || '').toLowerCase();
  const dayMatch = dur.match(/(\d+)\s*day/i);
  const dayCount = dayMatch ? parseInt(dayMatch[1], 10) : null;

  if (dayCount !== null && dayCount > 9) return false;
  if (
    title.includes('60-day') ||
    title.includes('60 day') ||
    title.includes('30-day') ||
    title.includes('30 day') ||
    dur.includes('60') ||
    dur.includes('30') ||
    cat.includes('journey') ||
    cat.includes('cohort')
  ) {
    return false;
  }
  if (dayCount !== null && dayCount <= 9) return true;
  if (cat.includes('workshop') || title.includes('workshop')) return true;
  return true;
}

function cleanActivityText(text) {
  if (!text) return '';
  const str = String(text).trim();
  if (
    str.includes('react-dom') ||
    str.includes('ReferenceError') ||
    str.includes('WorkshopSection') ||
    str.includes('Uncaught') ||
    str.includes('React DevTools')
  ) {
    return 'Hands-on Heritage Craft & Inscription Practice';
  }
  return str.trim();
}

function mapCourseToWorkshop(c) {
  let structuredActivities = [];

  if (c.highlights) {
    // 1. Try parsing JSON format
    if (typeof c.highlights === 'string' && (c.highlights.trim().startsWith('[') || c.highlights.trim().startsWith('{'))) {
      try {
        const parsed = JSON.parse(c.highlights);
        if (Array.isArray(parsed) && parsed.length > 0) {
          structuredActivities = parsed.map((item, idx) => ({
            step: item.step || String(idx + 1).padStart(2, '0'),
            day: item.day || item.period || `Day ${String(idx + 1).padStart(2, '0')}`,
            title: cleanActivityText(item.title || item.name || `Module ${idx + 1}`),
            desc: item.desc || item.details || item.outcome || item.description || '',
          }));
        }
      } catch (_) {}
    }

    // 2. Parse delimited strings (supports "Title: Description" or "Title - Description" or simple title)
    if (structuredActivities.length === 0 && typeof c.highlights === 'string') {
      const rawParts = c.highlights.split(/[;\n]/).map((s) => s.trim()).filter(Boolean);
      structuredActivities = rawParts.map((part, idx) => {
        let title = part;
        let desc = '';
        if (part.includes(':')) {
          const split = part.split(':');
          title = split[0].trim();
          desc = split.slice(1).join(':').trim();
        } else if (part.includes(' - ')) {
          const split = part.split(' - ');
          title = split[0].trim();
          desc = split.slice(1).join(' - ').trim();
        }
        return {
          step: String(idx + 1).padStart(2, '0'),
          day: `Day ${String(idx + 1).padStart(2, '0')}`,
          title: cleanActivityText(title),
          desc: desc || '',
        };
      });
    }
  }

  // Fallback defaults
  if (structuredActivities.length === 0) {
    structuredActivities = [
      { step: '01', day: 'Day 01', title: 'Prehistoric Rock Painting', desc: 'Direct hands-on exploration of ancient rock pigments and cave art techniques.' },
      { step: '02', day: 'Day 01', title: 'Tamili Script Practice', desc: 'Inscribing early Brahmi and Grantha epigraphs on clay and granite surfaces.' },
      { step: '03', day: 'Day 01', title: 'Iconography Basics & Sacred Geometry', desc: 'Canons of Shilpa Shastra, Tala measurements, and deity proportions.' },
      { step: '04', day: 'Day 01', title: 'Live Hands-on Studio Practice', desc: 'Guided hands-on workshop crafting under master sthapathi guidance.' },
    ];
  }

  const priceNum = Number(c.discount_price || c.original_price || 4999);
  const formattedFee = `₹${priceNum.toLocaleString('en-IN')}`;
  const isMetal =
    (c.badge || '').toLowerCase().includes('metal') ||
    (c.title || '').toLowerCase().includes('metal');

  const seatsTotal = c.seats_total ?? (isMetal ? 35 : 50);
  const seatsAvailable = c.seats_available ?? (isMetal ? 18 : 28);

  return {
    id: String(c.id || c.slug),
    tabLabel: isMetal ? 'Artisan Metallurgy Forge' : c.title,
    tag: c.pillar_title ? `Pillar: ${c.pillar_title}` : (c.badge || 'Hands-on Intensive Workshop (1–9 Days)'),
    pillarTitle: c.pillar_title || '',
    title: c.title,
    subtitle:
      c.description ||
      'A hands-on introduction to Tamil heritage, authentic art canons, and ancestral craftsmanship.',
    image: c.image_url || (isMetal ? '/artisan/pillar-metal.jpg' : '/artisan/workshop.jpg'),
    imageAlt: c.title,
    feeBadge: c.badge || 'Guild Studio Access',
    fee: formattedFee,
    feeNote: 'Includes raw materials, inscription plate, and certified craft kit.',
    seatsTotal,
    seatsAvailable,
    seatsInfo:
      seatsAvailable === 0
        ? `Full Capacity (0 Seats Available) • Fee: ${formattedFee}`
        : `Limited Seats (${seatsAvailable} of ${seatsTotal} Available) • Fee: ${formattedFee}`,
    seatsDesc: `${c.mode || 'Hands-on learning'}, live sthapathi guidance & take-home craft.`,
    isFull: seatsAvailable === 0,
    highlights: [
      { icon: Calendar, label: c.duration || '1 Day Intensive' },
      { icon: Users, label: `Max ${seatsTotal} Apprentices` },
      { icon: isMetal ? Flame : Hand, label: c.mode || 'Hands-on Guild Forge' },
      { icon: Award, label: 'Guild Certificate' },
    ],
    foundrySpecs: {
      process: isMetal ? 'Lost-Wax (Cire-Perdue) & Repoussé' : 'Natural Pigments & Epigraphical Scribing',
      metals: isMetal ? 'Solid Brass & Bell Metal Alloys' : 'Annealed Copper & Mineral Ochres',
      ratio: isMetal ? '1 Master Sthapathi : 6 Apprentices' : '1 Epigraphist : 8 Participants',
      tools: isMetal
        ? 'Pitch bowl, steel chisels, wooden mallet, fire apron'
        : 'Granite mortar, engraving stylus, rubbing pad',
    },
    takeaways: isMetal
      ? [
          'Handcrafted Antique Naga Brass Medallion',
          'Guild Repoussé Chasing & Punch Tool',
          'Official Guild Apprenticeship Certificate',
          'Archival Studio Documentary Photos',
        ]
      : [
          'Hand-Engraved Copper Inscription Charter',
          'Authentic Mineral Fresco Artwork Tablet',
          'Official Guild Archival Certificate',
          'Archival Studio Documentary Photos',
        ],
    activities: structuredActivities,
  };
}

export default function WorkshopSection() {
  const [workshops, setWorkshops] = useState(DEFAULT_WORKSHOPS);
  const [activeWorkshopIndex, setActiveWorkshopIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const loadWorkshops = async () => {
      try {
        const liveOfferings = await fetchActiveCourses();
        if (isMounted && liveOfferings && liveOfferings.length > 0) {
          const filtered = liveOfferings.filter(isWorkshopOffering);
          if (filtered.length > 0) {
            setWorkshops(filtered.map(mapCourseToWorkshop));
          }
        }
      } catch (err) {
        console.warn('[WorkshopSection] Using fallback workshops:', err);
      }
    };

    loadWorkshops();

    window.addEventListener('storage', loadWorkshops);
    window.addEventListener('focus', loadWorkshops);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', loadWorkshops);
      window.removeEventListener('focus', loadWorkshops);
    };
  }, []);

  const safeIndex = activeWorkshopIndex < workshops.length ? activeWorkshopIndex : 0;
  const currentWorkshop = workshops[safeIndex] || workshops[0] || DEFAULT_WORKSHOPS[0];
  const highlights = currentWorkshop.highlights || [];
  const activities = currentWorkshop.activities || [];
  const foundrySpecs = currentWorkshop.foundrySpecs || DEFAULT_WORKSHOPS[0].foundrySpecs;
  const takeaways = currentWorkshop.takeaways || DEFAULT_WORKSHOPS[0].takeaways;

  const seatsAvailable = currentWorkshop.seatsAvailable ?? 18;
  const seatsTotal = currentWorkshop.seatsTotal ?? 35;
  const seatsPercent = Math.max(0, Math.min(100, Math.round(((seatsTotal - seatsAvailable) / seatsTotal) * 100)));

  return (
    <section id="workshop" className="py-12 md:py-16 bg-[#FAF7F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <Reveal direction="up" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4A2C20] border border-[#B89555]/40 text-[#E5B869] text-xs sm:text-sm font-['DM_Sans'] font-semibold mb-3.5 shadow-xs leading-normal">
              <Flame className="w-4 h-4 text-[#E5B869]" />
              <span>Artisan Metallurgy &amp; Tactile Guild Workshops (1–9 Days)</span>
            </div>
            <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight leading-tight pb-1 break-words [overflow-wrap:break-word] hyphens-none min-w-0 max-w-full">
              {currentWorkshop.title}
            </h2>
            <div className="w-20 h-0.5 bg-[#B89555] mx-auto mt-3" />
            <p className="font-['DM_Sans'] mt-3 text-sm sm:text-base text-[#6B4030] font-normal leading-relaxed text-center mx-auto max-w-2xl break-words [overflow-wrap:break-word] hyphens-none min-w-0 max-w-full">
              {currentWorkshop.subtitle}
            </p>
          </div>
        </Reveal>

        {/* Workshop Tab Selector Grid */}
        {workshops.length > 1 && (
          <Reveal direction="up" delay={120}>
            <div className="max-w-4xl lg:max-w-6xl mx-auto mb-6 sm:mb-8">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="font-['DM_Sans'] text-xs font-bold text-[#4A2C20] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#B89555]" />
                  Select Guild Workshop
                </span>
                <span className="font-['DM_Sans'] text-xs font-medium text-[#6B4030]">
                  {safeIndex + 1} of {workshops.length} Selected
                </span>
              </div>

              <div
                className={`grid ${
                  workshops.length === 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : workshops.length === 3
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : workshops.length >= 4
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                    : 'grid-cols-1'
                } auto-rows-fr gap-3 sm:gap-4 items-stretch`}
              >
                {workshops.map((ws, idx) => {
                  const isCurrent = safeIndex === idx;
                  const icons = [Flame, Palette, Hammer, Layers];
                  const Icon = icons[idx % icons.length];

                  return (
                    <button
                      key={ws.id}
                      type="button"
                      onClick={() => setActiveWorkshopIndex(idx)}
                      className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl text-left transition-all duration-200 cursor-pointer border flex flex-col justify-between h-full min-w-0 ${
                        isCurrent
                          ? 'bg-[#4A2C20] text-[#F7F2E8] border-[#B89555] shadow-md ring-2 ring-[#B89555]/30'
                          : 'bg-white hover:bg-[#FAF6EE] text-[#241A16] border-[#6B4030]/20 hover:border-[#B89555]/40 shadow-2xs'
                      }`}
                    >
                      {/* Top Row: Icon on left, Price & Selection Indicator on right */}
                      <div className="flex items-center justify-between gap-2 w-full mb-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isCurrent ? 'bg-[#B89555] text-[#241A16]' : 'bg-[#4A2C20]/10 text-[#6B4030]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-['DM_Sans'] font-bold leading-normal inline-flex items-center justify-center whitespace-nowrap ${
                              isCurrent
                                ? 'bg-[#B89555] text-[#241A16]'
                                : 'bg-[#F7F2E8] text-[#4A2C20] border border-[#6B4030]/15'
                            }`}
                          >
                            {ws.fee}
                          </span>
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                              isCurrent
                                ? 'bg-[#B89555] border-[#B89555] text-[#241A16]'
                                : 'border-[#6B4030]/30 bg-transparent'
                            }`}
                          >
                            {isCurrent && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      </div>

                      {/* Content: Title & Subtitle spanning full width without cramped squishing */}
                      <div className="min-w-0 w-full flex-1 flex flex-col justify-end">
                        <span
                          className={`block text-xs sm:text-[13px] font-['DM_Sans'] font-bold leading-snug break-words [overflow-wrap:break-word] hyphens-none ${
                            isCurrent ? 'text-white' : 'text-[#241A16]'
                          }`}
                        >
                          {ws.tabLabel}
                        </span>
                        <span
                          className={`block text-[10.5px] sm:text-[11px] font-['DM_Sans'] mt-1 leading-tight break-words [overflow-wrap:break-word] hyphens-none ${
                            isCurrent ? 'text-[#E5B869]' : 'text-[#6B4030]'
                          }`}
                        >
                          {ws.highlights?.[0]?.label || '1 Day Intensive'} &bull; {ws.feeBadge}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>
        )}

        {/* Master Institutional Guild Atelier Showcase */}
        <Reveal direction="up" delay={150}>
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#6B4030]/15 shadow-sm overflow-hidden mb-6 sm:mb-8">
            {/* 1. Top Specification Ribbon */}
            <div className="bg-[#4A2C20] text-[#F7F2E8] px-5 sm:px-8 py-3.5 sm:py-4 border-b border-[#B89555]/30 flex flex-wrap items-center justify-between gap-3 text-xs font-['DM_Sans']">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E5B869]" />
                <span className="font-bold text-white tracking-wide uppercase">
                  Guild Atelier Specifications
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-[#F7F2E8]/85 text-[11.5px] sm:text-xs">
                {highlights.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <span key={idx} className="inline-flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-[#E5B869]" />
                      <span>{item.label}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* 2. Atelier Visual & Environment Specifications (Balanced 50/50 Dual Pavilion) */}
            <div className="p-5 sm:p-7 lg:p-8 border-b border-[#6B4030]/15 bg-[#FAF7F0]/40">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
                {/* Left Column (5 cols): Workshop Visual with Live Foundry Badge */}
                <div className="lg:col-span-5 flex flex-col justify-between">
                  <div className="relative rounded-2xl overflow-hidden bg-[#241A16] h-64 sm:h-72 lg:h-full min-h-[260px] shadow-inner group">
                    <img
                      src={currentWorkshop.image}
                      alt={currentWorkshop.imageAlt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/artisan/pillar-metal.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#241A16]/85 via-transparent to-transparent" />

                    <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-white">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-['DM_Sans'] font-semibold bg-[#4A2C20]/90 text-[#E5B869] border border-[#B89555]/40 backdrop-blur-xs">
                        <Flame className="w-3.5 h-3.5 text-[#B89555]" />
                        <span>Live Guild Foundry</span>
                      </span>
                      <span className="text-xs font-['DM_Sans'] font-bold text-white bg-black/60 px-3 py-1 rounded-md backdrop-blur-xs">
                        {currentWorkshop.fee}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column (7 cols): Studio Specs 2x2 Grid + Takeaways */}
                <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
                  <div>
                    <h4 className="font-['Cormorant_Garamond'] text-xl sm:text-2xl font-bold text-[#241A16] flex items-center gap-2 border-b border-[#6B4030]/15 pb-2 mb-3">
                      <Hammer className="w-4 h-4 text-[#B89555]" />
                      <span>Studio Environment &amp; Atelier Specifications</span>
                    </h4>

                    {/* 4 Specifications in a Balanced 2x2 Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-['DM_Sans'] mb-3.5 items-stretch">
                      <div className="p-3 rounded-xl bg-white border border-[#6B4030]/15 shadow-2xs flex flex-col justify-between min-h-[72px] h-full">
                        <span className="text-[#6B4030] block text-[10.5px] uppercase font-bold tracking-wider mb-0.5">
                          Foundry Technique:
                        </span>
                        <span className="font-semibold text-[#241A16] break-words [overflow-wrap:anywhere] min-w-0">
                          {foundrySpecs.process}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-[#6B4030]/15 shadow-2xs flex flex-col justify-between min-h-[72px] h-full">
                        <span className="text-[#6B4030] block text-[10.5px] uppercase font-bold tracking-wider mb-0.5">
                          Metals &amp; Raw Stock:
                        </span>
                        <span className="font-semibold text-[#241A16] break-words [overflow-wrap:anywhere] min-w-0">
                          {foundrySpecs.metals}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-[#6B4030]/15 shadow-2xs flex flex-col justify-between min-h-[72px] h-full">
                        <span className="text-[#6B4030] block text-[10.5px] uppercase font-bold tracking-wider mb-0.5">
                          Guild Mentorship Ratio:
                        </span>
                        <span className="font-bold text-[#4A2C20] break-words [overflow-wrap:anywhere] min-w-0">
                          {foundrySpecs.ratio}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-[#6B4030]/15 shadow-2xs flex flex-col justify-between min-h-[72px] h-full">
                        <span className="text-[#6B4030] block text-[10.5px] uppercase font-bold tracking-wider mb-0.5">
                          Studio Tools Provided:
                        </span>
                        <span className="font-medium text-[#241A16]/90 break-words [overflow-wrap:anywhere] min-w-0">
                          {foundrySpecs.tools}
                        </span>
                      </div>
                    </div>

                    {/* Apprentice Studio Package (Takeaways) */}
                    <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#B89555]/30 shadow-2xs space-y-2">
                      <span className="font-['DM_Sans'] text-xs font-bold text-[#4A2C20] uppercase tracking-wider block flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#B89555]" />
                        What You Walk Away With (Apprentice Studio Package):
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {takeaways.map((item, tIdx) => (
                          <div
                            key={tIdx}
                            className="flex items-start gap-2 text-xs font-['DM_Sans'] text-[#241A16] min-w-0"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-snug break-words [overflow-wrap:anywhere] min-w-0">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] font-['DM_Sans'] text-[#6B4030] flex items-center gap-2 pt-1">
                    <ShieldCheck className="w-4 h-4 text-[#B89555] shrink-0" />
                    <span>Full fireproof guild apron &amp; eye protection included.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. The Practical Guild Metallurgy Stages & Daily Syllabus (What You Learn Across 1–9 Days) */}
            <div className="p-5 sm:p-7 lg:p-8 space-y-5 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#6B4030]/15 pb-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4A2C20] text-[#E5B869] text-xs font-bold font-['DM_Sans'] uppercase tracking-wider shadow-2xs">
                      <BookOpen className="w-3.5 h-3.5 text-[#B89555]" />
                      <span>What You Will Learn (1–9 Days Practical Syllabus)</span>
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FAF7F0] border border-[#6B4030]/15 text-[#4A2C20]">
                      {currentWorkshop.highlights?.[0]?.label || currentWorkshop.duration || '1–9 Days'}
                    </span>
                  </div>
                  <h3 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-bold text-[#241A16] leading-tight">
                    Hands-on Daily Learning Curriculum &amp; Studio Modules
                  </h3>
                  <p className="font-['DM_Sans'] text-xs sm:text-sm text-[#6B4030] max-w-2xl leading-relaxed">
                    Step-by-step master artisan curriculum covering canonic theory, material preparation, tactile forging, and live finished artifact takeaways.
                  </p>
                </div>
                <span className="self-start sm:self-auto font-['DM_Sans'] text-xs font-semibold px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#6B4030]/15 text-[#4A2C20] whitespace-nowrap shadow-2xs">
                  {activities.length} Structured Modules
                </span>
              </div>

              {/* Steps in a Balanced 2-Column Responsive Grid (Full width across the card!) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 items-stretch">
                {activities.map((act, index) => {
                  const stepNum = act.step || String(index + 1).padStart(2, '0');
                  const dayTag = act.day || act.period || `Day ${stepNum}`;
                  const stepTitle = act.title || act;
                  const stepDesc =
                    act.desc && act.desc.trim()
                      ? act.desc
                      : 'Hands-on instruction guided directly by master sthapathis.';

                  return (
                    <div
                      key={index}
                      className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[#FAF7F0] hover:bg-[#F7F2E8] border border-[#6B4030]/15 hover:border-[#B89555]/50 transition-all duration-200 flex items-start gap-3.5 text-left group shadow-2xs h-full"
                    >
                      <div className="flex flex-col items-center gap-1.5 shrink-0">
                        <span className="w-8 h-8 rounded-lg bg-[#4A2C20] text-[#E5B869] text-xs font-['DM_Sans'] font-bold flex items-center justify-center shadow-2xs group-hover:bg-[#B89555] group-hover:text-[#241A16] transition-colors">
                          {stepNum}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold font-['DM_Sans'] uppercase tracking-wider bg-[#B89555]/20 text-[#4A2C20] border border-[#B89555]/30">
                            {dayTag}
                          </span>
                          <span className="text-[10px] font-['DM_Sans'] font-medium text-[#6B4030]">
                            Practical Focus
                          </span>
                        </div>
                        <h4 className="font-['Cormorant_Garamond'] text-base sm:text-lg font-bold text-[#241A16] leading-snug group-hover:text-[#4A2C20] break-words [overflow-wrap:break-word] hyphens-none min-w-0">
                          {stepTitle}
                        </h4>
                        <p className="font-['DM_Sans'] text-xs text-[#6B4030] leading-relaxed break-words [overflow-wrap:break-word] hyphens-none min-w-0 pt-0.5">
                          {stepDesc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Full-Width Guild Studio Enrollment Anchor Bar (Bottom of Card) */}
            <div className="bg-[#4A2C20] text-[#F7F2E8] p-5 sm:p-7 border-t border-[#B89555]/30">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6">
                {/* Part 1: Pricing & Inclusions */}
                <div className="text-center lg:text-left space-y-1 w-full lg:w-auto">
                  <span className="font-['DM_Sans'] text-[10.5px] text-[#E5B869] font-bold uppercase tracking-wider block">
                    {currentWorkshop.feeBadge || 'Guild Studio Access'}
                  </span>
                  <div className="flex items-baseline justify-center lg:justify-start gap-2">
                    <span className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl font-bold text-white leading-none">
                      {currentWorkshop.fee}
                    </span>
                    <span className="font-['DM_Sans'] text-xs text-[#F7F2E8]/80">
                      (All raw metals &amp; tools included)
                    </span>
                  </div>
                  <p className="font-['DM_Sans'] text-xs text-[#F7F2E8]/75">
                    {currentWorkshop.feeNote}
                  </p>
                </div>

                {/* Part 2: Seat Scarcity Live Progress */}
                <div className="w-full lg:max-w-xs space-y-2 bg-white/10 p-3.5 rounded-xl border border-white/15">
                  <div className="flex items-center justify-between text-xs font-['DM_Sans']">
                    <span className="font-bold text-[#E5B869] flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#B89555]" />
                      <span>Seats Scarcity</span>
                    </span>
                    <span className="font-bold text-white">
                      {seatsAvailable} Left of {seatsTotal}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/30 overflow-hidden">
                    <div
                      className="h-full bg-[#B89555] rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(seatsPercent, 20)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#F7F2E8]/80 leading-tight">
                    {currentWorkshop.seatsDesc}
                  </p>
                </div>

                {/* Part 3: Reservation Action CTA */}
                <div className="w-full lg:w-auto shrink-0 text-center space-y-1.5">
                  {currentWorkshop.isFull ? (
                    <span className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-['DM_Sans'] text-xs font-semibold text-red-800 bg-red-100/90 border border-red-300 cursor-not-allowed">
                      <span>Workshop Full</span>
                    </span>
                  ) : (
                    <Link
                      to={`/register?course=${encodeURIComponent(currentWorkshop.title)}&duration=${encodeURIComponent(currentWorkshop.highlights?.[0]?.label?.match(/\d+\s*day[s]?/i)?.[0] || '1 Day')}`}
                      onClick={() => window.scrollTo(0, 0)}
                      className="w-full lg:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-['DM_Sans'] text-sm font-bold text-[#241A16] bg-[#B89555] hover:bg-[#c8a565] shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                    >
                      <span>Reserve Studio Anvil</span>
                      <ArrowRight className="w-4 h-4 text-[#241A16]" />
                    </Link>
                  )}
                  <p className="text-[10px] font-['DM_Sans'] text-[#F7F2E8]/70">
                    Direct mentorship with certified temple sthapathis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
