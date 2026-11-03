/**
 * Structured customer-facing content for the canonical offerings, keyed by slug.
 *
 * - `highlights` is stored as a JSON array in `courses.highlights`
 *   Workshops: [{ day, title, desc }]
 *   Journeys:  [{ period, title, details, outcome, materials: [] }]
 * - `details` is stored as a JSON object in `courses.details`
 *   { inclusions, field_visit: { enabled, title, description } }
 *
 * Used to seed a fresh database and to backfill rows created before these fields existed.
 * Everything here stays editable from the admin panel afterwards.
 */

export const DEFAULT_COURSE_CONTENT = {
  // ==========================================
  // WORKSHOPS
  // ==========================================
  'ancient-tamil-art-heritage-workshop': {
    highlights: [
      { day: '', title: 'Prehistoric Rock Pigment Grinding', desc: 'Grind raw red ochre and yellow limonite with granite mortars, blending them with organic tree gum.' },
      { day: '', title: 'Ancient Tamili Script Decoding', desc: 'Decode Sangam-era Tamili Brahmi letterforms and learn classical orthography with archival historians.' },
      { day: '', title: 'Temple Geometry & Proportion Canons', desc: 'Construct sacred geometric layouts and divine grid proportions on handmade palm-leaf sheets.' },
      { day: '', title: 'Copper Plate Charter Scribing', desc: 'Scribe ancient verses into annealed copper sheets using traditional hardened steel styluses.' },
      { day: '', title: 'Archival Ink Rubbing', desc: 'Take heritage ink rubbings of historical inscriptions for your archival portfolio.' },
      { day: '', title: 'Finishing & Presentation', desc: 'Mount and seal your copper inscription and fresco tablet in a GNI archival portfolio.' },
    ],
    details: {
      inclusions: 'Raw mineral pigments, copper plate and a complete scribing kit are included.',
      field_visit: { enabled: false, title: '', description: '' },
    },
  },

  'sacred-metal-casting-jewellery-workshop': {
    highlights: [
      { day: '', title: 'Sacred Dravidian Wax Modelling', desc: 'Draft canonic proportion grids and hand-carve beeswax & dammar resin blanks into sacred serpent forms.' },
      { day: '', title: 'Clay Investment Mould', desc: 'Coat the wax model in layered river silt and termite-clay slurry, reinforced with cotton husk fibres.' },
      { day: '', title: 'Crucible Pouring', desc: 'Melt antique brass alloy in a graphite crucible and pour the molten metal into the de-waxed cavity.' },
      { day: '', title: 'Quenching & De-moulding', desc: 'Quench the hot casting, break away the fired clay core and inspect your raw cast piece.' },
      { day: '', title: 'Repoussé Relief & Chasing', desc: 'Set the metal on a pine-rosin pitch bowl and chase fine relief scales, eyes and shilpa engravings.' },
      { day: '', title: 'Patina & Polishing', desc: 'Treat with traditional herbal and mineral oxidisers for an antique heirloom finish, then buff.' },
    ],
    details: {
      inclusions: 'Brass alloy stock, chasing tools, fireproof apron and eye protection are included.',
      field_visit: { enabled: false, title: '', description: '' },
    },
  },

  'traditional-painting-workshop': {
    highlights: [
      { day: '', title: 'Raw Earth Mineral Identification', desc: 'Identify and sort natural iron oxides, cinnabar, copper carbonates and lapis from historical quarry sites.' },
      { day: '', title: 'Granite Pestle Wet Milling', desc: 'Grind raw mineral rocks into microfine powder on traditional granite muller slabs.' },
      { day: '', title: 'Natural Binder Formulation', desc: 'Blend tree gums, tender coconut water and neem resin for permanent archival binding.' },
      { day: '', title: 'Wet Lime Plaster Ground', desc: 'Lay seasoned slaked lime and river sand on terracotta tiles in the classic Chola fresco tradition.' },
      { day: '', title: 'Iconographic Brushwork', desc: 'Paint sacred deity outlines and floral creepers with handcrafted bamboo and hair brushes.' },
      { day: '', title: 'Agate Burnishing', desc: 'Burnish the damp pigment surface with polished river agates to seal the mineral hues.' },
    ],
    details: {
      inclusions: 'Raw mineral stones, a limestone mortar slab and natural binder extracts are included.',
      field_visit: { enabled: false, title: '', description: '' },
    },
  },

  'epigraphy-ancient-scripts': {
    highlights: [
      { day: '', title: 'Evolution of Sangam Tamili Script', desc: 'Examine hero-stone inscriptions and trace how Tamili developed from Asokan Brahmi.' },
      { day: '', title: 'Palm Leaf Folio Preparation', desc: 'Season dried palmyra leaves with turmeric and herbal smoke so they resist moisture.' },
      { day: '', title: 'Iron Stylus Incision', desc: 'Master the single-stroke incision technique without piercing the dried palm-leaf fibres.' },
      { day: '', title: 'Lampblack & Herbal Inking', desc: 'Rub lampblack soot and aromatic oils across the incisions to reveal crisp black lettering.' },
      { day: '', title: 'Copper Plate Charter Scribing', desc: 'Transfer classical royal epigraphs onto annealed copper plates with dynastic emblems.' },
      { day: '', title: 'Conservation & Binding', desc: 'Clean, oil and bind your folios with red silk cord and seasoned wooden covers.' },
    ],
    details: {
      inclusions: 'A polished copper plate, palm leaves, stylus and archival ink are included.',
      field_visit: { enabled: false, title: '', description: '' },
    },
  },

  // ==========================================
  // LEARNING JOURNEYS
  // ==========================================
  '60-day-heritage-creator-journey': {
    highlights: [
      {
        period: 'Day 1–10',
        title: 'Drawing & Sacred Proportions',
        details: 'Foundational shilpa geometric grids, traditional drafting styles, sacred motifs and palm-leaf stylus drafting.',
        outcome: 'Temple proportion grid & sacred motif portfolio',
        materials: ['Natural graphite', 'Bamboo stylus', 'Handmade cotton paper', 'Proportion calipers'],
      },
      {
        period: 'Day 11–20',
        title: 'Tamili Brahmi & Epigraphy',
        details: 'Decipher Tamil Brahmi scripts, study copper plate royal charters, and practise rock scribing and archival rubbings.',
        outcome: 'Hand-scribed copper inscription tablet in ancient Tamili',
        materials: ['Annealed copper sheets', 'Hardened steel styluses', 'Ink rubbing pads', 'Palm-leaf manuscripts'],
      },
      {
        period: 'Day 21–30',
        title: 'Natural Pigments & Rock Art',
        details: 'Extract and grind prehistoric earth pigments from raw minerals, with natural fixatives and limestone fresco washes.',
        outcome: 'Mineral pigment mural on prepared lime plaster',
        materials: ['Red ochre & yellow limonite', 'Granite mortar & pestle', 'Neem gum binder', 'Lime plaster slab'],
      },
      {
        period: 'Day 31–40',
        title: 'Iconography & Spiritual Geometry',
        details: 'Deity proportions, spiritual geometry and shilpa canons, expressed through relief clay modelling.',
        outcome: 'Traditional iconographic relief model',
        materials: ['Riverbed terracotta clay', 'Boxwood sculpting ribs', 'Proportion compasses', 'Canonic manuscripts'],
      },
      {
        period: 'Day 41–50',
        title: 'Metal Craft & Naga Jewellery',
        details: 'Brass sheet forming, pitch-bowl repoussé chasing, sacred Naga ornamental motifs and antique soldering.',
        outcome: 'Chased Naga repoussé medallion in solid brass',
        materials: ['Jewellery brass alloy', 'Pine pitch chasing bowl', 'Chasing chisels', 'Hardwood mallet'],
      },
      {
        period: 'Day 51–60',
        title: 'Commercial Practice & Field Visit',
        details: 'Apply heritage craft to textiles, interiors, branding, pooja décor and livelihood, plus one immersive field visit.',
        outcome: 'Heritage creator portfolio & GNI guild credential',
        materials: ['Design templates', 'Exhibition mounts', 'Field study sketchbook', 'Certificate portfolio'],
      },
    ],
    details: {
      inclusions: 'All studio materials, tools and the guided field visit are included.',
      field_visit: {
        enabled: true,
        title: 'Includes an on-site field visit',
        description: 'Explore ancient temple rock inscriptions, heritage guilds and working master-artisan studios across Tamil Nadu, guided by historians.',
      },
    },
  },

  '30-day-heritage-foundation-track': {
    highlights: [
      {
        period: 'Day 1–10',
        title: 'Drawing & Line Geometry',
        details: 'Sacred Dravidian proportion grids, kolam mathematics and precision temple line fundamentals.',
        outcome: 'Sacred Dravidian proportion grids & line canons',
        materials: ['Natural graphite', 'Proportion dividers', 'Handmade cotton rag paper'],
      },
      {
        period: 'Day 11–20',
        title: 'Tamili Inscriptions & Palm Leaf',
        details: 'Tamili Brahmi letterforms, stylus handling, copper plate epigraphy and palm-leaf decoding.',
        outcome: 'Engraved Tamili inscription plaque',
        materials: ['Annealed copper sheet', 'Engraving stylus', 'Archival ink'],
      },
      {
        period: 'Day 21–30',
        title: 'Natural Pigments & Mural Art',
        details: 'Raw mineral grinding, natural binder blending and lime fresco tablet painting.',
        outcome: 'Finished natural mineral fresco tablet',
        materials: ['Natural earth minerals', 'Granite pestle', 'Fresco plaster tablet'],
      },
    ],
    details: {
      inclusions: 'All studio materials and tools are included.',
      field_visit: { enabled: false, title: '', description: '' },
    },
  },
};

export default DEFAULT_COURSE_CONTENT;
