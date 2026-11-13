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
  Globe,
  Navigation,
  BookOpen,
  Award,
  Package,
  Hammer,
  CheckCircle,
  Info,
} from 'lucide-react';
import {
  fetchActiveCourses,
  fetchPricingConfig,
  calculateCourseFee,
  resendConfirmationEmail,
  fetchPillars,
  checkEmailEligibility,
  checkRegistrationEligibility,
} from '../services/api';
import GniLoader from '../components/GniLoader';
import {
  COUNTRY_LIST,
  getStatesForCountry,
  getCitiesForState,
} from '../data/locationData';
import { DEFAULT_PILLARS } from '../data/pillarData';

/**
 * Official GNI Approved Course Catalog & Pricing Matrix
 * Strictly course-and-duration-based pricing.
 */
// Helper to determine if an offering qualifies as a Journey (10+ days or journey/cohort keywords)
export function isJourneyOffering(item) {
  if (!item) return false;

  // 1. Strict primary rule: 1–9 days is Workshop (false), 10+ days is Learning Journey (true)
  const dur = String(item.duration || '').trim().toLowerCase();
  const dayMatch = dur.match(/(\d+)\s*day/i) || dur.match(/^(\d+)$/);
  const dayCount = dayMatch ? parseInt(dayMatch[1], 10) : null;
  if (dayCount !== null) {
    return dayCount >= 10;
  }

  // 2. Check durations array if present
  if (Array.isArray(item.durations) && item.durations.length > 0) {
    const primaryDays = Number(item.durations[0]?.days);
    if (!isNaN(primaryDays) && primaryDays > 0) {
      return primaryDays >= 10;
    }
  }

  // 3. Keywords in duration string
  if (/month|cohort|year/i.test(dur)) return true;

  const offType = String(item.offering_type || '').toLowerCase();
  if (offType.includes('journey')) return true;
  if (offType.includes('workshop')) return false;

  const cat = String(item.category || '').toLowerCase();
  const title = String(item.title || item.courseName || '').toLowerCase();
  if (cat.includes('journey') || title.includes('journey') || cat.includes('cohort')) return true;

  return false;
}

/**
 * Detects if a course offering is common / merged across all heritage pillars.
 */
export function isCommonPillarOffering(course, activeCourses = []) {
  if (!course) return false;
  const directId = course.pillarId !== undefined && course.pillarId !== null ? course.pillarId : course.pillar_id;
  if (directId === 'all' || directId === 0 || directId === '0') return true;

  const directTitle = String(course.pillar_title || course.pillarTitle || '').trim().toLowerCase();
  if (directTitle.includes('all heritage') || directTitle.includes('all pillars') || directTitle.includes('common')) return true;

  const cTitle = String(course.courseName || course.title || '').trim().toLowerCase();
  const seat = (activeCourses || []).find((ac) => {
    if (!ac) return false;
    const acTitle = String(ac.title || ac.courseName || '').trim().toLowerCase();
    return acTitle === cTitle || acTitle.includes(cTitle) || cTitle.includes(acTitle);
  });
  if (seat) {
    if (seat.pillar_id === 'all' || seat.pillar_id === 0 || seat.pillar_id === '0') return true;
    const seatPTitle = String(seat.pillar_title || '').trim().toLowerCase();
    if (seatPTitle.includes('all heritage') || seatPTitle.includes('all pillars') || seatPTitle.includes('common')) return true;
  }
  return false;
}

/**
 * Resolves the Heritage Skill Pillar ID (1, 2, 3, or 4) for any course or offering.
 * Uses explicit metadata, active course mappings, pillar titles, and Shastric keyword inference.
 */
export function resolveCoursePillarId(course, activeCourses = [], allPillars = DEFAULT_PILLARS) {
  if (!course) return 'all';

  // 0. Explicit 'all' / 0 check: if course merges across all pillars, return 'all'
  if (isCommonPillarOffering(course, activeCourses)) {
    return 'all';
  }

  // 1. Direct pillarId or pillar_id property if matched to an actual pillar
  const directId = course.pillarId !== undefined && course.pillarId !== null
    ? course.pillarId
    : course.pillar_id;

  if (directId && directId !== 'all' && directId !== 0 && directId !== '0') {
    const matched = (allPillars || []).find(
      (p) => String(p.id) === String(directId) || String(p.number) === String(directId)
    );
    if (matched) return Number(matched.id || matched.number);
  }

  // 2. Direct match by course pillar_title
  const cPillarTitle = String(course.pillar_title || course.pillarTitle || '').trim().toLowerCase();
  if (cPillarTitle && allPillars && allPillars.length > 0) {
    const matchByTitle = allPillars.find(
      (p) => String(p.title || '').trim().toLowerCase() === cPillarTitle
    );
    if (matchByTitle) return Number(matchByTitle.id || matchByTitle.number);
  }

  const cTitle = String(course.courseName || course.title || '').trim().toLowerCase();

  // 3. Active courses lookup
  const seat = (activeCourses || []).find((ac) => {
    if (!ac) return false;
    const acTitle = String(ac.title || ac.courseName || '').trim().toLowerCase();
    return acTitle === cTitle || acTitle.includes(cTitle) || cTitle.includes(acTitle);
  });

  if (seat) {
    if (seat.pillar_id && seat.pillar_id !== 'all') {
      const matchPillar = (allPillars || []).find(
        (p) => String(p.id) === String(seat.pillar_id) || String(p.number) === String(seat.pillar_id)
      );
      if (matchPillar) return Number(matchPillar.id || matchPillar.number);
    }
    if (seat.pillar_title) {
      const matchByTitle = (allPillars || []).find(
        (p) => String(p.title || '').trim().toLowerCase() === String(seat.pillar_title).trim().toLowerCase()
      );
      if (matchByTitle) return Number(matchByTitle.id || matchByTitle.number);
    }
  }

  // 4. Match pillarTitle / category against allPillars
  const coursePillarTitle = String(course.pillarTitle || course.category || '').toLowerCase();
  if (coursePillarTitle) {
    const matchByTitle = (allPillars || []).find((p) => {
      const pTitle = String(p.title || '').toLowerCase();
      const pCat = String(p.category || '').toLowerCase();
      return coursePillarTitle.includes(pTitle) || pTitle.includes(coursePillarTitle) ||
             coursePillarTitle.includes(pCat) || pCat.includes(coursePillarTitle);
    });
    if (matchByTitle) return Number(matchByTitle.id || matchByTitle.number);
  }

  // 5. Dynamic keyword inference mapped to live pillars
  const findPillarByRegex = (regex) => {
    return (allPillars || []).find((p) => {
      const pTitle = String(p.title || '').toLowerCase();
      const pCat = String(p.category || '').toLowerCase();
      const pDesc = String(p.description || '').toLowerCase();
      return regex.test(pTitle) || regex.test(pCat) || regex.test(pDesc);
    });
  };

  // Libi, Scripts, Epigraphy
  if (/epigraph|script|tamili|brahmi|libi|inscription|palm leaf|palm-leaf/i.test(cTitle)) {
    const p = findPillarByRegex(/libi|script|epigraph|inscript/i);
    if (p) return Number(p.id || p.number);
    return 2;
  }
  // Sculpturing & Sacred Metal
  if (/metal|sculptur|jewell|jewelry|nakshi|casting|foundry|forge|bronze|brass|chasing|anvil/i.test(cTitle)) {
    const p = findPillarByRegex(/metal|sculptur|naga|casting|forge/i);
    if (p) return Number(p.id || p.number);
    return 3;
  }
  // Heritage Applications & Crafts
  if (/interior|decor|woodwork|terracotta|architecture|ancient tamil art|pedagogy|application/i.test(cTitle)) {
    const p = findPillarByRegex(/application|interior|craft|woodwork|terracotta|architecture/i);
    if (p) return Number(p.id || p.number);
    return 4;
  }
  // Painting & Mineral Pigments
  if (/paint|pigment|fresco|rock art|drawing|creator|foundation|shilpa/i.test(cTitle)) {
    const p = findPillarByRegex(/paint|pigment|fresco|rock art/i);
    if (p) return Number(p.id || p.number);
    return 1;
  }

  if (allPillars && allPillars.length > 0) {
    return Number(allPillars[0].id || allPillars[0].number || 1);
  }
  return 1;
}

