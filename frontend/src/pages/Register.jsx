import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Landmark,
  Copy,
  Check,
  Calendar,
  ShieldCheck,
  Tag,
  Receipt,
  Clock,
} from 'lucide-react';
import { fetchActiveCourses, fetchPricingConfig, calculateCourseFee } from '../services/api';

/**
 * Official GNI Approved Course Catalog & Pricing Matrix
 * Strictly course-and-duration-based pricing.
 */
export const DEFAULT_GNI_CATALOG = [
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
    description: 'A hands-on introduction to Tamil heritage, art, and ancestral craftsmanship.',
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

  // Course catalog & configuration
  const [coursesCatalog, setCoursesCatalog] = useState(DEFAULT_GNI_CATALOG);
  const [selectedCourseName, setSelectedCourseName] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    profession: '',
    experienceLevel: '',
    learningPurpose: '',
  });

  const [copiedField, setCopiedField] = useState(null);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredData, setRegisteredData] = useState(null);

  const location = useLocation();

  // Load live pricing configuration from backend on mount
  useEffect(() => {
    let isMounted = true;
    const loadConfig = async () => {
      try {
        const liveCatalog = await fetchPricingConfig();
        if (isMounted && liveCatalog && liveCatalog.length > 0) {
          setCoursesCatalog(liveCatalog);
        }
      } catch (err) {
        console.warn('[Register] Using local catalog fallback:', err);
      }
    };
    loadConfig();
    return () => {
      isMounted = false;
    };
  }, []);

  // Pre-select course & duration based on URL parameters (?course=...&duration=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const courseParam = params.get('course') || params.get('skill') || params.get('program');
    const durationParam = params.get('duration') || params.get('days');

    if (courseParam && coursesCatalog.length > 0) {
      const decodedCourse = decodeURIComponent(courseParam).trim().toLowerCase();
      const matched = coursesCatalog.find(
        (c) =>
          c.courseName.toLowerCase() === decodedCourse ||
          c.id.toLowerCase() === decodedCourse ||
          c.courseName.toLowerCase().includes(decodedCourse) ||
          decodedCourse.includes(c.courseName.toLowerCase())
      );

      if (matched) {
        setSelectedCourseName(matched.courseName);

        if (durationParam) {
          const decodedDur = decodeURIComponent(durationParam).trim().toLowerCase();
          const matchedDur = matched.durations.find(
            (d) =>
              d.duration.toLowerCase() === decodedDur ||
              d.duration.toLowerCase().includes(decodedDur) ||
              decodedDur.includes(d.duration.toLowerCase())
          );
          if (matchedDur) {
            setSelectedDuration(matchedDur.duration);
          } else {
            setSelectedDuration(matched.durations[0]?.duration || '');
          }
        } else {
          setSelectedDuration(matched.durations[0]?.duration || '');
        }
      }
    }
  }, [location.search, coursesCatalog.length]);

  // Derive selected course object
  const currentCourse = useMemo(() => {
    if (!selectedCourseName) return null;
    return coursesCatalog.find((c) => c.courseName === selectedCourseName) || null;
  }, [selectedCourseName, coursesCatalog]);

  // Available durations for the currently selected course
  const availableDurations = useMemo(() => {
    if (!currentCourse) return [];
    return currentCourse.durations || [];
  }, [currentCourse]);

  // Dynamic fee details for currently selected course and duration
  const currentFeeDetails = useMemo(() => {
    if (!currentCourse || !selectedDuration) return null;
    return (
      currentCourse.durations.find(
        (d) => d.duration.toLowerCase() === selectedDuration.toLowerCase()
      ) || currentCourse.durations[0] || null
    );
  }, [currentCourse, selectedDuration]);

  // Reset duration whenever the course changes
  const handleCourseChange = (e) => {
    const newCourseName = e.target.value;
    setSelectedCourseName(newCourseName);
    // Requirement 2: Reset the selected duration whenever the user changes the course
    setSelectedDuration('');

    if (touched.courseName) {
      setErrors((prev) => ({
        ...prev,
        courseName: newCourseName ? '' : 'Please select a Course / Program Name',
        courseDuration: 'Please select an available duration',
      }));
    }
  };

  const handleDurationChange = (e) => {
    const newDuration = e.target.value;
    setSelectedDuration(newDuration);

    if (touched.courseDuration) {
      setErrors((prev) => ({
        ...prev,
        courseDuration: newDuration ? '' : 'Please select Course Duration',
      }));
    }
  };

  const copyToClipboard = (text, fieldName) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2200);
    }
  };

  const experienceOptions = ['Beginner', 'Intermediate', 'Advanced'];

  // Prevent numbers from being typed into text-only fields (Full Name, Location, Profession)
  const handleTextOnlyKeyDown = (e) => {
    if (
      e.ctrlKey ||
      e.metaKey ||
      e.altKey ||
      ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter', ' '].includes(e.key)
    ) {
      return;
    }
    if (/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  // Prevent non-digits from being typed into number fields & limit to country digits
  const handleNumberOnlyKeyDown = (e) => {
    if (
      e.ctrlKey ||
      e.metaKey ||
      e.altKey ||
      ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter'].includes(e.key)
    ) {
      return;
    }

    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      return;
    }

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

      case 'courseName':
        if (!value) {
          error = 'Please select a Course / Program Name';
        }
        break;

      case 'courseDuration':
        if (!value) {
          error = 'Please select an available Course Duration';
        }
        break;

      case 'experienceLevel':
        if (!value) {
          error = 'Please select your prior experience level';
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

    return error;
  };

  // Validate entire form before submission
  const validateForm = () => {
    const newErrors = {};
    const newTouched = {};

    Object.keys(formData).forEach((key) => {
      newTouched[key] = true;
      const fieldError = validateField(key, formData[key]);
      if (fieldError) newErrors[key] = fieldError;
    });

    // Validate course selection & duration
    newTouched.courseName = true;
    const courseError = validateField('courseName', selectedCourseName);
    if (courseError) newErrors.courseName = courseError;

    newTouched.courseDuration = true;
    const durationError = validateField('courseDuration', selectedDuration);
    if (durationError) newErrors.courseDuration = durationError;

    setTouched(newTouched);
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Check whether form is fully valid for live button state
  const isFormValid = useMemo(() => {
    const hasName = formData.fullName.trim().length >= 2;
    const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
    const hasPhone = (formData.phone || '').replace(/\D/g, '').length === currentCountry.digits;
    const hasLocation = formData.location.trim().length >= 3;
    const hasProfession = formData.profession.trim().length >= 2;
    const hasCourse = Boolean(selectedCourseName);
    const hasDuration = Boolean(selectedDuration);
    const hasLevel = Boolean(formData.experienceLevel);
    const hasPurpose = formData.learningPurpose.trim().length >= 10;

    return (
      hasName &&
      hasEmail &&
      hasPhone &&
      hasLocation &&
      hasProfession &&
      hasCourse &&
      hasDuration &&
      hasLevel &&
      hasPurpose
    );
  }, [formData, currentCountry.digits, selectedCourseName, selectedDuration]);

  // Input change with strict type sanitization
  const handleChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;

    if (name === 'fullName' || name === 'location' || name === 'profession') {
      value = value.replace(/[0-9]/g, '');
    } else if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      value = digitsOnly.slice(0, currentCountry.digits);
    } else if (name === 'email') {
      value = value.replace(/\s/g, '');
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

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

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setErrorMessage('Please complete all required fields correctly before proceeding.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const submissionPayload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      country: currentCountry.name,
      countryCode: currentCountry.code,
      countryDial: currentCountry.dial,
      fullPhone: `${currentCountry.dial} ${formData.phone.trim()}`,
      location: formData.location.trim(),
      profession: formData.profession.trim(),
      courseName: selectedCourseName,
      interestedSkill: selectedCourseName,
      courseDuration: selectedDuration,
      duration: selectedDuration,
      experienceLevel: formData.experienceLevel,
      learningPurpose: formData.learningPurpose.trim(),
      paymentMethod: 'Offline Payment at Campus',
      paymentRef: 'Offline Campus Payment',
    };

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionPayload),
      });

      const contentType = response.headers.get('content-type') || '';
      let result = {};

      if (contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON server response:', text);
        throw new Error('Backend server is unreachable or returned an invalid response.');
      }

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed. Please check your details and try again.');
      }

      setRegisteredData(result.data || submissionPayload);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F2E8] text-[#241A16] py-6 sm:py-10 px-4 relative overflow-hidden flex flex-col justify-center">
      <div className="max-w-xl mx-auto w-full relative z-10">
        {/* Top Navigation Back Link */}
        <div className="mb-3 sm:mb-4">
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
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-[#6B4030]/15 shadow-md text-center space-y-4 sm:space-y-5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <div className="space-y-1.5">
              <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-bold text-[#241A16]">
                Registration Successful!
              </h2>
              <p className="font-['Cormorant_Garamond'] text-base sm:text-lg text-[#6B4030] font-semibold">
                Welcome to the Heritage Creator Journey.
              </p>
              <p className="font-['DM_Sans'] text-xs text-[#241A16]/75 max-w-sm mx-auto leading-relaxed">
                Thank you for applying. Our institutional admissions guild has received your details and will reach out via email and WhatsApp with your cohort schedule and starter kit guidance.
              </p>
            </div>

            {registeredData && (
              <div className="space-y-3.5">
                {/* Official Application Reference ID Banner */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#4A2C20] text-[#F7F2E8] border border-[#B89555] flex flex-col sm:flex-row items-center justify-between gap-2.5">
                  <div className="text-center sm:text-left">
                    <span className="text-[10px] text-[#B89555] font-semibold uppercase tracking-wider block font-['DM_Sans']">
                      Official Application Reference ID
                    </span>
                    <span className="font-mono text-base sm:text-lg font-bold text-white tracking-wide">
                      {registeredData.applicationRef || 'GNI-APP-2026-PENDING'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(registeredData.applicationRef || '', 'app_ref')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B89555] hover:bg-[#c8a565] text-[#241A16] font-['DM_Sans'] text-xs font-semibold cursor-pointer transition-colors shrink-0"
                  >
                    {copiedField === 'app_ref' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'app_ref' ? 'Copied' : 'Copy ID'}</span>
                  </button>
                </div>

                {/* Application Details Summary Breakdown */}
                <div className="bg-[#FAF7F0] rounded-xl p-4 border border-[#6B4030]/15 text-left space-y-2 text-xs font-['DM_Sans'] text-[#241A16]">
                  <div className="flex justify-between border-b border-[#6B4030]/15 pb-1.5">
                    <span className="text-[#6B4030] font-medium">Applicant Name:</span>
                    <span className="font-bold text-[#4A2C20]">{registeredData.fullName}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#6B4030]/15 pb-1.5">
                    <span className="text-[#6B4030] font-medium">Email Address:</span>
                    <span className="font-medium text-[#241A16]">{registeredData.email}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#6B4030]/15 pb-1.5">
                    <span className="text-[#6B4030] font-medium">Contact Number:</span>
                    <span className="font-medium text-[#241A16]">
                      {registeredData.countryDial || currentCountry.dial} {registeredData.phone}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[#6B4030]/15 pb-1.5">
                    <span className="text-[#6B4030] font-medium">Selected Course / Program:</span>
                    <span className="font-bold text-[#B89555] text-right truncate max-w-[240px]" title={registeredData.courseName || selectedCourseName}>
                      {registeredData.courseName || selectedCourseName}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[#6B4030]/15 pb-1.5">
                    <span className="text-[#6B4030] font-medium">Course Duration:</span>
                    <span className="font-semibold text-[#4A2C20]">
                      {registeredData.courseDuration || selectedDuration}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[#6B4030]/15 pb-1.5">
                    <span className="text-[#6B4030] font-medium">Approved Course Fee:</span>
                    <span className="font-bold font-number text-[#B89555]">
                      {registeredData.formattedFee || currentFeeDetails?.formattedFee || '₹4,999'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[#6B4030]/15 pb-1.5">
                    <span className="text-[#6B4030] font-medium">Payment Mode & Status:</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <Landmark className="w-3 h-3 text-emerald-700" />
                      <span>{registeredData.paymentStatus || 'Pending Offline Payment at Campus'}</span>
                    </span>
                  </div>
                  <div className="flex justify-between pt-0.5">
                    <span className="text-[#6B4030] font-medium">Payment Method:</span>
                    <span className="font-semibold text-[#4A2C20]">Offline / Direct Campus Payment</span>
                  </div>
                </div>

                {/* Offline Campus Payment Instructions Card */}
                <div className="rounded-xl border border-[#B89555]/40 bg-[#FAF7F0] p-4 text-left space-y-3 text-xs font-['DM_Sans']">
                  <div className="flex items-center justify-between border-b border-[#6B4030]/15 pb-2">
                    <div className="flex items-center gap-1.5 font-bold text-[#4A2C20]">
                      <Landmark className="w-4 h-4 text-[#B89555]" />
                      <span>Offline Admission & Campus Payment</span>
                    </div>
                    <span className="text-[10.5px] font-semibold text-[#4A2C20] bg-[#B89555]/20 px-2.5 py-0.5 rounded-full">
                      Payable at Campus: {registeredData.formattedTotal || currentFeeDetails?.formattedTotal || '₹4,999'}
                    </span>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-[#B89555]/30 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#4A2C20]">Payment Process: In-Person / Offline</span>
                      <span className="text-[10px] text-[#4A2C20] bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#6B4030]/15 font-semibold">
                        Orientation Day
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B4030] leading-relaxed">
                      Your cohort seat is officially reserved. Please quote your Application Reference ID <strong className="font-mono text-[#4A2C20]">{registeredData.applicationRef}</strong> when completing your tuition fee payment of <strong className="font-number text-[#B89555]">{registeredData.formattedTotal || currentFeeDetails?.formattedTotal || '₹4,999'}</strong> directly at the Global Nagas Institute campus admissions desk upon orientation arrival (Cash, Cheque, or Campus Card POS).
                    </p>
                    <div className="p-2.5 rounded-md bg-[#FAF7F0] border border-[#6B4030]/15 text-[11px] text-[#4A2C20] space-y-1">
                      <div className="font-semibold text-[#4A2C20] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#B89555] shrink-0" />
                        <span>Admissions Campus Desk:</span>
                      </div>
                      <p className="text-[#6B4030] pl-5 leading-snug">
                        No.156, 2nd floor, Uppara street, Raja street corner, Coimbatore 641001
                      </p>
                    </div>
                  </div>

                  <p className="text-[10.5px] text-[#6B4030]/80">
                    ℹ️ Our admissions coordinator will also reach out to you via phone and email with your cohort orientation timing and studio pass details.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-['DM_Sans'] text-xs font-semibold text-[#F7F2E8] bg-[#4A2C20] hover:bg-[#6B4030] transition-colors shadow-sm text-center"
              >
                Return to Home
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false);
                  setSelectedCourseName('');
                  setSelectedDuration('');
                  setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    location: '',
                    profession: '',
                    experienceLevel: '',
                    learningPurpose: '',
                    paymentRef: '',
                  });
                  setErrors({});
                  setTouched({});
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-['DM_Sans'] text-xs font-semibold text-[#241A16] bg-[#F7F2E8] hover:bg-[#ebd9bd] transition-colors border border-[#6B4030]/20 cursor-pointer"
              >
                Register Another Applicant
              </button>
            </div>
          </div>
        ) : (
          /* Main Application Form Container */
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-[#6B4030]/15 shadow-md">
            {/* Header with Official Logo */}
            <div className="text-center mx-auto mb-5">
              <img
                src="/artisan/logo.png"
                alt="Global Nagas Institute"
                className="h-14 sm:h-16 w-auto mx-auto object-contain mb-2.5 hover:scale-105 transition-transform"
              />
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#4A2C20]/10 border border-[#6B4030]/20 text-[#6B4030] text-[11px] font-['DM_Sans'] font-medium mb-1.5">
                <Sparkles className="w-3 h-3 text-[#B89555]" />
                <span>Admissions Open 2026</span>
              </div>
              <h1 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-bold text-[#241A16] tracking-tight leading-tight">
                Heritage Creator Cohort Application
              </h1>
              <p className="font-['DM_Sans'] mt-1 text-xs text-[#6B4030] leading-relaxed font-normal">
                Register your interest for our upcoming 60-day intensive hands-on craftsmanship cohort.
              </p>
            </div>

            {/* Error Notification Banner */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* SECTION: APPLICANT PERSONAL DETAILS */}
              <div className="space-y-3.5">
                {/* 1. Full Name */}
                <div className="space-y-1 text-left">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Full Name <span className="text-red-600">*</span>
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

                {/* 3. Phone / WhatsApp Number with Integrated Country Selector */}
                <div className="space-y-1 text-left">
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
                    <div className="relative border-r border-[#6B4030]/20 shrink-0 flex items-center bg-black/5 rounded-l-xl w-[86px] sm:w-[96px]">
                      <select
                        aria-label="Country Code"
                        value={selectedCountryCode}
                        onChange={handleCountryChange}
                        className="w-full h-full pl-2.5 pr-6 py-2.5 bg-transparent text-xs font-['DM_Sans'] text-[#241A16] font-semibold focus:outline-hidden cursor-pointer appearance-none truncate"
                      >
                        {countryList.map((c) => (
                          <option key={c.code} value={c.code} className="bg-white text-[#241A16]">
                            {c.flag} {c.dial} ({c.code})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[#6B4030] absolute right-1.5 pointer-events-none" />
                    </div>

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

                {/* 4. Location (City, State) */}
                <div className="space-y-1 text-left">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Location (City, State) <span className="text-red-600">*</span>
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

                {/* 5. Current Profession / Background */}
                <div className="space-y-1 text-left">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Current Profession / Background <span className="text-red-600">*</span>
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
                      placeholder="e.g. Architecture student, Textile artist, Researcher"
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
              </div>

              {/* SECTION: COURSE / PROGRAM SELECTION & DYNAMIC FEE INTEGRATION */}
              <div className="pt-2 border-t border-[#6B4030]/15 space-y-3.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#B89555]" />
                  <span className="font-['DM_Sans'] text-xs font-bold text-[#4A2C20] uppercase tracking-wider">
                    Program Selection & Fee Structure
                  </span>
                </div>

                {/* 1. Required Field: Course / Program Name */}
                <div className="space-y-1 text-left">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Course / Program Name <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Layers className="w-4 h-4 text-[#6B4030] absolute left-3.5 top-3.5 pointer-events-none" />
                    <select
                      name="courseName"
                      value={selectedCourseName}
                      onChange={handleCourseChange}
                      onBlur={() => {
                        setTouched((prev) => ({ ...prev, courseName: true }));
                        const error = validateField('courseName', selectedCourseName);
                        setErrors((prev) => ({ ...prev, courseName: error }));
                      }}
                      className={`w-full pl-10 pr-9 py-2.5 rounded-xl border text-sm text-[#241A16] transition-colors focus:outline-hidden cursor-pointer appearance-none ${
                        touched.courseName && errors.courseName
                          ? 'border-red-500 bg-red-50/10 focus:border-red-600 focus:ring-1 focus:ring-red-500/20'
                          : selectedCourseName
                          ? 'border-[#B89555] bg-white'
                          : 'border-[#6B4030]/20 bg-[#F7F2E8]/40 focus:bg-white focus:border-[#B89555]'
                      }`}
                    >
                      <option value="">— Select Course / Program Name —</option>
                      {coursesCatalog.map((c) => (
                        <option key={c.id || c.courseName} value={c.courseName}>
                          {c.courseName} ({c.category || 'Program'})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#6B4030] absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                  {touched.courseName && errors.courseName && (
                    <p className="text-[11px] font-['DM_Sans'] text-red-600 flex items-center gap-1 pt-0.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.courseName}</span>
                    </p>
                  )}
                </div>

                {/* 2. Required Field: Course Duration (Dependent on Course Selection) */}
                <div className="space-y-1 text-left">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                      Course Duration <span className="text-red-600">*</span>
                    </label>
                    {selectedCourseName && availableDurations.length > 0 && (
                      <span className="text-[10.5px] font-['DM_Sans'] text-[#6B4030]">
                        {availableDurations.length} duration options available
                      </span>
                    )}
                  </div>

                  {selectedCourseName ? (
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-[#6B4030] absolute left-3.5 top-3.5 pointer-events-none" />
                      <select
                        name="courseDuration"
                        value={selectedDuration}
                        onChange={handleDurationChange}
                        onBlur={() => {
                          setTouched((prev) => ({ ...prev, courseDuration: true }));
                          const error = validateField('courseDuration', selectedDuration);
                          setErrors((prev) => ({ ...prev, courseDuration: error }));
                        }}
                        className={`w-full pl-10 pr-9 py-2.5 rounded-xl border text-sm text-[#241A16] transition-colors focus:outline-hidden cursor-pointer appearance-none ${
                          touched.courseDuration && errors.courseDuration
                            ? 'border-red-500 bg-red-50/10 focus:border-red-600 focus:ring-1 focus:ring-red-500/20'
                            : selectedDuration
                            ? 'border-[#B89555] bg-white'
                            : 'border-[#6B4030]/20 bg-[#F7F2E8]/40 focus:bg-white focus:border-[#B89555]'
                        }`}
                      >
                        <option value="">— Choose Duration for {selectedCourseName} —</option>
                        {availableDurations.map((d) => (
                          <option key={d.duration} value={d.duration}>
                            {d.duration} — Fee: {d.formattedFee} ({d.mode})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#6B4030] absolute right-3 top-3.5 pointer-events-none" />
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl border border-dashed border-[#6B4030]/25 bg-[#FAF7F0] text-xs text-[#6B4030] flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#B89555] shrink-0" />
                      <span>Please select a Course / Program Name above to view available durations.</span>
                    </div>
                  )}

                  {touched.courseDuration && errors.courseDuration && (
                    <p className="text-[11px] font-['DM_Sans'] text-red-600 flex items-center gap-1 pt-0.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.courseDuration}</span>
                    </p>
                  )}
                </div>

                {/* 3. Dynamic Course Fee (Separate Read-Only Field) */}
                <div className="space-y-1 text-left">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Course Fee <span className="text-[10px] text-[#6B4030]">(Official Approved Fee • Read-Only)</span>
                  </label>
                  <div className="relative">
                    <Receipt className="w-4 h-4 text-[#6B4030] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      readOnly
                      aria-readonly="true"
                      value={
                        selectedCourseName && selectedDuration && currentFeeDetails
                          ? `${currentFeeDetails.formattedFee} (${selectedCourseName} • ${selectedDuration})`
                          : ''
                      }
                      placeholder="Select course and duration to view approved fee"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#6B4030]/20 bg-[#FAF7F0] text-sm font-semibold text-[#4A2C20] placeholder-[#6B4030]/50 cursor-not-allowed select-none focus:outline-hidden"
                    />
                  </div>
                  <p className="text-[10.5px] font-['DM_Sans'] text-[#6B4030]/80">
                    Course fee is governed by institutional tier pricing and cannot be edited manually.
                  </p>
                </div>

                {/* 4. Payment Details Summary (Immediately Follows Course Selection Fields) */}
                {selectedCourseName && selectedDuration && currentFeeDetails && (
                  <div className="rounded-2xl border border-[#B89555]/50 bg-[#FAF7F0] p-4 sm:p-5 space-y-3.5 text-left shadow-2xs">
                    <div className="flex items-center justify-between border-b border-[#6B4030]/15 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#4A2C20] text-[#B89555] flex items-center justify-center shrink-0">
                          <Landmark className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-['Cormorant_Garamond'] text-base sm:text-lg font-bold text-[#241A16] leading-tight">
                            Payment Details Summary
                          </h3>
                          <span className="text-[10px] font-['DM_Sans'] text-[#6B4030]">
                            Synchronized with Selected Course & Duration
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#B89555]/20 text-[#4A2C20] text-[10px] font-['DM_Sans'] font-bold">
                        Institutional Rate
                      </span>
                    </div>

                    {/* Breakdown Matrix */}
                    <div className="bg-[#F7F2E8] p-3.5 rounded-xl border border-[#6B4030]/15 text-xs font-['DM_Sans'] space-y-2">
                      <div className="flex justify-between items-center text-[#6B4030]">
                        <span>Selected Course Name:</span>
                        <span className="font-bold text-[#241A16] text-right truncate max-w-[220px]" title={selectedCourseName}>
                          {selectedCourseName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[#6B4030]">
                        <span>Selected Duration:</span>
                        <span className="font-semibold text-[#241A16]">{selectedDuration}</span>
                      </div>
                      <div className="flex justify-between items-center text-[#6B4030]">
                        <span>Course Fee (Standard Tuition):</span>
                        <span className="font-medium font-number text-[#241A16]">
                          {currentFeeDetails.formattedOriginal || currentFeeDetails.formattedFee}
                        </span>
                      </div>
                      {currentFeeDetails.discount > 0 && (
                        <div className="flex justify-between items-center text-emerald-800">
                          <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3 text-emerald-700" />
                            <span>Institutional Cohort Discount:</span>
                          </span>
                          <span className="font-semibold font-number">
                            - {currentFeeDetails.formattedDiscount}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-[#6B4030]">
                        <span>Applicable Taxes & Charges:</span>
                        <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                          ₹0 (Included)
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-t border-[#6B4030]/15 pt-2 text-sm font-bold text-[#4A2C20]">
                        <span>Final Total Payable Amount:</span>
                        <span className="font-number text-[#B89555] text-lg font-bold">
                          {currentFeeDetails.formattedTotal}
                        </span>
                      </div>
                    </div>

                    {/* Offline Campus Payment Information Notice */}
                    <div className="rounded-xl border border-[#B89555]/35 bg-white p-3.5 sm:p-4 space-y-2.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#4A2C20] uppercase tracking-wide flex items-center gap-1.5">
                          <Landmark className="w-3.5 h-3.5 text-[#B89555]" />
                          <span>Payment Process: Offline In-Person at Campus</span>
                        </span>
                        <span className="text-[9.5px] text-[#4A2C20] bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#6B4030]/15 font-semibold">
                          On Orientation Day
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6B4030] leading-relaxed">
                        Course tuition and studio materials fee of <strong className="font-number font-bold text-[#B89555]">{currentFeeDetails.formattedTotal}</strong> is payable directly at the Global Nagas Institute campus admissions desk upon arrival for your cohort orientation (Cash, Cheque, or Campus Card POS).
                      </p>
                      <div className="p-2.5 rounded-lg bg-[#FAF7F0] border border-[#6B4030]/15 text-[11px] text-[#4A2C20] space-y-1">
                        <div className="font-semibold text-[#4A2C20] flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#B89555] shrink-0" />
                          <span>Campus Admissions Desk:</span>
                        </div>
                        <p className="text-[#6B4030] pl-5 leading-snug">
                          No.156, 2nd floor, Uppara street, Raja street corner, Coimbatore 641001
                        </p>
                      </div>
                      <p className="text-[10px] text-[#6B4030]/80 pt-0.5">
                        ✓ No online payment required now. Submitting this application reserves your cohort seat.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION: EXPERIENCE & LEARNING PURPOSE */}
              <div className="pt-2 border-t border-[#6B4030]/15 space-y-3.5">
                {/* Prior Experience Level */}
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Prior Experience Level <span className="text-red-600">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                    {experienceOptions.map((lvl) => (
                      <label
                        key={lvl}
                        className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-['DM_Sans'] font-medium cursor-pointer transition-all ${
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

                {/* Why do you want to learn heritage skills? */}
                <div className="space-y-1 text-left">
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
                      placeholder="Share your goals (e.g. revive temple art, master stone scribing, bridal jewellery design, or creative craft)..."
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

              {/* Submit & Proceed Button (Disabled until course, duration, and details are valid) */}
              <div className="pt-2 sm:pt-3">
                <button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className={`w-full py-3.5 sm:py-4 rounded-xl font-['DM_Sans'] text-xs sm:text-sm font-semibold transition-all duration-200 border flex items-center justify-center gap-2 ${
                    isFormValid && !loading
                      ? 'bg-[#B89555] hover:bg-[#c8a565] text-[#241A16] border-[#B89555] shadow-sm cursor-pointer'
                      : 'bg-[#6B4030]/20 text-[#6B4030]/60 border-transparent cursor-not-allowed opacity-75'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#241A16]" />
                      <span>Validating & Submitting Application...</span>
                    </>
                  ) : !selectedCourseName || !selectedDuration ? (
                    <span>Select Course & Duration to Proceed</span>
                  ) : (
                    <span>
                      Submit Application • {currentFeeDetails?.formattedTotal || 'Payable Fee'}
                    </span>
                  )}
                </button>
                {!isFormValid && (
                  <p className="text-center text-[10.5px] font-['DM_Sans'] text-[#6B4030] pt-1.5">
                    Please fill all required fields, select a course, and pick a duration to activate submission.
                  </p>
                )}
              </div>

              <div className="text-center pt-1">
                <p className="text-[11px] font-['DM_Sans'] text-[#241A16]/60">
                  By submitting, you agree to uphold sacred Tamil craftsmanship ethics and cultural heritage preservation.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Institute Campus Address Footer - Strictly Single Line */}
      <div className="mt-4 text-center text-xs font-['DM_Sans'] text-[#6B4030] w-full max-w-3xl mx-auto px-2 relative z-10">
        <div className="inline-flex items-center justify-center gap-2 text-[#4A2C20] font-medium bg-white/80 px-4 py-1.5 rounded-full border border-[#6B4030]/15 shadow-2xs whitespace-nowrap overflow-x-auto max-w-full text-[11px] sm:text-xs">
          <MapPin className="w-3.5 h-3.5 text-[#B89555] shrink-0" />
          <span className="whitespace-nowrap">
            Campus Address: No.156, 2nd floor, Uppara street, Raja street corner, Coimbatore 641001
          </span>
        </div>
      </div>
    </div>
  );
}
