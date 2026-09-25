import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Mail,
  User,
  Phone,
  MapPin,
  Briefcase,
  Layers,
  HelpCircle,
} from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    profession: '',
    interestedSkill: '',
    experienceLevel: '',
    learningPurpose: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredData, setRegisteredData] = useState(null);

  const skillOptions = [
    'Painting',
    'Libi – Language & Epigraphy',
    'Sculpturing & Nagas Metal Art',
    'Heritage Applications',
    'All Four Pillars',
  ];

  const experienceOptions = ['Beginner', 'Intermediate', 'Advanced'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const validateForm = () => {
    for (const [key, value] of Object.entries(formData)) {
      if (!value || !value.trim()) {
        const fieldName = key.replace(/([A-Z])/g, ' $1').toLowerCase();
        setErrorMessage(`Please fill in your ${fieldName}.`);
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }

    const phoneRegex = /^[+]?[0-9\s\-()]{7,20}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      setErrorMessage('Please enter a valid phone number (at least 7 digits).');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed. Please try again.');
      }

      setRegisteredData(result.data);
      setIsSuccess(true);
    } catch (err) {
      setErrorMessage(err.message || 'Unable to connect to the registration server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F2E8] text-[#241A16] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-center">
      <div className="max-w-3xl mx-auto w-full relative z-10">
        {/* Top Navigation Back Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-['DM_Sans'] font-medium text-[#6B4030] hover:text-[#4A2C20] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Success Modal / State View */}
        {isSuccess ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#6B4030]/15 shadow-sm text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl font-bold text-[#241A16]">
                Registration Successful!
              </h2>
              <p className="font-['Cormorant_Garamond'] text-xl text-[#6B4030] font-semibold">
                Welcome to the Heritage Creator Journey.
              </p>
              <p className="font-['DM_Sans'] text-sm text-[#241A16]/80 max-w-md mx-auto pt-2">
                Your application has been recorded in the Global Nagas Institute repository. Our academic team
                will reach out to confirm your orientation and workshop schedule.
              </p>
            </div>

            {registeredData && (
              <div className="bg-[#F7F2E8] p-4 rounded-xl border border-[#6B4030]/15 text-xs font-['DM_Sans'] space-y-1.5 max-w-sm mx-auto text-left">
                <p>
                  <strong className="text-[#4A2C20]">Applicant:</strong> {registeredData.fullName}
                </p>
                <p>
                  <strong className="text-[#4A2C20]">Email:</strong> {registeredData.email}
                </p>
                <p>
                  <strong className="text-[#4A2C20]">Selected Skill:</strong> {registeredData.interestedSkill}
                </p>
                <p>
                  <strong className="text-[#4A2C20]">Level:</strong> {registeredData.experienceLevel}
                </p>
              </div>
            )}

            <div className="pt-4">
              <Link
                to="/"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-['DM_Sans'] text-xs font-semibold text-[#241A16] bg-[#B89555] hover:bg-[#c8a565] shadow-sm transition-all"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          /* Registration Form Container */
          <div className="bg-white rounded-3xl p-7 sm:p-10 md:p-12 border border-[#6B4030]/15 shadow-sm">
            {/* Header */}
            <div className="text-center space-y-3 mb-8">
              <div className="flex items-center justify-center gap-3 mb-2">
                <img
                  src="/artisan/logo.png"
                  alt="Global Nagas Institute logo"
                  className="h-12 w-auto object-contain"
                />
                <div className="text-left">
                  <span className="font-['Cormorant_Garamond'] text-2xl font-bold tracking-tight text-[#241A16] block">
                    Global Nagas Institute
                  </span>
                  <span className="font-['DM_Sans'] text-xs text-[#B89555] block">
                    Heritage Framework & Repository
                  </span>
                </div>
              </div>
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#4A2C20]/10 border border-[#6B4030]/20 text-[#6B4030] text-xs font-['DM_Sans'] font-medium">
                Cohort Enrollment
              </span>
              <h1 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight">
                Begin Your Heritage Journey
              </h1>
              <p className="font-['DM_Sans'] text-sm sm:text-base text-[#6B4030] font-normal max-w-xl mx-auto">
                Register your interest and become part of the heritage creator journey.
              </p>
            </div>

            {/* Error Notification Banner */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* 1. Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#6B4030] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Arun Kumar"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#6B4030]/20 bg-[#F7F2E8]/40 focus:bg-white focus:outline-hidden focus:border-[#B89555] text-sm text-[#241A16] transition-colors"
                    />
                  </div>
                </div>

                {/* 2. Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#6B4030] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. arun@example.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#6B4030]/20 bg-[#F7F2E8]/40 focus:bg-white focus:outline-hidden focus:border-[#B89555] text-sm text-[#241A16] transition-colors"
                    />
                  </div>
                </div>

                {/* 3. Phone Number */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#6B4030] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +91 98765 43210"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#6B4030]/20 bg-[#F7F2E8]/40 focus:bg-white focus:outline-hidden focus:border-[#B89555] text-sm text-[#241A16] transition-colors"
                    />
                  </div>
                </div>

                {/* 4. Location */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Location (City / State) *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#6B4030] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Madurai, Tamil Nadu"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#6B4030]/20 bg-[#F7F2E8]/40 focus:bg-white focus:outline-hidden focus:border-[#B89555] text-sm text-[#241A16] transition-colors"
                    />
                  </div>
                </div>

                {/* 5. Profession */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Profession / Background *
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-[#6B4030] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      name="profession"
                      value={formData.profession}
                      onChange={handleChange}
                      placeholder="e.g. Traditional artist, designer, architect, student"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#6B4030]/20 bg-[#F7F2E8]/40 focus:bg-white focus:outline-hidden focus:border-[#B89555] text-sm text-[#241A16] transition-colors"
                    />
                  </div>
                </div>

                {/* 6. Interested Heritage Skill Dropdown */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Interested Heritage Skill *
                  </label>
                  <div className="relative">
                    <Layers className="w-4 h-4 text-[#6B4030] absolute left-3.5 top-3.5 pointer-events-none" />
                    <select
                      name="interestedSkill"
                      value={formData.interestedSkill}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#6B4030]/20 bg-[#F7F2E8]/40 focus:bg-white focus:outline-hidden focus:border-[#B89555] text-sm text-[#241A16] transition-colors cursor-pointer"
                    >
                      <option value="">Select a Heritage Skill Pillar</option>
                      {skillOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 7. Experience Level Pills */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Experience Level *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {experienceOptions.map((lvl) => (
                      <label
                        key={lvl}
                        className={`flex items-center justify-center p-3 rounded-xl border text-xs font-['DM_Sans'] font-medium cursor-pointer transition-all ${
                          formData.experienceLevel === lvl
                            ? 'bg-[#4A2C20] text-[#F7F2E8] border-[#4A2C20]'
                            : 'bg-[#F7F2E8]/40 text-[#241A16] border-[#6B4030]/20 hover:border-[#B89555]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="experienceLevel"
                          value={lvl}
                          checked={formData.experienceLevel === lvl}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <span>{lvl}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 8. Why do you want to learn heritage skills? */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Why Do You Want to Learn Heritage Skills? *
                  </label>
                  <div className="relative">
                    <HelpCircle className="w-4 h-4 text-[#6B4030] absolute left-3.5 top-3.5 pointer-events-none" />
                    <textarea
                      name="learningPurpose"
                      value={formData.learningPurpose}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Share your goals (e.g. revive ancestral art, textile design, temple study, or building a creative livelihood)..."
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#6B4030]/20 bg-[#F7F2E8]/40 focus:bg-white focus:outline-hidden focus:border-[#B89555] text-sm text-[#241A16] transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-['DM_Sans'] text-xs font-semibold text-[#241A16] bg-[#B89555] hover:bg-[#c8a565] shadow-sm transition-all duration-200 disabled:opacity-50 cursor-pointer border border-[#B89555]"
                >
                  {loading ? 'Submitting Application...' : 'Register Now'}
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs font-['DM_Sans'] text-[#241A16]/60">
                  By registering, you agree to uphold sacred Tamil craftsmanship ethics and cultural heritage preservation.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