/**
 * Builds a unified catalog by merging backend pricing config with live active courses
 * and localStorage custom courses (from Admin).
 */
export function buildUnifiedCatalog(baseCatalog, activeCourses, allPillars = DEFAULT_PILLARS) {
  const hasActive = Array.isArray(activeCourses) && activeCourses.length > 0;

  if (hasActive) {
    return activeCourses
      .filter((ac) => ac && ac.title && (ac.is_active === 1 || ac.is_active === true || ac.is_active === undefined))
      .map((ac) => {
        const acTitle = String(ac.title).trim();
        const acTitleLower = acTitle.toLowerCase();
        const isJourney = isJourneyOffering(ac);
        const resolvedPillar = resolveCoursePillarId(ac, activeCourses, allPillars);

        // Find optional baseEntry metadata (takeHome, description)
        const baseEntry = (baseCatalog || []).find((c) => {
          const cnLower = String(c.courseName || '').toLowerCase().trim();
          return cnLower === acTitleLower;
        });

        // Determine duration options:
        // 1. Admin custom duration options on the course
        const adminOptions = Array.isArray(ac.durations)
          ? ac.durations.filter((o) => {
              const d = Number(o.days);
              const f = Number(o.fee);
              if (!d || !f) return false;
              // Workshop strictly 1–9 days, Learning Journey strictly 10+ days
              if (!isJourney && d > 9) return false;
              if (isJourney && d < 10) return false;
              return true;
            })
          : [];

        let durations = [];
        if (adminOptions.length > 0) {
          durations = adminOptions.map((o) => {
            const days = Number(o.days);
            const fee = Number(o.fee);
            const original = Math.max(fee, Number(o.original_price) || fee);
            const label = String(o.label || '').trim();
            return {
              duration: `${days} ${days === 1 ? 'Day' : 'Days'}${label ? ` ${label}` : ''}`,
              fee,
              originalPrice: original,
              discount: original - fee,
              taxes: 0,
              totalPayable: fee,
              formattedFee: `₹${fee.toLocaleString('en-IN')}`,
              formattedOriginal: `₹${original.toLocaleString('en-IN')}`,
              formattedDiscount: `₹${(original - fee).toLocaleString('en-IN')}`,
              formattedTotal: `₹${fee.toLocaleString('en-IN')}`,
              mode: ac.mode || '',
              note: '',
            };
          });
        } else if (baseEntry && Array.isArray(baseEntry.durations) && baseEntry.durations.length > 0) {
          // Use baseEntry durations if strictly conforming to offering category
          durations = baseEntry.durations.filter((d) => {
            const dayMatch = String(d.duration || '').match(/(\d+)\s*day/i);
            const count = dayMatch ? parseInt(dayMatch[1], 10) : null;
            if (count !== null) {
              if (!isJourney && count > 9) return false;
              if (isJourney && count < 10) return false;
            }
            return true;
          });
        }

        // Fallback to the exact single duration shown on the website
        if (!durations.length) {
          const price = Number(ac.discount_price || ac.original_price || (isJourney ? 9999 : 4999));
          const origPrice = Number(ac.original_price || (isJourney ? 19999 : 9999));
          const discount = Math.max(0, origPrice - price);
          const dur = ac.duration || (isJourney ? '60 Days' : '1 Day');
          durations = [
            {
              duration: dur,
              fee: price,
              originalPrice: origPrice,
              discount: discount,
              taxes: 0,
              totalPayable: price,
              formattedFee: `₹${price.toLocaleString('en-IN')}`,
              formattedOriginal: `₹${origPrice.toLocaleString('en-IN')}`,
              formattedDiscount: `₹${discount.toLocaleString('en-IN')}`,
              formattedTotal: `₹${price.toLocaleString('en-IN')}`,
              mode: ac.mode || (isJourney ? 'Full Cohort Immersion' : 'Studio Hands-on'),
              note: isJourney
                ? 'Complete structured curriculum modules, master sthapathi guidance & field visit.'
                : 'Raw materials, inscription plate, and certified craft kit.',
            },
          ];
        }

        return {
          id: String(ac.slug || ac.id || `course-${acTitle}`),
          courseName: acTitle,
          pillarId: resolvedPillar || 1,
          pillarTitle: ac.pillar_title || (isJourney ? 'Comprehensive Guild Syllabus' : 'Heritage Studio Workshop'),
          category: isJourney ? 'Learning Journey' : (ac.category || 'Workshop'),
          description: ac.description || (isJourney ? 'Hands-on heritage learning journey & tactile craft immersion.' : 'Hands-on heritage workshop.'),
          takeHome: baseEntry?.takeHome || (isJourney
            ? 'Comprehensive structured cohort portfolio, physical guild artifact & certificate'
            : 'Handcrafted heritage artifact, studio tools kit & certificate'),
          durations,
        };
      });
  }

  // Fallback if active courses not yet loaded
  return Array.isArray(baseCatalog) ? baseCatalog : [];
}

