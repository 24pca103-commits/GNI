export const DEFAULT_FEEDBACKS = [
  {
    id: 1,
    name: 'Ananthi Selvaraj',
    role: 'Sacred Jewellery Designer',
    batch: 'Cohort Alumni • Naga Metallurgy',
    location: 'Chennai',
    review:
      'Learning handmade naga repousse and sacred iconography under traditional sthapathis unlocked a lucrative luxury market for my atelier. Orders tripled within 4 months.',
    rating: 5,
    status: 'approved',
    created_at: '2026-09-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'Arunachalam Murugan',
    role: 'Conservation Architect',
    batch: 'Cohort Alumni • Epigraphy Track',
    location: 'Madurai',
    review:
      'The Tamili script deciphering and stone inscription modules gave me the authentic foundation required for heritage conservation projects.',
    rating: 5,
    status: 'approved',
    created_at: '2026-09-22T14:15:00Z',
  },
  {
    id: 3,
    name: 'Priyadharshini K.',
    role: 'Textile & Blouse Creator',
    batch: 'Cohort Alumni • Rock Art & Painting',
    location: 'Coimbatore',
    review:
      'I learned to grind natural mineral pigments and transcribe ancient temple motifs into custom bridal blouses. A dignified six-figure monthly livelihood.',
    rating: 5,
    status: 'approved',
    created_at: '2026-10-02T11:45:00Z',
  },
  {
    id: 4,
    name: 'Venkatesh Raman',
    role: 'Luxury Interior Consultant',
    batch: 'Cohort Alumni • Heritage Interiors',
    location: 'Bangalore',
    review:
      'Clients gladly pay a high premium for hand-beaten sacred brass panels and pooja sanctums. GNI taught me the commercial framework of sacred craft.',
    rating: 5,
    status: 'approved',
    created_at: '2026-10-12T09:20:00Z',
  },
  {
    id: 5,
    name: 'Kavinraj Thirunavukkarasu',
    role: 'Temple Muralist & Calligrapher',
    batch: 'Cohort Alumni • Epigraphical Arts',
    location: 'Thanjavur',
    review:
      'The rare palm-leaf manuscript preservation techniques and natural binder recipes gave my temple restoration work unprecedented authenticity and acclaim.',
    rating: 5,
    status: 'approved',
    created_at: '2026-10-18T16:00:00Z',
  },
  {
    id: 6,
    name: 'Meenakshi Sundaram',
    role: 'Sacred Bronze Sculptor',
    batch: 'Cohort Alumni • Lost Wax Metallurgy',
    location: 'Kumbakonam',
    review:
      'Understanding the Dhyana Shlokas and Shilpa Shastras allowed me to create museum-grade icons. GNI connects timeless traditions with global connoisseurs.',
    rating: 5,
    status: 'approved',
    created_at: '2026-10-24T13:10:00Z',
  },
];

export function getStoredFeedbacks() {
  try {
    const raw = localStorage.getItem('gni_feedbacks');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (_) {}
  return DEFAULT_FEEDBACKS;
}

export function saveStoredFeedbacks(feedbacks) {
  try {
    localStorage.setItem('gni_feedbacks', JSON.stringify(feedbacks));
    window.dispatchEvent(new Event('storage'));
  } catch (_) {}
}
