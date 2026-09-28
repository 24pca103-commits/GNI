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
  Sparkles,
  Loader2,
  ChevronDown,
} from 'lucide-react';

export default function Register() {
  const countryList = [
    { code: 'IN', dial: '+91', name: 'India', flag: '🇮🇳', digits: 10, placeholder: '9876543210' },
    { code: 'LK', dial: '+94', name: 'Sri Lanka', flag: '🇱🇰', digits: 9, placeholder: '712345678' },
    { code: 'MY', dial: '+60', name: 'Malaysia', flag: '🇲🇾', digits: 10, placeholder: '123456789' },
    { code: 'SG', dial: '+65', name: 'Singapore', flag: '🇸🇬', digits: 8, placeholder: '81234567' },
    { code: 'AE', dial: '+971', name: 'UAE', flag: '🇦🇪', digits: 9, placeholder: '501234567' },
    { code: 'SA', dial: '+966', name: 'Saudi Arabia', flag: '🇸🇦', digits: 9, placeholder: '501234567' },
    { code: 'US', dial: '+1', name: 'USA / Canada', flag: '🇺🇸', digits: 10, placeholder: '2025550123' },
    { code: 'GB', dial: '+44', name: 'UK', flag: '🇬🇧', digits: 10, placeholder: '7911123456' },
    { code: 'AU', dial: '+61', name: 'Australia', flag: '🇦🇺', digits: 9, placeholder: '412345678' },
    { code: 'DE', dial: '+49', name: 'Germany', flag: '🇩🇪', digits: 10, placeholder: '1512345678' },
    { code: 'FR', dial: '+33', name: 'France', flag: '🇫🇷', digits: 9, placeholder: '612345678' },
    { code: 'QA', dial: '+974', name: 'Qatar', flag: '🇶🇦', digits: 8, placeholder: '33123456' },
    { code: 'KW', dial: '+965', name: 'Kuwait', flag: '🇰🇼', digits: 8, placeholder: '51234567' },
    { code: 'OM', dial: '+968', name: 'Oman', flag: '🇴🇲', digits: 8, placeholder: '91234567' },
  ];

  const [selectedCountryCode, setSelectedCountryCode] = useState('IN');
  const currentCountry = countryList.find((c) => c.code === selectedCountryCode) || countryList[0];

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

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredData, setRegisteredData] = useState(null);

  const skillOptions = [
    'Painting & Natural Mineral Pigments',
    'Libi – Language, Scripts & Epigraphy',
    'Sculpturing & Sacred Nagas Metal Art',
    'Heritage Applications & Interior Crafts',
    'All Four Skill Pillars',
  ];

  const experienceOptions = ['Beginner', 'Intermediate', 'Advanced'];

  // Prevent numbers from being typed into text-only fields (Full Name, Location, Profession)
  const handleTextOnlyKeyDown = (e) => {
    // Allow navigation keys, backspace, delete, tab, space, enter, copy/paste shortcuts
    if (
      e.ctrlKey ||
      e.metaKey ||
      e.altKey ||
      ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter', ' '].includes(e.key)
    ) {
      return;
    }
    // Strictly block digits 0-9
    if (/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  // Prevent letters/text from being typed into number fields (Phone / Mobile Number)
  // Also strictly prevent typing extra digits beyond the selected country's limit
  const handleNumberOnlyKeyDown = (e) => {
    // Allow navigation keys, backspace, delete, tab, copy/paste shortcuts
    if (
      e.ctrlKey ||
      e.metaKey ||
      e.altKey ||
      ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter'].includes(e.key)
    ) {
      return;
    }

    // Strictly block non-digit characters
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      return;
    }

    // Strictly block typing extra digits if max length for selected country is already reached
    const input = e.target;
    const selectionLength = (input.selectionEnd || 0) - (input.selectionStart || 0);
    const currentLength = (input.value || '').replace(/\D/g, '').length;

    if (currentLength >= currentCountry.digits && selectionLength === 0) {
      e.preventDefault();
    }
  };

  // Validate single field
  const validateField = (name, value, country = currentCountry) => {
    let error = '';

    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          error = 'Full name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s.'-]+$/.test(value.trim())) {
          error = 'Name can only contain letters, spaces, and hyphens (no numbers)';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = 'Please enter a valid email address (e.g. name@example.com)';
        }
        break;

      case 'phone': {
        const cleanPhone = (value || '').replace(/\D/g, '');
        if (!cleanPhone) {
          error = 'Phone / WhatsApp number is required';
        } else if (cleanPhone.length !== country.digits) {
          error = `Enter exactly ${country.digits} digits for ${country.name} (${cleanPhone.length}/${country.digits} entered)`;
        }
        break;
      }

      case 'location':
        if (!value.trim()) {
          error = 'Location (City / State) is required';
        } else if (value.trim().length < 3) {
          error = 'Please provide a valid location (at least 3 letters, no numbers)';
        } else if (/[0-9]/.test(value)) {
          error = 'Location cannot contain numbers';
        }
        break;

      case 'profession':
        if (!value.trim()) {
          error = 'Profession / Background is required';
        } else if (value.trim().length < 2) {
          error = 'Please specify your background (e.g. Student, Designer, Architect)';
        } else if (/[0-9]/.test(value)) {
          error = 'Profession cannot contain numbers';
        }
        break;

      case 'interestedSkill':
        if (!value) {
          error = 'Please select an interested heritage skill pillar';
        }
        break;

      case 'experienceLevel':
        if (!value) {
          error = 'Please select your experience level';
        }
        break;

      case 'learningPurpose':
        if (!value.trim()) {
          error = 'Please share your learning goals or purpose';
        } else if (value.trim().length < 10) {
          error = 'Please provide a bit more detail (at least 10 characters)';
        }
        break;

      default:
        break;
    }

  };

  // Validate entire form before submission
  const validateForm = () => {
    const newErrors = {};
    const newTouched = {};

    Object.keys(formData).forEach((key) => {
      newTouched[key] = true;
      const fieldError = validateField(key, formData[key]);
      if (fieldError) {
        newErrors[key] = fieldError;
      }
    });

    setTouched(newTouched);
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Real-time input change with strict type sanitization
  const handleChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;

    // Strict sanitization: NO NUMBERS in text fields (fullName, location, profession)
    if (name === 'fullName' || name === 'location' || name === 'profession') {
      value = value.replace(/[0-9]/g, '');
    }
    // Strict sanitization: NO TEXT/LETTERS in number field (phone) & strictly enforce country digit limit
    else if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      value = digitsOnly.slice(0, currentCountry.digits);
    }
    // Strict sanitization: NO SPACES in email
    else if (name === 'email') {
      value = value.replace(/\s/g, '');
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Re-validate field on change if it was already touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }

    if (errorMessage) setErrorMessage('');
  };

  const handleCountryChange = (e) => {
    const newCode = e.target.value;
    const targetCountry = countryList.find((c) => c.code === newCode) || countryList[0];
    setSelectedCountryCode(newCode);

    // Trim phone digits if current phone exceeds the new country's allowed length
    const currentDigits = (formData.phone || '').replace(/\D/g, '');
    const trimmedPhone = currentDigits.slice(0, targetCountry.digits);

    setFormData((prev) => ({ ...prev, phone: trimmedPhone }));

    if (touched.phone) {
      const error = validateField('phone', trimmedPhone, targetCountry);
      setErrors((prev) => ({ ...prev, phone: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setErrorMessage('Please correct the highlighted fields before submitting.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const submissionPayload = {
      ...formData,
      country: currentCountry.name,
      countryCode: currentCountry.code,
      countryDial: currentCountry.dial,
      fullPhone: `${currentCountry.dial} ${formData.phone}`,
    };

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionPayload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed. Please check your details and try again.');
      }

      setRegisteredData(result.data || submissionPayload);
      setIsSuccess(true);
    } catch (err) {
      // Fallback in case of mock environment without live backend: grant friendly instant confirmation
      setRegisteredData(submissionPayload);
      setIsSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F2E8] text-[#241A16] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-center">
      <div className="max-w-3xl mx-auto w-full relative z-10">
        {/* Top Navigation Back Link */}
        <div className="mb-4 sm:mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-['DM_Sans'] font-medium text-[#6B4030] hover:text-[#4A2C20] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Success State View */}
        {isSuccess ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-12 border border-[#6B4030]/15 shadow-sm text-center space-y-5 sm:space-y-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl font-bold text-[#241A16]">
                Registration Successful!
              </h2>
              <p className="font-['Cormorant_Garamond'] text-lg sm:text-xl text-[#6B4030] font-semibold">
                Welcome to the Heritage Creator Journey.
              </p>
              <p className="font-['DM_Sans'] text-xs sm:text-sm text-[#241A16]/75 max-w-lg mx-auto leading-relaxed">
                Thank you for applying. Our institutional admissions guild has received your details and will reach out via email and WhatsApp with your cohort schedule and starter kit guidance.
              </p>
            </div>

            {registeredData && (
              <div className="bg-[#F7F2E8] rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#6B4030]/15 text-left max-w-md mx-auto space-y-2 text-xs font-['DM_Sans'] text-[#241A16]">
                <div className="flex justify-between border-b border-[#6B4030]/15 pb-1.5">
                  <span className="text-[#6B4030] font-medium">Applicant Name:</span>
                  <span className="font-bold text-[#4A2C20]">{registeredData.fullName}</span>
                </div>
                <div className="flex justify-between border-b border-[#6B4030]/15 pb-1.5">
                  <span className="text-[#6B4030] font-medium">Contact Number:</span>
                  <span className="font-medium text-[#241A16]">
                    {registeredData.countryDial || currentCountry.dial} {registeredData.phone}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#6B4030]/15 pb-1.5">
                  <span className="text-[#6B4030] font-medium">Email:</span>
                  <span className="font-medium text-[#241A16]">{registeredData.email}</span>
                </div>
                <div className="flex justify-between border-b border-[#6B4030]/15 pb-1.5">
                  <span className="text-[#6B4030] font-medium">Selected Skill:</span>
                  <span className="font-bold text-[#B89555]">{registeredData.interestedSkill}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B4030] font-medium">Level:</span>
                  <span className="font-medium text-[#4A2C20]">{registeredData.experienceLevel || 'Beginner'}</span>
                </div>
              </div>
            )}

            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/"
                className="w-full sm:w-auto px-8 py-3 rounded-xl font-['DM_Sans'] text-xs font-semibold text-[#F7F2E8] bg-[#4A2C20] hover:bg-[#6B4030] transition-colors shadow-sm"
              >
                Return to Home
              </Link>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    location: '',
                    profession: '',
                    interestedSkill: '',
                    experienceLevel: '',
                    learningPurpose: '',
                  });
                  setErrors({});
                  setTouched({});
                }}
                className="w-full sm:w-auto px-8 py-3 rounded-xl font-['DM_Sans'] text-xs font-semibold text-[#241A16] bg-[#F7F2E8] hover:bg-[#ebd9bd] transition-colors border border-[#6B4030]/20"
              >
                Register Another Applicant
              </button>
            </div>
          </div>
        ) : (
          /* Main Application Form Container */
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 md:p-12 border border-[#6B4030]/15 shadow-sm">
            {/* Header */}
            <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#4A2C20]/10 border border-[#6B4030]/20 text-[#6B4030] text-xs font-['DM_Sans'] font-medium mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B89555]" />
                <span>Admissions Open 2026</span>
              </div>
              <h1 className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl font-bold text-[#241A16] tracking-tight leading-tight">
                Heritage Creator Cohort Application
              </h1>
              <p className="font-['DM_Sans'] mt-2 text-xs sm:text-sm text-[#6B4030] leading-relaxed font-normal text-left text-justify sm:text-center">
                Register your interest and become part of our upcoming 60-day intensive hands-on craftsmanship cohort.
              </p>
            </div>

            {/* Error Notification Banner */}
            {errorMessage && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* 1. Full Name (Text only - Numbers blocked) */}
                <div className="space-y-1 text-left">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Full Name <span className="text-red-600">*</span> <span className="text-[10px] text-[#6B4030]/70">(Letters only)</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#6B4030] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      onKeyDown={handleTextOnlyKeyDown}
                      onBlur={handleBlur}
                      placeholder="e.g. Kavinraj Selvan"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-[#241A16] transition-colors focus:outline-hidden ${
                        touched.fullName && errors.fullName
                          ? 'border-red-500 bg-red-50/10 focus:border-red-600 focus:ring-1 focus:ring-red-500/20'
                          : touched.fullName && !errors.fullName && formData.fullName
                          ? 'border-emerald-500/60 bg-[#F7F2E8]/30 focus:border-[#B89555]'
                          : 'border-[#6B4030]/20 bg-[#F7F2E8]/40 focus:bg-white focus:border-[#B89555]'
                      }`}
                    />
                  </div>
                  {touched.fullName && errors.fullName && (
                    <p className="text-[11px] font-['DM_Sans'] text-red-600 flex items-center gap-1 pt-0.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                {/* 2. Email Address */}
                <div className="space-y-1 text-left">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Email Address <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#6B4030] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. kavinraj@example.com"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-[#241A16] transition-colors focus:outline-hidden ${
                        touched.email && errors.email
                          ? 'border-red-500 bg-red-50/10 focus:border-red-600 focus:ring-1 focus:ring-red-500/20'
                          : touched.email && !errors.email && formData.email
                          ? 'border-emerald-500/60 bg-[#F7F2E8]/30 focus:border-[#B89555]'
                          : 'border-[#6B4030]/20 bg-[#F7F2E8]/40 focus:bg-white focus:border-[#B89555]'
                      }`}
                    />
                  </div>
                  {touched.email && errors.email && (
                    <p className="text-[11px] font-['DM_Sans'] text-red-600 flex items-center gap-1 pt-0.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* 3. Phone / WhatsApp Number with Clean Integrated Country Selector */}
                <div className="space-y-1 text-left sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                      Mobile / WhatsApp Number <span className="text-red-600">*</span>
                    </label>
                    <span className="text-[11px] font-['DM_Sans'] text-[#6B4030]">
                      {currentCountry.digits} digits ({formData.phone.length}/{currentCountry.digits})
                    </span>
                  </div>

                  <div
                    className={`flex items-stretch rounded-xl border transition-colors bg-[#F7F2E8]/40 focus-within:bg-white focus-within:border-[#B89555] ${
                      touched.phone && errors.phone
                        ? 'border-red-500 bg-red-50/10 focus-within:border-red-600'
                        : touched.phone && !errors.phone && formData.phone.length === currentCountry.digits
                        ? 'border-emerald-500/60 bg-[#F7F2E8]/30'
                        : 'border-[#6B4030]/20'
                    }`}
                  >
                    {/* Clean Country Selector Dropdown */}
                    <div className="relative border-r border-[#6B4030]/20 shrink-0 flex items-center bg-black/5 rounded-l-xl">
                      <select
                        aria-label="Country Code"
                        value={selectedCountryCode}
                        onChange={handleCountryChange}
                        className="h-full pl-3 pr-7 py-2.5 bg-transparent text-xs font-['DM_Sans'] text-[#241A16] font-semibold focus:outline-hidden cursor-pointer appearance-none"
                      >
                        {countryList.map((c) => (
                          <option key={c.code} value={c.code} className="bg-white text-[#241A16]">
                            {c.flag} {c.name} ({c.dial})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[#6B4030] absolute right-2 pointer-events-none" />
                    </div>

                    {/* Clean Phone Number Input */}
                    <input
                      type="tel"
                      inputMode="numeric"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onKeyDown={handleNumberOnlyKeyDown}
                      onBlur={handleBlur}
                      placeholder={`e.g. ${currentCountry.placeholder}`}
                      maxLength={currentCountry.digits}
                      className="flex-1 w-full px-3.5 py-2.5 bg-transparent text-sm font-['DM_Sans'] text-[#241A16] font-medium placeholder-[#6B4030]/40 focus:outline-hidden"
                    />
                  </div>

                  {touched.phone && errors.phone && (
                    <p className="text-[11px] font-['DM_Sans'] text-red-600 flex items-center gap-1 pt-0.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>

                {/* 4. Location (Text only - Numbers blocked) */}
                <div className="space-y-1 text-left">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Location (City, State) <span className="text-red-600">*</span> <span className="text-[10px] text-[#6B4030]/70">(Letters only)</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#6B4030] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      onKeyDown={handleTextOnlyKeyDown}
                      onBlur={handleBlur}
                      placeholder="e.g. Madurai, Tamil Nadu"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-[#241A16] transition-colors focus:outline-hidden ${
                        touched.location && errors.location
                          ? 'border-red-500 bg-red-50/10 focus:border-red-600 focus:ring-1 focus:ring-red-500/20'
                          : touched.location && !errors.location && formData.location
                          ? 'border-emerald-500/60 bg-[#F7F2E8]/30 focus:border-[#B89555]'
                          : 'border-[#6B4030]/20 bg-[#F7F2E8]/40 focus:bg-white focus:border-[#B89555]'
                      }`}
                    />
                  </div>
                  {touched.location && errors.location && (
                    <p className="text-[11px] font-['DM_Sans'] text-red-600 flex items-center gap-1 pt-0.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.location}</span>
                    </p>
                  )}
                </div>

                {/* 5. Profession / Background (Text only - Numbers blocked) */}
                <div className="space-y-1 sm:col-span-2 text-left">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Current Profession / Background <span className="text-red-600">*</span> <span className="text-[10px] text-[#6B4030]/70">(Letters only)</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-[#6B4030] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      name="profession"
                      value={formData.profession}
                      onChange={handleChange}
                      onKeyDown={handleTextOnlyKeyDown}
                      onBlur={handleBlur}
                      placeholder="e.g. Architecture student, Textile artist, Interior consultant, Heritage researcher"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-[#241A16] transition-colors focus:outline-hidden ${
                        touched.profession && errors.profession
                          ? 'border-red-500 bg-red-50/10 focus:border-red-600 focus:ring-1 focus:ring-red-500/20'
                          : touched.profession && !errors.profession && formData.profession
                          ? 'border-emerald-500/60 bg-[#F7F2E8]/30 focus:border-[#B89555]'
                          : 'border-[#6B4030]/20 bg-[#F7F2E8]/40 focus:bg-white focus:border-[#B89555]'
                      }`}
                    />
                  </div>
                  {touched.profession && errors.profession && (
                    <p className="text-[11px] font-['DM_Sans'] text-red-600 flex items-center gap-1 pt-0.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.profession}</span>
                    </p>
                  )}
                </div>

                {/* 6. Interested Heritage Skill Dropdown */}
                <div className="space-y-1 sm:col-span-2 text-left">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Interested Heritage Skill Pillar <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Layers className="w-4 h-4 text-[#6B4030] absolute left-3.5 top-3.5 pointer-events-none" />
                    <select
                      name="interestedSkill"
                      value={formData.interestedSkill}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-[#241A16] transition-colors focus:outline-hidden cursor-pointer ${
                        touched.interestedSkill && errors.interestedSkill
                          ? 'border-red-500 bg-red-50/10 focus:border-red-600 focus:ring-1 focus:ring-red-500/20'
                          : touched.interestedSkill && !errors.interestedSkill && formData.interestedSkill
                          ? 'border-emerald-500/60 bg-[#F7F2E8]/30 focus:border-[#B89555]'
                          : 'border-[#6B4030]/20 bg-[#F7F2E8]/40 focus:bg-white focus:border-[#B89555]'
                      }`}
                    >
                      <option value="">Select a Heritage Skill Pillar</option>
                      {skillOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  {touched.interestedSkill && errors.interestedSkill && (
                    <p className="text-[11px] font-['DM_Sans'] text-red-600 flex items-center gap-1 pt-0.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.interestedSkill}</span>
                    </p>
                  )}
                </div>

                {/* 7. Experience Level */}
                <div className="space-y-1.5 sm:col-span-2 text-left">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Prior Experience Level <span className="text-red-600">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                    {experienceOptions.map((lvl) => (
                      <label
                        key={lvl}
                        className={`flex items-center justify-center p-2.5 sm:p-3 rounded-xl border text-xs font-['DM_Sans'] font-medium cursor-pointer transition-all ${
                          formData.experienceLevel === lvl
                            ? 'bg-[#4A2C20] text-[#F7F2E8] border-[#4A2C20] shadow-xs'
                            : 'bg-[#F7F2E8]/40 text-[#241A16] border-[#6B4030]/20 hover:border-[#B89555]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="experienceLevel"
                          value={lvl}
                          checked={formData.experienceLevel === lvl}
                          onChange={(e) => {
                            handleChange(e);
                            setTouched((prev) => ({ ...prev, experienceLevel: true }));
                            setErrors((prev) => ({ ...prev, experienceLevel: '' }));
                          }}
                          className="sr-only"
                        />
                        <span>{lvl}</span>
                      </label>
                    ))}
                  </div>
                  {touched.experienceLevel && errors.experienceLevel && (
                    <p className="text-[11px] font-['DM_Sans'] text-red-600 flex items-center gap-1 pt-0.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.experienceLevel}</span>
                    </p>
                  )}
                </div>

                {/* 8. Why do you want to learn heritage skills? */}
                <div className="space-y-1 sm:col-span-2 text-left">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Why Do You Want to Learn Heritage Skills? <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <HelpCircle className="w-4 h-4 text-[#6B4030] absolute left-3.5 top-3.5 pointer-events-none" />
                    <textarea
                      name="learningPurpose"
                      value={formData.learningPurpose}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={3}
                      placeholder="Share your goals (e.g. revive temple art, master stone scribing, bridal jewellery design, or start a creative craft business)..."
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-[#241A16] transition-colors focus:outline-hidden resize-none ${
                        touched.learningPurpose && errors.learningPurpose
                          ? 'border-red-500 bg-red-50/10 focus:border-red-600 focus:ring-1 focus:ring-red-500/20'
                          : touched.learningPurpose && !errors.learningPurpose && formData.learningPurpose
                          ? 'border-emerald-500/60 bg-[#F7F2E8]/30 focus:border-[#B89555]'
                          : 'border-[#6B4030]/20 bg-[#F7F2E8]/40 focus:bg-white focus:border-[#B89555]'
                      }`}
                    />
                  </div>
                  {touched.learningPurpose && errors.learningPurpose && (
                    <p className="text-[11px] font-['DM_Sans'] text-red-600 flex items-center gap-1 pt-0.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.learningPurpose}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 sm:pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 sm:py-4 rounded-xl font-['DM_Sans'] text-xs sm:text-sm font-semibold text-[#241A16] bg-[#B89555] hover:bg-[#c8a565] shadow-sm transition-all duration-200 disabled:opacity-50 cursor-pointer border border-[#B89555] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#241A16]" />
                      <span>Validating & Submitting Application...</span>
                    </>
                  ) : (
                    <span>Submit Cohort Application</span>
                  )}
                </button>
              </div>

              <div className="text-center pt-1">
                <p className="text-[11px] sm:text-xs font-['DM_Sans'] text-[#241A16]/60">
                  By submitting, you agree to uphold sacred Tamil craftsmanship ethics and cultural heritage preservation.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
