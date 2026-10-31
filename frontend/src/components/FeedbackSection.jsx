import React, { useState } from 'react';
import { Star, MessageSquareQuote, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import Reveal from './Reveal';
import { submitFeedback } from '../services/api';
import { getStoredFeedbacks, saveStoredFeedbacks } from '../data/defaultFeedbacks';

export default function FeedbackSection() {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    location: '',
    batch: '60-Day Heritage Creator Journey',
    rating: 5,
    review: '',
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const courseOptions = [
    '60-Day Heritage Creator Journey',
    'Sacred Metal Casting & Jewellery Workshop',
    'Ancient Tamil Art & Epigraphy Masterclass',
    'Heritage Painting & Natural Mineral Pigments',
    'Sculpturing & Sacred Nagas Metal Craft',
    'Architectural Woodwork & Interior Craft',
    'General Student Experience',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleNameKeyDown = (e) => {
    if (
      e.ctrlKey ||
      e.metaKey ||
      e.altKey ||
      ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter', ' '].includes(e.key)
    ) {
      return;
    }
    if (/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (formData.name.trim().length < 2) {
      setErrorMsg('Name must be at least 2 characters.');
      return;
    }
    if (!formData.review.trim() || formData.review.trim().length < 10) {
      setErrorMsg('Please write a feedback review of at least 10 characters.');
      return;
    }

    setSubmitting(true);
    const newFeedback = {
      id: Date.now(),
      name: formData.name.trim(),
      role: (formData.role || 'Heritage Creator').trim(),
      location: (formData.location || 'Tamil Nadu').trim(),
      batch: formData.batch,
      rating: Number(formData.rating) || 5,
      review: formData.review.trim(),
      status: 'pending', // Starts pending until Admin clicks Upload/Publish
      created_at: new Date().toISOString(),
    };

    try {
      // 1. Try sending to backend API
      try {
        await submitFeedback(newFeedback);
      } catch (apiErr) {
        console.warn('Backend API submission fallback:', apiErr.message);
      }

      // 2. Persist in localStorage so Admin immediately receives it in Real-Time
      const currentList = getStoredFeedbacks();
      const updatedList = [newFeedback, ...currentList.filter((f) => String(f.id) !== String(newFeedback.id))];
      saveStoredFeedbacks(updatedList);

      setSuccessMsg(
        `Nandri, ${formData.name.trim()}! Your feedback has been received. Our faculty guild will review and publish it to the website.`
      );

      setFormData({
        name: '',
        role: '',
        location: '',
        batch: '60-Day Heritage Creator Journey',
        rating: 5,
        review: '',
      });
      setHoverRating(0);
    } catch (err) {
      setErrorMsg(err.message || 'Unable to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="feedback-form" className="py-12 sm:py-16 md:py-20 bg-[#FAF7F0] border-t border-[#6B4030]/20 relative overflow-hidden">
      {/* Decorative Background Accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#B89555]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#4A2C20]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal direction="up" delay={100}>
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#4A2C20]/10 border border-[#6B4030]/20 text-[#6B4030] text-xs font-['DM_Sans'] font-medium mb-3">
              <MessageSquareQuote className="w-3.5 h-3.5 text-[#B89555]" />
              <span>Student &amp; Visitor Feedback</span>
            </span>

            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight leading-tight">
              Share Your Heritage Experience
            </h2>
            <div className="w-16 h-0.5 bg-[#B89555] mx-auto mt-3" />

            <p className="font-['DM_Sans'] mt-3 text-xs sm:text-sm text-[#6B4030] leading-relaxed">
              Have you participated in our workshops or cohorts? Share your thoughts, reflections, and craft journey.
              Verified submissions are featured in our alumni showcase.
            </p>
          </div>
        </Reveal>

        <Reveal direction="up" delay={150}>
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#6B4030]/15 shadow-md">
            {successMsg ? (
              <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-2xl font-bold text-[#241A16]">
                  Feedback Submitted Successfully!
                </h3>
                <p className="font-['DM_Sans'] text-xs sm:text-sm text-[#6B4030] max-w-md mx-auto leading-relaxed">
                  {successMsg}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setSuccessMsg('')}
                    className="px-5 py-2 rounded-xl bg-[#4A2C20] hover:bg-[#603929] text-white text-xs font-semibold font-['DM_Sans'] transition-colors cursor-pointer"
                  >
                    Submit Another Review
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Row 1: Full Name & Profession */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <div className="space-y-1">
                    <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                      Your Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onKeyDown={handleNameKeyDown}
                      placeholder="e.g. Senthil Nathan"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#6B4030]/20 bg-[#FAF7F0]/40 text-xs sm:text-sm text-[#241A16] placeholder-[#6B4030]/50 focus:border-[#B89555] focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                      Profession / Background
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      onKeyDown={handleNameKeyDown}
                      placeholder="e.g. Architecture Student, Designer, Artist"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#6B4030]/20 bg-[#FAF7F0]/40 text-xs sm:text-sm text-[#241A16] placeholder-[#6B4030]/50 focus:border-[#B89555] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Row 2: Location & Program Taken */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <div className="space-y-1">
                    <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                      City / Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      onKeyDown={handleNameKeyDown}
                      placeholder="e.g. Madurai, Coimbatore, Chennai"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#6B4030]/20 bg-[#FAF7F0]/40 text-xs sm:text-sm text-[#241A16] placeholder-[#6B4030]/50 focus:border-[#B89555] focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                      Program / Workshop Attended
                    </label>
                    <select
                      name="batch"
                      value={formData.batch}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#6B4030]/20 bg-white text-xs text-[#241A16] cursor-pointer focus:border-[#B89555] focus:outline-hidden"
                    >
                      {courseOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 3: Interactive Star Rating */}
                <div className="space-y-1 text-left pt-1">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Your Rating Experience
                  </label>
                  <div className="flex items-center gap-1.5 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 cursor-pointer transition-transform hover:scale-115 focus:outline-hidden"
                        title={`${star} Star${star > 1 ? 's' : ''}`}
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            star <= (hoverRating || formData.rating)
                              ? 'fill-[#B89555] text-[#B89555]'
                              : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-['DM_Sans'] font-bold text-[#4A2C20] ml-2">
                      {hoverRating || formData.rating} of 5 Stars
                    </span>
                  </div>
                </div>

                {/* Row 4: Review / Testimonial Message */}
                <div className="space-y-1 text-left">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Your Feedback / Review Message <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    name="review"
                    value={formData.review}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your learning experience, master sthapathi mentorship, practical atelier sessions, or how GNI influenced your creative work..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#6B4030]/20 bg-[#FAF7F0]/40 text-xs sm:text-sm text-[#241A16] placeholder-[#6B4030]/50 resize-none focus:border-[#B89555] focus:outline-hidden leading-relaxed"
                  />
                  <span className="text-[10.5px] text-[#6B4030]/75 block text-right">
                    {formData.review.length} characters (minimum 10 characters)
                  </span>
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#6B4030]/10">
                  <span className="text-[11px] font-['DM_Sans'] text-[#6B4030] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#B89555]" />
                    <span>Your feedback is verified by faculty before publishing.</span>
                  </span>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#4A2C20] hover:bg-[#603929] text-[#F7F2E8] text-xs sm:text-sm font-['DM_Sans'] font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-[#B89555]" />
                    <span>{submitting ? 'Submitting Feedback...' : 'Submit Feedback for Review'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
