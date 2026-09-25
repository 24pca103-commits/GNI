import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Send,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { registerUser } from '../services/api';
import Reveal from './Reveal';

export default function Register({ onRegistrationSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [registeredUser, setRegisteredUser] = useState(null);

  // Validate form fields client-side
  const validateForm = () => {
    const errs = {};
    const nameRegex = /^[a-zA-Z\s.'-]+$/;
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const phoneRegex = /^\+?[0-9]{7,15}$/;

    if (!formData.fullName.trim()) {
      errs.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = 'Full name must be at least 2 characters';
    } else if (!nameRegex.test(formData.fullName.trim())) {
      errs.fullName = 'Name can only contain letters, spaces, and hyphens';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address';
    }

    const cleanPhone = formData.mobileNumber.replace(/[\s-]/g, '');
    if (!formData.mobileNumber.trim()) {
      errs.mobileNumber = 'Mobile number is required';
    } else if (!phoneRegex.test(cleanPhone)) {
      errs.mobileNumber = 'Enter a valid phone number (7-15 digits, e.g. +91 9876543210)';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errs.password = 'Password must be at least 8 characters long';
    } else {
      const hasUpper = /[A-Z]/.test(formData.password);
      const hasLower = /[a-z]/.test(formData.password);
      const hasNum = /[0-9]/.test(formData.password);
      const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password);
      if (!hasUpper || !hasLower || !hasNum || !hasSpecial) {
        errs.password = 'Include uppercase, lowercase, number, and a special character';
      }
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for edited field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await registerUser(formData);
      if (response.success) {
        setRegisteredUser(response.user);
        setFormData({
          fullName: '',
          email: '',
          mobileNumber: '',
          password: '',
          confirmPassword: '',
        });
        if (onRegistrationSuccess) {
          onRegistrationSuccess();
        }
      }
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors);
      }
      setServerError(err.message || 'An error occurred during registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password strength calculator
  const calculatePasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pass)) score += 1;
    return score;
  };

  const passScore = calculatePasswordStrength(formData.password);

  return (
    <section id="register" className="py-8 md:py-12 bg-[#EAF3FF] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Reveal direction="up" delay={100}>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#0B3A78]/15 text-[#0B3A78] text-xs font-['Poppins'] font-semibold mb-2.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#F4B400]" />
              <span>Admissions Portal</span>
            </div>
            <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-[#0B3A78] tracking-tight">
              Register with Global Nagas Institute
            </h2>
            <div className="w-12 h-1 bg-[#F4B400] mx-auto mt-3 rounded-full" />
            <p className="font-['Poppins'] mt-3 text-xs sm:text-sm text-[#1F2937]/80 leading-relaxed font-normal">
              Begin your transformation today. Fill in the official admission details below to create your
              student account and access the GNI academic portal.
            </p>
          </div>
        </Reveal>

        <div className="max-w-lg mx-auto">
          {/* Success State View: White Card with Light Shadow */}
          {registeredUser ? (
            <Reveal direction="zoom" delay={100}>
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-100 text-center animate-in zoom-in-95 duration-300">
                <img
                  src="/logo.png"
                  alt="Global Nagas Institute"
                  className="h-14 w-auto mx-auto object-contain mb-3"
                />
                <div className="w-12 h-12 rounded-xl bg-[#EAF3FF] text-[#F4B400] flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <CheckCircle className="w-7 h-7 text-[#0B3A78]" />
                </div>

                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-['Poppins'] font-semibold bg-[#EAF3FF] text-[#0B3A78] mb-2">
                  Registration Confirmed
                </span>

                <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#0B3A78] mb-1.5">
                  Welcome to GNI, {registeredUser.fullName}!
                </h3>

                <p className="font-['Poppins'] text-[#1F2937] text-xs leading-relaxed mb-5 font-normal">
                  Your admission application has been registered and safely stored in the Global Nagas
                  Institute academic database. A confirmation email and orientation kit have been queued
                  for delivery.
                </p>

                <div className="bg-[#EAF3FF]/50 rounded-xl p-4 border border-[#0B3A78]/10 text-left space-y-1.5 mb-6 text-xs font-['Poppins']">
                  <div className="flex justify-between py-1 border-b border-[#0B3A78]/10">
                    <span className="text-[#1F2937]/60">Student Name:</span>
                    <span className="font-bold text-[#0B3A78]">{registeredUser.fullName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#0B3A78]/10">
                    <span className="text-[#1F2937]/60">Registered Email:</span>
                    <span className="font-semibold text-[#0B3A78]">{registeredUser.email}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#0B3A78]/10">
                    <span className="text-[#1F2937]/60">Mobile Contact:</span>
                    <span className="font-medium text-[#1F2937]">{registeredUser.mobileNumber}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#1F2937]/60">Security:</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-[#0B3A78]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#F4B400]" /> Password Encrypted (bcrypt)
                    </span>
                  </div>
                </div>

                {/* Button: Gold #F4B400 with Dark Blue #0B3A78 text */}
                <button
                  onClick={() => setRegisteredUser(null)}
                  className="w-full py-3 px-5 rounded-lg font-['Poppins'] font-semibold text-xs uppercase tracking-wide text-[#0B3A78] bg-[#F4B400] hover:bg-[#e0a300] shadow-md transition-all"
                >
                  Register Another Student
                </button>
              </div>
            </Reveal>
          ) : (
            /* Registration Form: White with Light Shadow */
            <Reveal direction="up" delay={200}>
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-100 relative">
                {/* Form Official Logo Header */}
                <div className="text-center mb-5 pb-3 border-b border-slate-100">
                  <img
                    src="/logo.png"
                    alt="Global Nagas Institute"
                    className="h-12 sm:h-14 w-auto mx-auto object-contain mb-1.5"
                  />
                  <h3 className="font-['Playfair_Display'] text-base sm:text-lg font-bold text-[#0B3A78]">Student Admissions & Enrollment</h3>
                  <p className="font-['Poppins'] text-xs text-[#1F2937]/60 font-normal">Official Registration Form</p>
                </div>

                {/* Form Security Trust Notice: Light Blue #EAF3FF */}
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#EAF3FF] border border-[#0B3A78]/10 text-[11.5px] font-['Poppins'] font-medium text-[#0B3A78] mb-5">
                  <ShieldCheck className="w-4 h-4 text-[#F4B400] shrink-0" />
                  <span>Your information is protected by 256-bit SSL and secure bcrypt hashing.</span>
                </div>

                {/* Server Error Alert */}
                {serverError && (
                  <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2.5 text-xs font-['Poppins']">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                    <div className="flex-1">
                      <p className="font-semibold">Registration Issue</p>
                      <p className="text-[11px] text-rose-600 mt-0.5">{serverError}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] font-['Poppins'] font-semibold uppercase tracking-wider text-[#1F2937] mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Sentila Jamir"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-lg text-xs sm:text-sm font-['Poppins'] border bg-slate-50/40 focus:bg-white text-[#1F2937] placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.fullName
                            ? 'border-rose-300 focus:ring-rose-200'
                            : 'border-slate-200 focus:border-[#0B3A78] focus:ring-[#EAF3FF]'
                        }`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="mt-1 text-[11px] font-['Poppins'] text-rose-600 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-[11px] font-['Poppins'] font-semibold uppercase tracking-wider text-[#1F2937] mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. sentila@example.com"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-lg text-xs sm:text-sm font-['Poppins'] border bg-slate-50/40 focus:bg-white text-[#1F2937] placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.email
                            ? 'border-rose-300 focus:ring-rose-200'
                            : 'border-slate-200 focus:border-[#0B3A78] focus:ring-[#EAF3FF]'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-[11px] font-['Poppins'] text-rose-600 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-[11px] font-['Poppins'] font-semibold uppercase tracking-wider text-[#1F2937] mb-1">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        placeholder="e.g. +91 9876543210"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-lg text-xs sm:text-sm font-['Poppins'] border bg-slate-50/40 focus:bg-white text-[#1F2937] placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.mobileNumber
                            ? 'border-rose-300 focus:ring-rose-200'
                            : 'border-slate-200 focus:border-[#0B3A78] focus:ring-[#EAF3FF]'
                        }`}
                      />
                    </div>
                    {errors.mobileNumber && (
                      <p className="mt-1 text-[11px] font-['Poppins'] text-rose-600 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" />
                        {errors.mobileNumber}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-[11px] font-['Poppins'] font-semibold uppercase tracking-wider text-[#1F2937] mb-1">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Minimum 8 characters"
                        className={`w-full pl-9 pr-10 py-2.5 rounded-lg text-xs sm:text-sm font-['Poppins'] border bg-slate-50/40 focus:bg-white text-[#1F2937] placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.password
                            ? 'border-rose-300 focus:ring-rose-200'
                            : 'border-slate-200 focus:border-[#0B3A78] focus:ring-[#EAF3FF]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label="Toggle Password Visibility"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator: Gold #F4B400 / Dark Blue #0B3A78 */}
                    {formData.password && (
                      <div className="mt-1.5 space-y-1">
                        <div className="flex gap-1 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              passScore <= 2
                                ? 'w-1/3 bg-rose-500'
                                : passScore <= 4
                                ? 'w-2/3 bg-[#F4B400]'
                                : 'w-full bg-[#0B3A78]'
                            }`}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-['Poppins'] text-[#1F2937]/70">
                          <span>Strength:</span>
                          <span className="font-semibold text-[#0B3A78]">
                            {passScore <= 2 ? 'Weak' : passScore <= 4 ? 'Moderate' : 'Strong'}
                          </span>
                        </div>
                      </div>
                    )}

                    {errors.password && (
                      <p className="mt-1 text-[11px] font-['Poppins'] text-rose-600 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-[11px] font-['Poppins'] font-semibold uppercase tracking-wider text-[#1F2937] mb-1">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter your password"
                        className={`w-full pl-9 pr-10 py-2.5 rounded-lg text-xs sm:text-sm font-['Poppins'] border bg-slate-50/40 focus:bg-white text-[#1F2937] placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.confirmPassword
                            ? 'border-rose-300 focus:ring-rose-200'
                            : 'border-slate-200 focus:border-[#0B3A78] focus:ring-[#EAF3FF]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label="Toggle Confirm Password Visibility"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-[11px] font-['Poppins'] text-rose-600 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Submit CTA Button: Gold #F4B400 with Dark Blue #0B3A78 Text */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-5 rounded-lg font-['Poppins'] font-semibold text-xs sm:text-sm uppercase tracking-wide text-[#0B3A78] bg-[#F4B400] hover:bg-[#e0a300] shadow-md shadow-[#F4B400]/25 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#0B3A78]" />
                          <span>Securing & Registering...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Registration</span>
                          <Send className="w-3.5 h-3.5 text-[#0B3A78]" />
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-center text-[11px] font-['Poppins'] text-[#1F2937]/60 pt-1">
                    By registering, you agree to Global Nagas Institute's Terms of Admission and Privacy Policy.
                  </p>
                </form>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
