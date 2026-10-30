import React, { useRef, useEffect, useState } from 'react';
import { Star, MessageSquareQuote, Plus, X, CheckCircle2, AlertCircle } from 'lucide-react';
import Reveal from './Reveal';
import FloatingBubbles from './FloatingBubbles';
import { fetchPublicFeedbacks, submitFeedback } from '../services/api';

const DEFAULT_TESTIMONIALS = [
  {
    name: 'Ananthi Selvaraj',
    role: 'Sacred Jewellery Designer, Chennai',
    batch: 'Cohort Alumni • Naga Metallurgy',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    review:
      'Learning handmade naga repousse and sacred iconography under traditional sthapathis unlocked a lucrative luxury market for my atelier. Orders tripled within 4 months.',
    rating: 5,
  },
  {
    name: 'Arunachalam Murugan',
    role: 'Conservation Architect, Madurai',
    batch: 'Cohort Alumni • Epigraphy Track',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    review:
      'The Tamili script deciphering and stone inscription modules gave me the authentic foundation required for heritage conservation projects.',
    rating: 5,
  },
  {
    name: 'Priyadharshini K.',
    role: 'Textile & Blouse Creator, Coimbatore',
    batch: 'Cohort Alumni • Rock Art & Painting',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80',
    review:
      'I learned to grind natural mineral pigments and transcribe ancient temple motifs into custom bridal blouses. A dignified six-figure monthly livelihood.',
    rating: 5,
  },
  {
    name: 'Venkatesh Raman',
    role: 'Luxury Interior Consultant, Bangalore',
    batch: 'Cohort Alumni • Heritage Interiors',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    review:
      'Clients gladly pay a high premium for hand-beaten sacred brass panels and pooja sanctums. GNI taught me the commercial framework of sacred craft.',
    rating: 5,
  },
  {
    name: 'Kavinraj Thirunavukkarasu',
    role: 'Temple Muralist & Calligrapher, Thanjavur',
    batch: 'Cohort Alumni • Epigraphical Arts',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    review:
      'The rare palm-leaf manuscript preservation techniques and natural binder recipes gave my temple restoration work unprecedented authenticity and acclaim.',
    rating: 5,
  },
  {
    name: 'Meenakshi Sundaram',
    role: 'Sacred Bronze Sculptor, Kumbakonam',
    batch: 'Cohort Alumni • Lost Wax Metallurgy',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    review:
      'Understanding the Dhyana Shlokas and Shilpa Shastras allowed me to create museum-grade icons. GNI connects timeless traditions with global connoisseurs.',
    rating: 5,
  },
];