export default function Register() {
  const countryList = COUNTRY_LIST;

  const [selectedCountryCode, setSelectedCountryCode] = useState('IN');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [pillars, setPillars] = useState([]);

  // Heritage Pillar & Filter State (Requirement 9 & 10)
  const [selectedPillarId, setSelectedPillarId] = useState('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  const currentCountry = countryList.find((c) => c.code === selectedCountryCode) || countryList[0];

  // Cascading location options (Requirement 4)
  const availableStates = useMemo(() => getStatesForCountry(selectedCountryCode), [selectedCountryCode]);
  const availableCities = useMemo(() => getCitiesForState(selectedState), [selectedState]);

  // Pillar list with fallback to canonical default pillars
  const allPillars = useMemo(() => {
    const visible = (pillars || []).filter((p) => p.is_active !== false && Number(p.is_active) !== 0);
    return visible.length > 0 ? visible : DEFAULT_PILLARS;
  }, [pillars]);

  // Course catalog & configuration
  const [coursesCatalog, setCoursesCatalog] = useState([]);
  const [activeCoursesWithSeats, setActiveCoursesWithSeats] = useState([]);
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
  const [emailSentStatus, setEmailSentStatus] = useState(true);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendStatusMsg, setResendStatusMsg] = useState('');
  const [resendSuccess, setResendSuccess] = useState(null);
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailEligibleMsg, setEmailEligibleMsg] = useState('');
  const [emailActiveError, setEmailActiveError] = useState('');
  const [phoneChecking, setPhoneChecking] = useState(false);
  const [phoneEligibleMsg, setPhoneEligibleMsg] = useState('');
  const [phoneActiveError, setPhoneActiveError] = useState('');

  const location = useLocation();

  // Load live pricing configuration, active courses, and pillars from backend (Requirement 2 & 3)
  useEffect(() => {
    let isMounted = true;
    const loadConfig = async () => {
      try {
        const [liveCatalogRes, liveCoursesRes, livePillarsRes] = await Promise.allSettled([
          fetchPricingConfig(),
          fetchActiveCourses(),
          fetchPillars(),
        ]);

        let baseCatalog = [];
        if (liveCatalogRes.status === 'fulfilled' && liveCatalogRes.value && liveCatalogRes.value.length > 0) {
          baseCatalog = liveCatalogRes.value;
        }

        let allActive = [];
        if (liveCoursesRes.status === 'fulfilled' && liveCoursesRes.value && liveCoursesRes.value.length > 0) {
          allActive = [...liveCoursesRes.value];
        }

        if (isMounted) {
          const livePillars = (livePillarsRes.status === 'fulfilled' && livePillarsRes.value && livePillarsRes.value.length > 0)
            ? livePillarsRes.value
            : DEFAULT_PILLARS;
          if (livePillarsRes.status === 'fulfilled' && livePillarsRes.value && livePillarsRes.value.length > 0) {
            setPillars(livePillarsRes.value);
          }
          setActiveCoursesWithSeats(allActive);
          const unified = buildUnifiedCatalog(baseCatalog, allActive, livePillars);
          setCoursesCatalog(unified);
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

  // Pre-select course, duration & pillar based on URL parameters (?course=...&duration=...&pillar=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const courseParam = params.get('course') || params.get('skill') || params.get('program');
    const durationParam = params.get('duration') || params.get('days');
    const pillarParam = params.get('pillar');

    if (pillarParam) {
      setSelectedPillarId(pillarParam);
    }

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

        // Auto-align pillar selection to this matched course if pillar not explicitly provided in URL
        if (!pillarParam) {
          const autoPillar = resolveCoursePillarId(matched, activeCoursesWithSeats, allPillars);
          if (autoPillar) {
            setSelectedPillarId(String(autoPillar));
          }
        }

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
  }, [location.search, coursesCatalog.length, activeCoursesWithSeats, allPillars]);

  // Dynamic filtered courses based on selected Pillar and Program Category
  const filteredCourses = useMemo(() => {
    return coursesCatalog.filter((c) => {
      // 1. Strict Pillar filter: only courses belonging to the selected pillar OR common to all pillars
      if (selectedPillarId !== 'all') {
        const isCommon = isCommonPillarOffering(c, activeCoursesWithSeats);
        if (!isCommon) {
          const cPillarId = resolveCoursePillarId(c, activeCoursesWithSeats, allPillars);
          if (cPillarId !== 'all' && String(cPillarId) !== String(selectedPillarId)) {
            return false;
          }
        }
      }
      // 2. Category filter
      if (selectedCategoryFilter !== 'all') {
        const isJourney = isJourneyOffering(c);
        if (selectedCategoryFilter === 'Workshop' && isJourney) {
          return false;
        }
        if (selectedCategoryFilter === 'Learning Journey' && !isJourney) {
          return false;
        }
      }
      return true;
    });
  }, [coursesCatalog, activeCoursesWithSeats, allPillars, selectedPillarId, selectedCategoryFilter]);

  // Derive selected course object
  const currentCourse = useMemo(() => {
    if (!selectedCourseName) return null;
    return coursesCatalog.find((c) => c.courseName === selectedCourseName) || null;
  }, [selectedCourseName, coursesCatalog]);

  // Currently active Pillar details
  const currentPillar = useMemo(() => {
    if (selectedPillarId !== 'all') {
      return (
        allPillars.find(
          (p) => String(p.id) === String(selectedPillarId) || String(p.number) === String(selectedPillarId)
        ) || null
      );
    }
    if (currentCourse) {
      const pId = resolveCoursePillarId(currentCourse, activeCoursesWithSeats, allPillars);
      if (pId) {
        return (
          allPillars.find((p) => String(p.id) === String(pId) || String(p.number) === String(pId)) || null
        );
      }
    }
    return null;
  }, [selectedPillarId, currentCourse, allPillars, activeCoursesWithSeats]);

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

  // Derive live seat metrics & availability status for selected course (Requirement 7)
  const selectedCourseSeatInfo = useMemo(() => {
    if (!selectedCourseName) return null;
    const lower = selectedCourseName.toLowerCase().trim();
    const found = activeCoursesWithSeats.find((c) => {
      const titleLower = String(c.title || '').toLowerCase().trim();
      return titleLower.includes(lower) || lower.includes(titleLower);
    });
    if (!found) return null;
    const total = Number(found.seats_total || 50);
    const available = found.seats_available !== undefined ? Number(found.seats_available) : 20;
    const status = found.availability_status || (available === 0 ? 'Full' : available <= 5 ? 'Almost Full' : 'Available');
    return {
      seats_total: total,
      seats_available: available,
      availability_status: status,
    };
  }, [selectedCourseName, activeCoursesWithSeats]);

  const isSelectedCourseFull = selectedCourseSeatInfo?.seats_available === 0;

  // Handle Pillar Selection change
  const handlePillarChange = (e) => {
    const newPillarId = e.target.value;
    setSelectedPillarId(newPillarId);

    // Compute the courses that belong to the newly selected pillar
    const matchingCourses = coursesCatalog.filter((c) => {
      if (newPillarId === 'all') return true;
      const isCommon = isCommonPillarOffering(c, activeCoursesWithSeats);
      if (isCommon) return true;
      const pId = resolveCoursePillarId(c, activeCoursesWithSeats, allPillars);
      return pId === 'all' || String(pId) === String(newPillarId);
    });

    // Check if the current course belongs to the new pillar
    const isCurrentInNew = matchingCourses.some(
      (c) => c.courseName === selectedCourseName
    );

    if (!isCurrentInNew) {
      if (matchingCourses.length > 0) {
        setSelectedCourseName(matchingCourses[0].courseName);
        setSelectedDuration(matchingCourses[0].durations[0]?.duration || '');
      } else {
        setSelectedCourseName('');
        setSelectedDuration('');
      }
      if (touched.courseName) {
        setErrors((prev) => ({
          ...prev,
          courseName: '',
          courseDuration: '',
        }));
      }
    }
  };

  const handleCategoryFilterChange = (cat) => {
    setSelectedCategoryFilter(cat);
  };

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

  const handleDurationSelect = (durationStr) => {
    setSelectedDuration(durationStr);
    if (touched.courseDuration) {
      setErrors((prev) => ({
        ...prev,
        courseDuration: durationStr ? '' : 'Please select Course Duration',
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
        } else if (emailActiveError) {
          error = emailActiveError;
        }
        break;

      case 'phone':
        // No validation on phone number
        break;

      case 'city':
        if (selectedCity === 'Other' && (!customCity || customCity.trim().length < 2)) {
          error = 'Please enter your city / town name (at least 2 letters)';
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
      if (key !== 'location') {
        newTouched[key] = true;
        const fieldError = validateField(key, formData[key]);
        if (fieldError) newErrors[key] = fieldError;
      }
    });

    // Validate cascading location
    if (!selectedState) {
      newErrors.state = 'Please select your State';
      newTouched.state = true;
    }
    if (!selectedCity) {
      newErrors.city = 'Please select your City';
      newTouched.city = true;
    } else if (selectedCity === 'Other' && (!customCity || customCity.trim().length < 2)) {
      newErrors.city = 'Please enter your city / town name';
      newTouched.city = true;
    }

    // Validate course selection & duration
    newTouched.courseName = true;
    const courseError = validateField('courseName', selectedCourseName);
    if (courseError) {
      newErrors.courseName = courseError;
    } else if (isSelectedCourseFull) {
      newErrors.courseName = 'This program is currently fully booked (0 available seats). Please select an alternate program.';
    }

    newTouched.courseDuration = true;
    const durationError = validateField('courseDuration', selectedDuration);
    if (durationError) newErrors.courseDuration = durationError;

    setTouched(newTouched);
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Field display order for single-error validation display
  const fieldOrder = useMemo(() => [
    'fullName',
    'email',
    'phone',
    'state',
    'city',
    'courseName',
    'courseDuration',
    'profession',
    'experienceLevel',
    'learningPurpose',
  ], []);

  // Compute strictly the FIRST invalid touched field so only 1 error shows at a time
  const firstErrorField = useMemo(() => {
    for (const field of fieldOrder) {
      if (touched[field] && errors[field]) {
        return field;
      }
    }
    return null;
  }, [fieldOrder, touched, errors]);

  // Check whether form is fully valid for live button state
  const isFormValid = useMemo(() => {
    const hasName = formData.fullName.trim().length >= 2;
    const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
    const hasPhone = Boolean((formData.phone || '').trim());
    const effectiveCity = selectedCity === 'Other' ? customCity.trim() : selectedCity;
    const hasLocation = Boolean(selectedState) && Boolean(effectiveCity) && (selectedCity !== 'Other' || effectiveCity.length >= 2);
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
      hasPurpose &&
      !isSelectedCourseFull
    );
  }, [formData, currentCountry.digits, selectedCountryCode, selectedState, selectedCity, customCity, selectedCourseName, selectedDuration, isSelectedCourseFull]);

  // Input change with strict type sanitization
  const handleChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;

    if (name === 'fullName' || name === 'profession') {
      value = value.replace(/[0-9]/g, '');
    } else if (name === 'phone') {
      value = value.replace(/[^\d+\s-]/g, '');
      if (phoneActiveError) setPhoneActiveError('');
      if (phoneEligibleMsg) setPhoneEligibleMsg('');
    } else if (name === 'email') {
      value = value.replace(/\s/g, '');
      if (emailActiveError) setEmailActiveError('');
      if (emailEligibleMsg) setEmailEligibleMsg('');
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }

    if (errorMessage) setErrorMessage('');
  };

  // Real-time Email Verification Handler
  const verifyEmail = async (emailToVerify) => {
    const trimmed = (emailToVerify || '').trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailEligibleMsg('');
      setEmailActiveError('');
      return;
    }
    setEmailChecking(true);
    try {
      const res = await checkEmailEligibility(trimmed, selectedCourseName);
      if (res && res.success) {
        if (!res.eligible) {
          // Immediately set validation check error at that time
          setEmailActiveError(res.message);
          setErrors((prev) => ({
            ...prev,
            email: res.message,
          }));
          setFirstErrorField('email');
          setEmailEligibleMsg('');
        } else {
          setEmailActiveError('');
          setErrors((prev) => {
            const next = { ...prev };
            if (next.email && (next.email.includes('active course') || next.email.includes('already registered'))) {
              delete next.email;
            }
            return next;
          });
          if (firstErrorField === 'email' && emailActiveError) {
            setFirstErrorField('');
          }
          if (res.registered && !res.hasActiveCourse) {
            setEmailEligibleMsg('✓ Previous course completed — Eligible to enroll in a new course!');
          } else {
            setEmailEligibleMsg('✓ Email is eligible for registration.');
          }
        }
      }
    } catch (_) {
    } finally {
      setEmailChecking(false);
    }
  };

  // Real-time Phone Verification Handler
  const verifyPhone = async (phoneToVerify) => {
    const cleanPhone = (phoneToVerify || '').replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== currentCountry.digits) {
      setPhoneEligibleMsg('');
      setPhoneActiveError('');
      return;
    }
    setPhoneChecking(true);
    try {
      const res = await checkRegistrationEligibility({ phone: cleanPhone, courseName: selectedCourseName });
      if (res && res.success) {
        if (!res.eligible) {
          // Immediately set validation check error for phone
          setPhoneActiveError(res.message);
          setErrors((prev) => ({
            ...prev,
            phone: res.message,
          }));
          setFirstErrorField('phone');
          setPhoneEligibleMsg('');
        } else {
          setPhoneActiveError('');
          setErrors((prev) => {
            const next = { ...prev };
            if (next.phone && (next.phone.includes('active course') || next.phone.includes('already registered'))) {
              delete next.phone;
            }
            return next;
          });
          if (firstErrorField === 'phone' && phoneActiveError) {
            setFirstErrorField('');
          }
          if (res.registered && !res.hasActiveCourse) {
            setPhoneEligibleMsg('✓ Previous course completed — Eligible to enroll in a new course!');
          } else {
            setPhoneEligibleMsg('✓ Phone number is eligible for registration.');
          }
        }
      }
    } catch (_) {
    } finally {
      setPhoneChecking(false);
    }
  };

  // Requirement 4: Cascading location handlers
  const handleCountryChange = (e) => {
    const newCode = e.target.value;
    const targetCountry = countryList.find((c) => c.code === newCode) || countryList[0];
    setSelectedCountryCode(newCode);

    setSelectedState('');
    setSelectedCity('');
    setCustomCity('');

    const currentDigits = (formData.phone || '').replace(/\D/g, '');
    const trimmedPhone = currentDigits.slice(0, targetCountry.digits);

    setFormData((prev) => ({ ...prev, phone: trimmedPhone }));

    if (touched.phone) {
      const error = validateField('phone', trimmedPhone, targetCountry);
      setErrors((prev) => ({ ...prev, phone: error }));
    }
  };

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    setSelectedCity('');
    setCustomCity('');
  };

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    setSelectedCity(newCity);
    if (newCity !== 'Other') {
      setCustomCity('');
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
    if (name === 'email') {
      verifyEmail(value);
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSelectedCourseFull) {
      setErrorMessage(`We apologize, but '${selectedCourseName}' has reached maximum student capacity (0 seats available). Registration is currently closed.`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (emailActiveError) {
      setFirstErrorField('email');
      setErrors((prev) => ({ ...prev, email: emailActiveError }));
      setErrorMessage(emailActiveError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Phone validation bypassed

    if (!validateForm()) {
      setErrorMessage('Please complete all required fields correctly before proceeding.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const effectiveCity = selectedCity === 'Other' ? (customCity.trim() || 'Other') : selectedCity;
    const currentFullLocation = [effectiveCity, selectedState, currentCountry.name].filter(Boolean).join(', ');

    const submissionPayload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      country: currentCountry.name,
      countryCode: currentCountry.code,
      countryDial: currentCountry.dial,
      fullPhone: `${currentCountry.dial} ${formData.phone.trim()}`,
      location: currentFullLocation,
      state: selectedState,
      city: effectiveCity,
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
      setEmailSentStatus(result.emailSent !== false);
      setResendStatusMsg('');
      setResendSuccess(null);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (resendingEmail) return;
    setResendingEmail(true);
    setResendStatusMsg('');
    setResendSuccess(null);

    try {
      const email = registeredData?.email || formData.email;
      const applicationRef = registeredData?.applicationRef;
      const res = await resendConfirmationEmail({ email, applicationRef });
      setResendSuccess(true);
      setEmailSentStatus(true);
      setResendStatusMsg(res.message || 'A confirmation email has been dispatched to your registered address.');
    } catch (err) {
      setResendSuccess(false);
      setResendStatusMsg(err.message || 'Unable to resend confirmation email. Please check your email address or try again shortly.');
    } finally {
      setResendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F2E8] text-[#241A16] py-6 sm:py-10 px-4 relative overflow-hidden flex flex-col justify-center">
      {/* Full overlay loader when submitting registration */}
      {loading && (
        <GniLoader overlay size="lg" text="Submitting Application to Global Nagas Institute..." />
      )}

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
                {/* Email Delivery Status Banner */}
                {!emailSentStatus ? (
                  <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50/95 border border-amber-300 text-left space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div className="space-y-1 text-xs font-['DM_Sans']">
                        <p className="font-semibold text-amber-950 leading-snug">
                          Your registration was successful, but we could not send the confirmation email. Please check your email address or request another confirmation email.
                        </p>
                        <p className="text-amber-800 text-[11px]">
                          Target Email: <strong className="text-amber-950">{registeredData?.email}</strong>
                        </p>
                      </div>
                    </div>
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleResendConfirmation}
                        disabled={resendingEmail}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4A2C20] hover:bg-[#6B4030] text-[#F7F2E8] font-['DM_Sans'] text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50"
                      >
                        {resendingEmail ? (
                          <>
                            <GniLoader size="xs" />
                            <span>Sending Confirmation Email...</span>
                          </>
                        ) : (
                          <>
                            <Mail className="w-3.5 h-3.5" />
                            <span>Resend Confirmation Email</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 sm:p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-['DM_Sans']">
                    <div className="flex items-center gap-2 text-emerald-900">
                      <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>
                        Confirmation email dispatched to <strong>{registeredData?.email}</strong>.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleResendConfirmation}
                      disabled={resendingEmail}
                      className="text-[11px] font-semibold text-[#6B4030] hover:text-[#4A2C20] underline cursor-pointer text-left sm:text-right"
                    >
                      {resendingEmail ? 'Sending...' : "Didn't receive? Resend"}
                    </button>
                  </div>
                )}

                {/* Resend Status Feedback Banner */}
                {resendStatusMsg && (
                  <div
                    className={`p-3 rounded-lg text-xs font-['DM_Sans'] text-left flex items-center gap-2 ${
                      resendSuccess
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'bg-red-50 text-red-900 border border-red-200'
                    }`}
                  >
                    {resendSuccess ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                    <span>{resendStatusMsg}</span>
                  </div>
                )}

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
                    <span className="font-bold text-[#B89555] text-right break-words max-w-[180px] sm:max-w-[260px] leading-snug [overflow-wrap:anywhere]">
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

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* -------------------------------------------------------------
                  STEP 1: CANDIDATE CONTACT DETAILS (Requirement 5)
                  ------------------------------------------------------------- */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F0] border border-[#6B4030]/15 space-y-3.5">
                <div className="flex items-center justify-between border-b border-[#6B4030]/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#4A2C20] text-[#B89555] text-xs font-bold flex items-center justify-center font-number">
                      1
                    </span>
                    <h3 className="font-['Cormorant_Garamond'] text-base sm:text-lg font-bold text-[#4A2C20]">
                      Candidate Details
                    </h3>
                  </div>
                </div>

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
                        firstErrorField === 'fullName'
                          ? 'border-red-500 bg-red-50/10 focus:border-red-600 focus:ring-1 focus:ring-red-500/20'
                          : touched.fullName && !errors.fullName && formData.fullName
                          ? 'border-emerald-500/60 bg-white focus:border-[#B89555]'
                          : 'border-[#6B4030]/20 bg-white focus:bg-white focus:border-[#B89555]'
                      }`}
                    />
                  </div>
                  {firstErrorField === 'fullName' && errors.fullName && (
                    <p className="text-[11px] font-['DM_Sans'] text-red-600 flex items-center gap-1 pt-0.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.fullName}</span>
                    </p>
                  )}
                </div>

                {/* 2. Email Address with Real-time Registration Check */}
                <div className="space-y-1 text-left">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    {emailChecking && (
                      <span className="text-[10.5px] text-[#B89555] font-['DM_Sans'] flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin text-[#B89555]" />
                        <span>Checking email status...</span>
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#6B4030] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. kavinraj@example.com"
                      className={`w-full pl-10 pr-9 py-2.5 rounded-xl border text-sm text-[#241A16] transition-colors focus:outline-hidden ${
                        (firstErrorField === 'email' || errors.email)
                          ? 'border-red-500 bg-red-50/10 focus:border-red-600 focus:ring-1 focus:ring-red-500/20'
                          : emailEligibleMsg
                          ? 'border-emerald-500 bg-emerald-50/15 focus:border-[#B89555]'
                          : touched.email && !errors.email && formData.email
                          ? 'border-emerald-500/60 bg-white focus:border-[#B89555]'
                          : 'border-[#6B4030]/20 bg-white focus:bg-white focus:border-[#B89555]'
                      }`}
                    />
                    {emailChecking ? (
                      <div className="absolute right-3 top-3 text-[#B89555]">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    ) : (firstErrorField === 'email' || errors.email) ? (
                      <div className="absolute right-3 top-3 text-red-500">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    ) : emailEligibleMsg ? (
                      <div className="absolute right-3 top-3 text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    ) : null}
                  </div>
                  {(firstErrorField === 'email' || errors.email) && errors.email ? (
                    <p className="text-[11px] font-['DM_Sans'] text-red-600 flex items-start gap-1 pt-0.5 leading-snug">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-600" />
                      <span>{errors.email}</span>
                    </p>
                  ) : emailEligibleMsg ? (
                    <p className="text-[11px] font-['DM_Sans'] text-emerald-700 flex items-center gap-1 pt-0.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                      <span>{emailEligibleMsg}</span>
                    </p>
                  ) : null}
                </div>

                {/* 3. Phone / WhatsApp Number with Real-time Registration Check */}
                <div className="space-y-1 text-left">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                      Mobile / WhatsApp Number <span className="text-red-600">*</span>
                    </label>
                  </div>

                  <div
                    className="flex items-stretch rounded-xl border border-[#6B4030]/20 transition-colors bg-white focus-within:border-[#B89555] relative"
                  >
                    {/* Clean Country Selector (Clean Dial Code & Country Name - NO flag letter / NO pre-font) */}
                    <div className="relative border-r border-[#6B4030]/20 shrink-0 flex items-center bg-[#FAF7F0] rounded-l-xl w-[76px] sm:w-[90px]">
                      <select
                        aria-label="Country Code"
                        value={selectedCountryCode}
                        onChange={handleCountryChange}
                        className="w-full h-full pl-3 pr-6 py-2.5 bg-transparent text-xs font-['DM_Sans'] text-[#241A16] font-semibold focus:outline-hidden cursor-pointer appearance-none whitespace-nowrap"
                      >
                        {countryList.map((c) => (
                          <option key={c.code} value={c.code} className="bg-white text-[#241A16]">
                            {c.dial} ({c.code})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[#6B4030] absolute right-2 pointer-events-none" />
                    </div>

                    <input
                      type="tel"
                      inputMode="numeric"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onKeyDown={handleNumberOnlyKeyDown}
                      onBlur={handleBlur}
                      placeholder="Phone / WhatsApp number"
                      className="flex-1 w-full pl-3.5 pr-4 py-2.5 bg-transparent text-sm font-['DM_Sans'] text-[#241A16] font-medium placeholder-[#6B4030]/40 focus:outline-hidden"
                    />
                  </div>

                  
                </div>
              </div>

              {/* -------------------------------------------------------------
                  STEP 2: LOCATION DETAILS (Requirement 4: Country, State & City Dropdowns)
                  ------------------------------------------------------------- */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F0] border border-[#6B4030]/15 space-y-3.5">
                <div className="flex items-center justify-between border-b border-[#6B4030]/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#4A2C20] text-[#B89555] text-xs font-bold flex items-center justify-center font-number">
                      2
                    </span>
                    <h3 className="font-['Cormorant_Garamond'] text-base sm:text-lg font-bold text-[#4A2C20]">
                      Location &amp; Address
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                  {/* 1. Country Dropdown (Clean Country Name - No Flag/Code Prefix) */}
                  <div className="space-y-1">
                    <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                      Country <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <select
                        aria-label="Country"
                        value={selectedCountryCode}
                        onChange={handleCountryChange}
                        className="w-full pl-3 pr-7 py-2.5 rounded-xl border border-[#6B4030]/20 bg-white text-xs font-semibold text-[#241A16] cursor-pointer appearance-none focus:outline-hidden focus:border-[#B89555]"
                      >
                        {countryList.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[#6B4030] absolute right-2.5 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* 2. State Dropdown (Cascading based on Country - Unfilled Default) */}
                  <div className="space-y-1">
                    <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                      State / Province <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <select
                        aria-label="State or Province"
                        value={selectedState}
                        onChange={handleStateChange}
                        className={`w-full pl-3 pr-7 py-2.5 rounded-xl border bg-white text-xs font-semibold text-[#241A16] cursor-pointer appearance-none focus:outline-hidden ${
                          firstErrorField === 'state'
                            ? 'border-red-500 bg-red-50/10 focus:border-red-600 focus:ring-1 focus:ring-red-500/20'
                            : 'border-[#6B4030]/20 focus:border-[#B89555]'
                        }`}
                      >
                        <option value="">Select State</option>
                        {availableStates.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[#6B4030] absolute right-2.5 top-3 pointer-events-none" />
                    </div>
                    {firstErrorField === 'state' && errors.state && (
                      <p className="text-[11px] font-['DM_Sans'] text-red-600 flex items-center gap-1 pt-0.5">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.state}</span>
                      </p>
                    )}
                  </div>

                  {/* 3. City Dropdown (Cascading based on State - Unfilled Default) */}
                  <div className="space-y-1">
                    <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                      City / District <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <select
                        aria-label="City or District"
                        value={selectedCity}
                        onChange={handleCityChange}
                        className={`w-full pl-3 pr-7 py-2.5 rounded-xl border bg-white text-xs font-semibold text-[#241A16] cursor-pointer appearance-none focus:outline-hidden ${
                          firstErrorField === 'city'
                            ? 'border-red-500 bg-red-50/10 focus:border-red-600 focus:ring-1 focus:ring-red-500/20'
                            : 'border-[#6B4030]/20 focus:border-[#B89555]'
                        }`}
                      >
                        <option value="">Select City</option>
                        {availableCities.map((ct) => (
                          <option key={ct} value={ct}>
                            {ct}
                          </option>
                        ))}
                        <option value="Other">Other (Type City)</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[#6B4030] absolute right-2.5 top-3 pointer-events-none" />
                    </div>
                    {firstErrorField === 'city' && errors.city && selectedCity !== 'Other' && (
                      <p className="text-[11px] font-['DM_Sans'] text-red-600 flex items-center gap-1 pt-0.5">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.city}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Custom City Text Input when "Other" is chosen */}
                {selectedCity === 'Other' && (
                  <div className="space-y-1 text-left pt-1">
                    <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                      Enter Your City / Town Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={customCity}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[0-9]/g, '');
                        setCustomCity(val);
                        if (errors.city && val.trim().length >= 2) {
                          setErrors((prev) => ({ ...prev, city: '' }));
                        }
                      }}
                      onKeyDown={handleTextOnlyKeyDown}
                      placeholder="e.g. Pollachi, Karaikudi, Salem"
                      className={`w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm text-[#241A16] focus:outline-hidden ${
                        firstErrorField === 'city'
                          ? 'border-red-500 bg-red-50/10 focus:border-red-600'
                          : 'border-[#6B4030]/25 focus:border-[#B89555]'
                      }`}
                    />
                    {firstErrorField === 'city' && errors.city && (
                      <p className="text-[11px] font-['DM_Sans'] text-red-600 flex items-center gap-1 pt-0.5">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.city}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Location Selection Confirmation Pill (Shown only when selected) */}
                {selectedState && (selectedCity || customCity) && (
                  <div className="p-2 rounded-xl bg-white border border-[#6B4030]/15 flex items-center gap-2 text-xs font-['DM_Sans'] text-[#4A2C20]">
                    <MapPin className="w-3.5 h-3.5 text-[#B89555] shrink-0" />
                    <span>
                      Selected Location:{' '}
                      <strong>
                        {selectedCity === 'Other' ? (customCity || 'Custom City') : selectedCity},{' '}
                        {selectedState}, {currentCountry.name}
                      </strong>
                    </span>
                  </div>
                )}
              </div>

              {/* -------------------------------------------------------------
                  STEP 3: HERITAGE PROGRAM & DURATION (List Boxes Only)
                  ------------------------------------------------------------- */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F0] border border-[#6B4030]/15 space-y-3.5">
                <div className="flex items-center justify-between border-b border-[#6B4030]/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#4A2C20] text-[#B89555] text-xs font-bold flex items-center justify-center font-number">
                      3
                    </span>
                    <h3 className="font-['Cormorant_Garamond'] text-base sm:text-lg font-bold text-[#4A2C20]">
                      Heritage Program &amp; Duration
                    </h3>
                  </div>
                </div>

                {/* 1. Heritage Skill Pillar List Box */}
                <div className="space-y-1 text-left">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                      Heritage Skill Pillar
                    </label>
                    {selectedPillarId !== 'all' && (
                      <button
                        type="button"
                        onClick={() => setSelectedPillarId('all')}
                        className="text-[10.5px] font-['DM_Sans'] text-[#B89555] hover:text-[#4A2C20] underline cursor-pointer"
                      >
                        Show All Pillars
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Landmark className="w-4 h-4 text-[#6B4030] absolute left-3.5 top-3.5 pointer-events-none" />
                    <select
                      aria-label="Heritage Skill Pillar"
                      value={selectedPillarId}
                      onChange={handlePillarChange}
                      className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[#6B4030]/20 bg-white text-xs font-semibold text-[#241A16] cursor-pointer appearance-none focus:outline-hidden focus:border-[#B89555]"
                    >
                      <option value="all">All Heritage Pillars</option>
                      {allPillars.map((p, pIdx) => (
                        <option key={p.id} value={p.id}>
                          Pillar {pIdx + 1}: {p.title}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#6B4030] absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* 2. Course / Program Name List Box */}
                <div className="space-y-1 text-left">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                      Course / Program Name <span className="text-red-600">*</span>
                    </label>
                    {selectedCourseSeatInfo && (
                      <span className={`text-[10px] font-['DM_Sans'] font-semibold px-2 py-0.5 rounded-full ${
                        selectedCourseSeatInfo.seats_available === 0
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : selectedCourseSeatInfo.seats_available <= 5
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {selectedCourseSeatInfo.seats_available === 0
                          ? '0 Seats Available (Full)'
                          : `${selectedCourseSeatInfo.seats_available} Seats Open`}
                      </span>
                    )}
                  </div>
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
                        firstErrorField === 'courseName' || isSelectedCourseFull
                          ? 'border-red-500 bg-red-50/10 focus:border-red-600 focus:ring-1 focus:ring-red-500/20'
                          : selectedCourseName
                          ? 'border-[#B89555] bg-white'
                          : 'border-[#6B4030]/20 bg-white focus:bg-white focus:border-[#B89555]'
                      }`}
                    >
                      <option value="">— Select Heritage Program —</option>
                      {filteredCourses.length === 0 ? (
                        <option value="" disabled>No programs available in this pillar</option>
                      ) : (
                        filteredCourses.map((c) => {
                          const seat = activeCoursesWithSeats.find((ac) => {
                            const t = String(ac.title || '').toLowerCase().trim();
                            const cn = String(c.courseName || '').toLowerCase().trim();
                            return t.includes(cn) || cn.includes(t);
                          });
                          const isCourseFull = seat && seat.seats_available === 0;
                          const isJourney = isJourneyOffering(c) || (seat && isJourneyOffering(seat));
                          const shortType = isJourney ? 'Journey' : 'Workshop';

                          return (
                            <option key={c.id || c.courseName} value={c.courseName}>
                              [{shortType}] {c.courseName}{isCourseFull ? ' (Full)' : ''}
                            </option>
                          );
                        })
                      )}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#6B4030] absolute right-3 top-3.5 pointer-events-none" />
                  </div>

                  {firstErrorField === 'courseName' && errors.courseName && (
                    <p className="text-[11px] font-['DM_Sans'] text-red-600 flex items-center gap-1 pt-0.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.courseName}</span>
                    </p>
                  )}
                </div>

                {/* 3. Course Duration List Box */}
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
                          firstErrorField === 'courseDuration'
                            ? 'border-red-500 bg-red-50/10 focus:border-red-600 focus:ring-1 focus:ring-red-500/20'
                            : selectedDuration
                            ? 'border-[#B89555] bg-white'
                            : 'border-[#6B4030]/20 bg-white focus:bg-white focus:border-[#B89555]'
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
                    <div className="p-2.5 rounded-xl border border-dashed border-[#6B4030]/25 bg-white text-xs text-[#6B4030] flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#B89555] shrink-0" />
                      <span>Please select a Course / Program Name above to view available durations.</span>
                    </div>
                  )}

                  {firstErrorField === 'courseDuration' && errors.courseDuration && (
                    <p className="text-[11px] font-['DM_Sans'] text-red-600 flex items-center gap-1 pt-0.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.courseDuration}</span>
                    </p>
                  )}
                </div>

                {/* 4. Course Fee (Official Approved Fee • Read-Only) */}
                <div className="space-y-1 text-left">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Course Fee <span className="text-[10px] text-[#6B4030]">(Official Approved Fee • Read-Only)</span>
                  </label>
                  <div className="relative cursor-default select-none">
                    <Receipt className="w-4 h-4 text-[#6B4030] absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      readOnly
                      tabIndex={-1}
                      onFocus={(e) => e.target.blur()}
                      aria-readonly="true"
                      value={
                        selectedCourseName && selectedDuration && currentFeeDetails
                          ? `${currentFeeDetails.formattedFee} (${selectedCourseName} • ${selectedDuration})`
                          : ''
                      }
                      placeholder="Choose course & duration"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#6B4030]/20 bg-[#FAF7F0]/80 text-xs sm:text-sm font-semibold text-[#4A2C20] placeholder-[#6B4030]/50 cursor-default select-none caret-transparent pointer-events-none focus:outline-hidden focus:ring-0 truncate"
                    />
                  </div>
                </div>
              </div>

              {/* -------------------------------------------------------------
                  STEP 4: CRAFT BACKGROUND & MOTIVATION (Requirement 5)
                  ------------------------------------------------------------- */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F0] border border-[#6B4030]/15 space-y-3.5">
                <div className="flex items-center justify-between border-b border-[#6B4030]/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#4A2C20] text-[#B89555] text-xs font-bold flex items-center justify-center font-number">
                      4
                    </span>
                    <h3 className="font-['Cormorant_Garamond'] text-base sm:text-lg font-bold text-[#4A2C20]">
                      Craft Background &amp; Motivation
                    </h3>
                  </div>
                </div>

                {/* 1. Current Profession / Background */}
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
                      placeholder="e.g. Architect, textile artist"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-[#241A16] transition-colors focus:outline-hidden ${
                        firstErrorField === 'profession'
                          ? 'border-red-500 bg-red-50/10 focus:border-red-600 focus:ring-1 focus:ring-red-500/20'
                          : touched.profession && !errors.profession && formData.profession
                          ? 'border-emerald-500/60 bg-white focus:border-[#B89555]'
                          : 'border-[#6B4030]/20 bg-white focus:bg-white focus:border-[#B89555]'
                      }`}
                    />
                  </div>
                  {firstErrorField === 'profession' && errors.profession && (
                    <p className="text-[11px] font-['DM_Sans'] text-red-600 flex items-center gap-1 pt-0.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.profession}</span>
                    </p>
                  )}
                </div>

                {/* 2. Prior Experience Level */}
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Prior Experience Level <span className="text-red-600">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                    {experienceOptions.map((lvl) => (
                      <label
                        key={lvl}
                        className={`flex items-center justify-center p-2 sm:p-2.5 rounded-xl border text-[11px] sm:text-xs font-['DM_Sans'] font-medium cursor-pointer transition-all ${
                          formData.experienceLevel === lvl
                            ? 'bg-[#4A2C20] text-[#F7F2E8] border-[#4A2C20] shadow-xs'
                            : 'bg-white text-[#241A16] border-[#6B4030]/20 hover:border-[#B89555]'
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
                  {firstErrorField === 'experienceLevel' && errors.experienceLevel && (
                    <p className="text-[11px] font-['DM_Sans'] text-red-600 flex items-center gap-1 pt-0.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.experienceLevel}</span>
                    </p>
                  )}
                </div>

                {/* 3. Why do you want to learn heritage skills? */}
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
                        firstErrorField === 'learningPurpose'
                          ? 'border-red-500 bg-red-50/10 focus:border-red-600 focus:ring-1 focus:ring-red-500/20'
                          : touched.learningPurpose && !errors.learningPurpose && formData.learningPurpose
                          ? 'border-emerald-500/60 bg-white focus:border-[#B89555]'
                          : 'border-[#6B4030]/20 bg-white focus:bg-white focus:border-[#B89555]'
                      }`}
                    />
                  </div>
                  {firstErrorField === 'learningPurpose' && errors.learningPurpose && (
                    <p className="text-[11px] font-['DM_Sans'] text-red-600 flex items-center gap-1 pt-0.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.learningPurpose}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Submit & Proceed Button (Disabled until course, duration, and details are valid, or if cohort is full) */}
              <div className="pt-2 sm:pt-3">
                <button
                  type="submit"
                  disabled={loading || !isFormValid || isSelectedCourseFull}
                  className={`w-full py-3.5 sm:py-4 rounded-xl font-['DM_Sans'] text-xs sm:text-sm font-semibold transition-all duration-200 border flex items-center justify-center gap-2 ${
                    isFormValid && !loading && !isSelectedCourseFull
                      ? 'bg-[#B89555] hover:bg-[#c8a565] text-[#241A16] border-[#B89555] shadow-sm cursor-pointer'
                      : 'bg-[#6B4030]/20 text-[#6B4030]/60 border-transparent cursor-not-allowed opacity-75'
                  }`}
                >
                  {loading ? (
                    <>
                      <GniLoader size="xs" />
                      <span>Validating &amp; Submitting Application...</span>
                    </>
                  ) : isSelectedCourseFull ? (
                    <span>Cohort Full (0 Available Seats) • Closed</span>
                  ) : !selectedCourseName || !selectedDuration ? (
                    <span>Select Course & Duration to Proceed</span>
                  ) : (
                    <span>
                      Submit Application • {currentFeeDetails?.formattedTotal || 'Payable Fee'}
                    </span>
                  )}
                </button>
                {isSelectedCourseFull ? (
                  <p className="text-center text-[10.5px] font-['DM_Sans'] text-red-600 font-semibold pt-1.5">
                    This cohort is at maximum student capacity. Please choose another program from the list above.
                  </p>
                ) : !isFormValid ? (
                  <p className="text-center text-[10.5px] font-['DM_Sans'] text-[#6B4030] pt-1.5">
                    Please fill all required fields, select a course, and pick a duration to activate submission.
                  </p>
                ) : null}
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
        <div className="inline-flex items-start sm:items-center justify-center gap-2 text-[#4A2C20] font-medium bg-white/80 px-4 py-2 sm:py-1.5 rounded-2xl sm:rounded-full border border-[#6B4030]/15 shadow-2xs max-w-full text-left sm:text-center text-[11px] sm:text-xs leading-relaxed">
          <MapPin className="w-3.5 h-3.5 mt-0.5 sm:mt-0 text-[#B89555] shrink-0" />
          <span className="sm:whitespace-nowrap">
            Campus Address: No.156, 2nd floor, Uppara street, Raja street corner, Coimbatore 641001
          </span>
        </div>
      </div>
    </div>
  );
}
