import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Clock,
  Compass,
  ArrowRight,
  CheckCircle2,
  Users,
  Tag,
  Flame,
} from 'lucide-react';
import Reveal from './Reveal';
import GniLoader from './GniLoader';
import { fetchActiveCourses } from '../services/api';

// Fallback initial heritage courses in case API is offline
const INITIAL_COURSES = [
  {
    id: 1,
    title: 'Painting & Natural Mineral Pigments',
    slug: 'painting-natural-mineral-pigments',
    category: 'Painting & Natural Pigments',
    badge: 'Popular Masterclass',
    duration: '60 Days',
    mode: 'Studio Hands-on',
    original_price: 9999,
    discount_price: 4999,
    discount_percent: 50,
    description: 'Master ancient Tamil fresco techniques, natural organic pigment extraction from raw minerals and flora, and sacred temple iconography proportions.',
    highlights: 'Natural rock & mineral grinding; Shilpa sastra proportion drafting; Authentic temple mural restoration exposure; Take-home certified sample tablet',
    image_url: '/artisan/studio-pigments.jpg',
    seats_total: 50,
    seats_available: 18,
    is_active: 1,
  },
  {
    id: 2,
    title: 'Libi – Language, Scripts & Epigraphy',
    slug: 'libi-language-scripts-epigraphy',
    category: 'Libi & Epigraphy',
    badge: 'Historical Archiving',
    duration: '60 Days',
    mode: 'Archive & Fieldwork',
    original_price: 8999,
    discount_price: 4499,
    discount_percent: 50,
    description: 'Decipher 3rd century BCE Tamili Brahmi characters, transcribe hero stone inscriptions, and scribe archival palm-leaf manuscripts with traditional brass styluses.',
    highlights: 'Stone rubbing and inked paper impressions; Palm-leaf manuscript preservation; Tamili Brahmi glyph decoding chart; Archaeological field study documentation',
    image_url: '/artisan/pillar-epigraphy.jpg',
    seats_total: 40,
    seats_available: 14,
    is_active: 1,
  },
  {
    id: 3,
    title: 'Sculpturing & Sacred Nagas Metal Art',
    slug: 'sculpturing-sacred-nagas-metal-art',
    category: 'Sculpturing & Metal Art',
    badge: 'Bestseller Cohort',
    duration: '60 Days',
    mode: 'Master Metallurgy Forge',
    original_price: 11999,
    discount_price: 5999,
    discount_percent: 50,
    description: 'Learn traditional lost-wax brass casting, antique naga jewellery fabrication, copper repousse hammering, and precision iconographic metal chiseling.',
    highlights: 'Direct sthapathi guild apprenticeship; Antique ornament repousse chasing; Traditional furnace and lost-wax molding; Mastercraft certificate of metallurgy',
    image_url: '/artisan/pillar-metal.jpg',
    seats_total: 35,
    seats_available: 9,
    is_active: 1,
  },
  {
    id: 4,
    title: 'Heritage Applications & Interior Crafts',
    slug: 'heritage-applications-interior-crafts',
    category: 'Heritage Applications',
    badge: 'Commercial Architecture',
    duration: '60 Days',
    mode: 'Studio & Site Project',
    original_price: 9999,
    discount_price: 4999,
    discount_percent: 50,
    description: 'Translate classical Dravidian design language into contemporary luxury interiors, boutique heritage hospitality motifs, and custom architectural artisan elements.',
    highlights: 'Commercial client portfolio development; Sustainable vernacular materials; Modern artisan business modeling; Real-world architectural showcase project',
    image_url: '/artisan/pillar-applications.jpg',
    seats_total: 45,
    seats_available: 21,
    is_active: 1,
  },
];