export default function Testimonials() {
  const scrollRef = useRef(null);
  const isInteractingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const timeoutRef = useRef(null);

  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    batch: '',
    location: '',
    rating: 5,
    review: '',
  });

  // Load approved feedbacks from database & localStorage with real-time storage event listener
  useEffect(() => {
    const loadApproved = async () => {
      let combinedApproved = [];

      // 1. Try fetching from live backend
      try {
        const live = await fetchPublicFeedbacks();
        if (live && live.length > 0) {
          combinedApproved = live;
        }
      } catch (_) {}

      // 2. Merge with approved reviews from local storage
      try {
        const raw = localStorage.getItem('gni_feedbacks');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            parsed.forEach((storedItem) => {
              if (
                storedItem.status === 'approved' &&
                !combinedApproved.some((c) => String(c.id) === String(storedItem.id))
              ) {
                combinedApproved.push(storedItem);
              }
            });
          }
        }
      } catch (_) {}

      if (combinedApproved.length > 0) {
        const formatted = combinedApproved.map((f, i) => ({
          name: f.name,
          role: f.role || 'Heritage Creator',
          batch: f.batch || 'Cohort Alumni',
          review: f.review,
          rating: Number(f.rating) || 5,
        }));
        setTestimonials(formatted);
      } else {
        setTestimonials(DEFAULT_TESTIMONIALS);
      }
    };

    loadApproved();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingSelect = (val) => {
    setFormData((prev) => ({ ...prev, rating: val }));
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!formData.name.trim()) {
      setSubmitError('Please enter your full name.');
      return;
    }
    if (!formData.review.trim() || formData.review.trim().length < 10) {
      setSubmitError('Please enter a feedback message with at least 10 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await submitFeedback(formData);
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
        setFormData({
          name: '',
          role: '',
          batch: '',
          location: '',
          rating: 5,
          review: '',
        });
      }, 2500);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  // Tripled list for infinite seamless looping
  const displayList = [...testimonials, ...testimonials, ...testimonials];

  // Helper to resume auto-scroll after inactivity
  const resetInteractionTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, 2200);
  };

  // Continuous smooth auto-scroll loop (60fps requestAnimationFrame)
  useEffect(() => {
    let animId;
    const speed = 0.75; // smooth auto-scroll speed

    const step = () => {
      const el = scrollRef.current;
      if (el && !isInteractingRef.current) {
        el.scrollLeft += speed;
        const oneThird = el.scrollWidth / 3;
        if (el.scrollLeft >= oneThird * 2) {
          el.scrollLeft -= oneThird;
        } else if (el.scrollLeft <= 0) {
          el.scrollLeft += oneThird;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(animId);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Mouse Drag Handlers
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    isInteractingRef.current = true;
    startXRef.current = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeftRef.current = scrollRef.current?.scrollLeft || 0;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    resetInteractionTimeout();
  };

  const handleMouseEnter = () => {
    isInteractingRef.current = true;
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
    resetInteractionTimeout();
  };

  // Touch Handlers for Mobile Swipe
  const handleTouchStart = () => {
    isInteractingRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleTouchEnd = () => {
    resetInteractionTimeout();
  };

  return (
    <section id="testimonials" className="py-8 md:py-16 bg-white relative overflow-hidden border-t border-[#6B4030]/15">
      {/* Floating Animated Bubbles */}
      <FloatingBubbles count={8} color="#B89555" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header in Title Case with Share Review CTA */}
        <Reveal direction="up" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#4A2C20]/10 border border-[#6B4030]/20 text-[#6B4030] text-xs font-['DM_Sans'] font-medium mb-2.5">
              <MessageSquareQuote className="w-3.5 h-3.5 text-[#B89555]" />
              <span>Artisan Alumni Voices</span>
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight leading-[1.2] pb-1">
              Words From Our Heritage Creators
            </h2>
            <div className="w-16 h-0.5 bg-[#B89555] mx-auto mt-2.5" />
            <p className="font-['DM_Sans'] mt-2.5 text-sm sm:text-base text-[#6B4030] leading-relaxed font-normal text-center mx-auto max-w-2xl mb-4">
              Real feedback from architects, designers, and artisans whose skills and livelihoods were transformed.
            </p>

            <button
              type="button"
              onClick={() => {
                setSubmitError('');
                setSubmitSuccess(false);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4A2C20] hover:bg-[#603929] text-[#F7F2E8] text-xs sm:text-sm font-['DM_Sans'] font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#B89555]" />
              <span>Share Your Feedback</span>
            </button>
          </div>
        </Reveal>

        {/* Auto-Scrolling & Manual Drag/Swipe Track */}
        <Reveal direction="up" delay={150}>
          <div className="relative py-2">
            {/* Desktop-only Soft Fade Gradient Masks (hidden on mobile to prevent clipping/cutting off cards) */}
            <div className="hidden sm:block pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
            <div className="hidden sm:block pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

            {/* Scroll Container with combined auto-scroll and manual swipe/drag */}
            <div
              ref={scrollRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-3 px-2 sm:px-4 cursor-grab active:cursor-grabbing select-none"
            >
              {displayList.map((item, idx) => (
                <div
                  key={idx}
                  className="w-[85vw] max-w-[315px] sm:w-[360px] md:w-[380px] shrink-0 flex flex-col"
                >
                  <div className="bg-[#F7F2E8] rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-[#6B4030]/15 shadow-sm hover:shadow-xl hover:border-[#B89555]/50 transition-all duration-300 flex flex-col justify-between h-full group/card">
                    <div>
                      {/* Rating Stars in Antique Gold #B89555 & Quote Icon */}
                      <div className="flex items-center justify-between mb-2.5 sm:mb-4">
                        <div className="flex items-center gap-1">
                          {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#B89555] text-[#B89555]" />
                          ))}
                        </div>
                        <MessageSquareQuote className="w-4 h-4 sm:w-5 sm:h-5 text-[#6B4030]/30 group-hover/card:text-[#B89555] transition-colors" />
                      </div>

                      {/* Review Text */}
                      <p className="font-['DM_Sans'] text-[#241A16] text-xs sm:text-[13.5px] leading-relaxed italic mb-3 sm:mb-5 font-normal text-left">
                        "{item.review}"
                      </p>
                    </div>

                    {/* Author Info (Initial Avatar without photo) */}
                    <div className="pt-2.5 sm:pt-4 border-t border-[#6B4030]/15 flex items-center gap-2.5 sm:gap-3.5">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#4A2C20] text-[#E5B869] font-bold flex items-center justify-center font-['Cormorant_Garamond'] text-base sm:text-lg border border-[#B89555]/30 shadow-xs shrink-0 select-none">
                        {(item.name || 'G').trim().charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 text-left">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-['Cormorant_Garamond'] font-bold text-[#241A16] text-sm sm:text-base leading-tight break-words">
                            {item.name}
                          </h3>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B89555] shrink-0" title="Verified Cohort Graduate" />
                        </div>
                        <p className="font-['DM_Sans'] text-[10px] sm:text-xs font-semibold text-[#6B4030] break-words">
                          {item.role}
                        </p>
                        <p className="font-['DM_Sans'] text-[9px] sm:text-[10.5px] text-[#B89555] font-medium mt-0.5 break-words">
                          {item.batch}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Share Feedback Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#6B4030]/20 shadow-2xl relative text-left">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-[#6B4030] hover:text-[#241A16] p-1.5 rounded-full hover:bg-[#FAF7F0] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="text-[11px] font-['DM_Sans'] font-bold text-[#B89555] uppercase tracking-wider block mb-1">
                Student & Alumni Feedback
              </span>
              <h3 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-bold text-[#241A16]">
                Share Your Heritage Experience
              </h3>
              <p className="font-['DM_Sans'] text-xs text-[#6B4030] mt-1">
                Tell us about your learning journey with our temple sthapathis and traditional ateliers.
              </p>
            </div>

            {submitSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-['Cormorant_Garamond'] text-xl font-bold text-[#241A16]">
                  Feedback Submitted!
                </h4>
                <p className="text-xs font-['DM_Sans'] text-[#6B4030]">
                  Thank you! Your feedback has been received and forwarded to our faculty admissions guild for verification.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                {submitError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Senthil Kumar"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#6B4030]/20 bg-[#FAF7F0]/40 text-sm text-[#241A16] focus:border-[#B89555] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                      Profession / Role
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      placeholder="e.g. Ceramic Artist, Student"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#6B4030]/20 bg-[#FAF7F0]/40 text-xs text-[#241A16] focus:border-[#B89555] focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                      City / Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g. Madurai, Coimbatore"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#6B4030]/20 bg-[#FAF7F0]/40 text-xs text-[#241A16] focus:border-[#B89555] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Rating Stars Selector */}
                <div className="space-y-1">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Overall Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => handleRatingSelect(star)}
                        className="p-1 cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= formData.rating
                              ? 'fill-[#B89555] text-[#B89555]'
                              : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-['DM_Sans'] font-bold text-[#4A2C20] ml-2">
                      {formData.rating} / 5 Stars
                    </span>
                  </div>
                </div>

                {/* Review Text */}
                <div className="space-y-1">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Your Feedback / Review Message <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    name="review"
                    value={formData.review}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Share what you learned, how the master sthapathis guided you, and your experience with GNI..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#6B4030]/20 bg-[#FAF7F0]/40 text-sm text-[#241A16] resize-none focus:border-[#B89555] focus:outline-hidden"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-['DM_Sans'] font-semibold text-[#6B4030] hover:bg-[#FAF7F0] cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-[#4A2C20] hover:bg-[#603929] text-[#F7F2E8] text-xs font-['DM_Sans'] font-bold shadow-md cursor-pointer transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