export default function CoursesSection() {
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadCourses = async () => {
      setLoading(true);
      try {
        const liveCourses = await fetchActiveCourses();
        if (isMounted && liveCourses && liveCourses.length > 0) {
          setCourses(liveCourses);
        }
      } catch (err) {
        console.warn('Using default courses list:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadCourses();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = ['All', ...new Set(courses.map((c) => c.category || 'Heritage').filter(Boolean))];

  const filteredCourses =
    activeCategory === 'All'
      ? courses
      : courses.filter((c) => c.category === activeCategory);

  return (
    <section id="courses" className="py-12 sm:py-16 md:py-20 bg-[#F7F2E8] relative overflow-hidden border-t border-[#6B4030]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <Reveal direction="down">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#4A2C20]/10 border border-[#B89555]/30 text-[#6B4030] text-xs font-['DM_Sans'] font-semibold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#B89555] animate-pulse" />
              <span>Admissions Open 2026 • Live Cohort Discount Offers</span>
            </div>

            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight leading-normal pb-1">
              Curated Heritage Courses &amp; Masterclasses
            </h2>

            <p className="font-['DM_Sans'] text-xs sm:text-sm text-[#241A16]/80 leading-relaxed max-w-2xl mx-auto text-center">
              Direct hereditary sthapathi training with raw pigments, inscription tools, metallurgy molds, and live project mentorship included. Enroll with limited-time cohort admission discounts.
            </p>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-['DM_Sans'] transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#4A2C20] text-[#F7F2E8] font-bold shadow-xs border border-[#4A2C20]'
                      : 'bg-white/80 hover:bg-white text-[#6B4030] border border-[#6B4030]/20 font-medium'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Courses Grid or GNI Loader */}
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center">
            <GniLoader size="md" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
            {filteredCourses.map((course, idx) => {
            const origPrice = Number(course.original_price) || 0;
            const discPrice = Number(course.discount_price) || 0;
            const discPercent =
              course.discount_percent ||
              (origPrice > 0 ? Math.round(((origPrice - discPrice) / origPrice) * 100) : 0);

            const highlightList = course.highlights
              ? course.highlights.split(';').map((s) => s.trim()).filter(Boolean)
              : [];

            return (
              <Reveal key={course.id || idx} direction="up" delay={idx * 100}>
                <div className="h-full bg-white rounded-2xl sm:rounded-3xl border border-[#6B4030]/20 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group">
                  {/* Image & Badges Banner */}
                  <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-[#241A16]">
                    <img
                      src={course.image_url || '/artisan/workshop.jpg'}
                      alt={course.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/artisan/workshop.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Top Floating Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-[#4A2C20]/90 text-[#F7F2E8] backdrop-blur-xs border border-[#B89555]/40 text-[10px] sm:text-xs font-['DM_Sans'] font-semibold">
                        {course.badge || 'Admissions Open'}
                      </span>

                      {discPercent > 0 && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600 text-white font-['DM_Sans'] text-[10px] sm:text-xs font-bold shadow-xs animate-pulse">
                          <Flame className="w-3 h-3 text-amber-300" />
                          <span>{discPercent}% OFF</span>
                        </span>
                      )}
                    </div>

                    {/* Bottom overlay info inside image */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-['DM_Sans']">
                      <span className="flex items-center gap-1 text-[#F7F2E8]">
                        <Clock className="w-3.5 h-3.5 text-[#B89555]" />
                        <span>{course.duration || '60 Days'}</span>
                      </span>
                      <span className="flex items-center gap-1 text-[#F7F2E8]/90 bg-black/40 px-2 py-0.5 rounded-full">
                        <Compass className="w-3.5 h-3.5 text-[#B89555]" />
                        <span>{course.mode || 'Studio Hands-on'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Course Body Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4 min-w-0">
                    <div className="space-y-2 min-w-0">
                      <span className="text-[11px] font-['DM_Sans'] font-bold uppercase tracking-wider text-[#B89555] block">
                        {course.category}
                      </span>
                      <h3 className="font-['Cormorant_Garamond'] text-xl sm:text-2xl font-bold text-[#241A16] group-hover:text-[#4A2C20] transition-colors leading-tight min-h-[52px] flex items-center break-words [overflow-wrap:anywhere] min-w-0 max-w-full">
                        {course.title}
                      </h3>
                      <p className="font-['DM_Sans'] text-xs text-[#241A16]/75 leading-relaxed break-words [overflow-wrap:anywhere] min-w-0 max-w-full min-h-[36px]">
                        {course.description}
                      </p>
                    </div>

                    {/* Highlights list - Uniform Height */}
                    <div className="space-y-1.5 pt-1 border-t border-[#6B4030]/10 min-h-[82px] flex flex-col justify-center min-w-0">
                      <span className="text-[11px] font-['DM_Sans'] font-bold text-[#4A2C20] block">
                        Key Takeaways &amp; Skills:
                      </span>
                      {highlightList.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11.5px] font-['DM_Sans'] text-[#6B4030]">
                          {highlightList.slice(0, 4).map((h, hIdx) => (
                            <div key={hIdx} className="flex items-start gap-1.5 min-w-0">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="break-words [overflow-wrap:anywhere] min-w-0 max-w-full">{h}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11.5px] font-['DM_Sans'] text-[#6B4030]/70 italic">
                          Studio masterclass syllabus &amp; live practice included.
                        </p>
                      )}
                    </div>

                    {/* Seats & Progress indicator */}
                    <div className="pt-2 border-t border-[#6B4030]/10 flex items-center justify-between text-xs font-['DM_Sans']">
                      <div className="flex items-center gap-1.5 text-[#6B4030]">
                        <Users className="w-3.5 h-3.5 text-[#B89555]" />
                        <span>
                          Seats: <strong className="text-[#4A2C20]">{course.seats_available !== undefined ? course.seats_available : 12} left</strong> of {course.seats_total || 50}
                        </span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                        course.seats_available === 0
                          ? 'text-red-700 bg-red-50 border-red-200'
                          : (course.seats_available <= 5 || course.availability_status === 'Almost Full')
                          ? 'text-amber-800 bg-amber-50 border-amber-200'
                          : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      }`}>
                        {course.seats_available === 0 ? 'Full' : (course.seats_available <= 5 || course.availability_status === 'Almost Full') ? 'Almost Full' : 'Available'}
                      </span>
                    </div>

                    {/* Pricing & CTA Card */}
                    <div className="pt-3 border-t border-[#6B4030]/15 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-bold text-[#241A16]">
                            ₹{discPrice.toLocaleString('en-IN')}
                          </span>
                          {origPrice > discPrice && (
                            <span className="text-xs font-['DM_Sans'] text-[#6B4030]/60 line-through">
                              ₹{origPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        {discPercent > 0 && (
                          <span className="text-[10.5px] font-['DM_Sans'] text-emerald-700 font-semibold block">
                            Save ₹{(origPrice - discPrice).toLocaleString('en-IN')} ({discPercent}% discount)
                          </span>
                        )}
                      </div>

                      {course.seats_available === 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-['DM_Sans'] text-xs font-semibold text-red-800 bg-red-100/90 border border-red-300 cursor-not-allowed shrink-0">
                          <span>Fully Booked</span>
                        </span>
                      ) : (
                        <Link
                          to={`/register?course=${encodeURIComponent(course.title)}&duration=${encodeURIComponent(course.duration || '60 Days')}`}
                          onClick={() => window.scrollTo(0, 0)}
                          className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl font-['DM_Sans'] text-xs font-semibold text-[#241A16] bg-[#B89555] hover:bg-[#c8a565] shadow-sm transition-all border border-[#B89555] cursor-pointer shrink-0"
                        >
                          <span>Enroll Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
        )}

        {/* Bottom Banner */}
        <div className="mt-8 sm:mt-12 p-4 sm:p-5 rounded-2xl bg-[#4A2C20] text-[#F7F2E8] border border-[#B89555]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-['Cormorant_Garamond'] text-lg sm:text-xl font-bold text-white">
              Need custom organizational cohorts or institutional syllabus?
            </h4>
            <p className="font-['DM_Sans'] text-xs text-[#F7F2E8]/80">
              We design specialized temple architecture, epigraphy archives, and metallurgy modules for universities, design studios &amp; museums.
            </p>
          </div>
          <Link
            to="/register"
            onClick={() => window.scrollTo(0, 0)}
            className="px-5 py-2.5 rounded-xl bg-[#B89555] hover:bg-[#c8a565] text-[#241A16] text-xs font-['DM_Sans'] font-semibold shadow-xs shrink-0 transition-colors"
          >
            Apply for Custom Cohort
          </Link>
        </div>
      </div>
    </section>
  );
}
