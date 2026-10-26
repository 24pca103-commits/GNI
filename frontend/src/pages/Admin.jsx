import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  Users,
  BookOpen,
  DollarSign,
  Tag,
  Clock,
  Layers,
  Flame,
  X,
  Loader2,
  ArrowLeft,
  Lock,
  LogOut,
  RefreshCw,
  Download,
  Filter,
  Hammer,
  Compass,
  Calendar,
  UploadCloud,
  Image as ImageIcon,
  Menu,
  Eye,
  EyeOff,
  Award,
} from 'lucide-react';
import {
  fetchAllCourses,
  createCourse,
  updateCourse,
  toggleCourseStatus,
  deleteCourse,
  fetchAdminRegistrations,
  fetchAdminStats,
  adminLogin,
  uploadOfferingImage,
} from '../services/api';

// Initial preset studio images for quick selection
const PRESET_IMAGES = [
  { label: 'Tamil Art Workshop', url: '/artisan/workshop.jpg' },
  { label: 'Lost-Wax Metallurgy Forge', url: '/artisan/pillar-metal.jpg' },
  { label: 'Heritage Creator Journey', url: '/artisan/pedagogy-practice.jpg' },
  { label: 'Epigraphy & Tamili Scripts', url: '/artisan/pillar-epigraphy.jpg' },
  { label: 'Natural Mineral Pigments', url: '/artisan/studio-pigments.jpg' },
  { label: 'Architectural Craft Applications', url: '/artisan/pillar-applications.jpg' },
];

export function getOfferingType(item) {
  if (!item) return 'workshop';
  const cat = (item.category || '').toLowerCase();
  const title = (item.title || '').toLowerCase();
  const dur = (item.duration || '').toLowerCase();
  const dayMatch = dur.match(/(\d+)\s*day/i);
  const dayCount = dayMatch ? parseInt(dayMatch[1], 10) : null;

  // Strict check: 1–9 Days courses are Workshops
  if (dayCount !== null && dayCount <= 9) {
    return 'workshop';
  }

  // Strict check: 10+ Days (e.g. 30 Days, 60 Days) are Learning Journeys
  if (dayCount !== null && dayCount >= 10) {
    return 'journey';
  }

  // Explicit learning journeys and long-term cohorts
  if (
    cat.includes('journey') ||
    cat.includes('cohort') ||
    title.includes('60-day') ||
    title.includes('60 day') ||
    title.includes('30-day') ||
    title.includes('30 day') ||
    title.includes('creator journey') ||
    dur.includes('60') ||
    dur.includes('30')
  ) {
    return 'journey';
  }

  if (cat.includes('workshop') || title.includes('workshop')) {
    return 'workshop';
  }

  // Default fallback for short masterclasses
  return 'workshop';
}

export const DEFAULT_60_DAY_PHASES = [
  {
    period: 'Day 1–10',
    title: 'Drawing & Symbols',
    details: 'Line geometry, sacred motifs, ancient grid systems.',
    outcome: 'Master Foundational Sacred Proportions',
  },
  {
    period: 'Day 11–20',
    title: 'Tamili & Inscriptions',
    details: 'Deciphering Brahmi epigraphy, copper plate scribing.',
    outcome: 'Read and Scribe Ancestral Inscriptions',
  },
  {
    period: 'Day 21–30',
    title: 'Rock Art & Painting',
    details: 'Natural mineral pigments, prehistoric rock art techniques.',
    outcome: 'Concoct Natural Mineral Paints',
  },
  {
    period: 'Day 31–40',
    title: 'Iconography',
    details: 'Deity proportions, spiritual geometry, traditional shilpa canons.',
    outcome: 'Encode Spiritual Meaning into Sculptural Forms',
  },
  {
    period: 'Day 41–50',
    title: 'Naga Jewellery & Metal Basics',
    details: 'Brass sheet forming, repousse, sacred naga ornamental motifs.',
    outcome: 'Form Authentic Metal Repousse Motifs',
  },
  {
    period: 'Day 51–60',
    title: 'Real-World Applications + 1 Field Visit',
    details: 'Textiles, interior design, branding, pooja decor, livelihood + 1 field visit.',
    outcome: 'Produce Commercial Portfolio & Complete 1 Field Visit',
  },
];

export const DEFAULT_30_DAY_PHASES = [
  {
    period: 'Day 1–10',
    title: 'Drawing & Line Geometry',
    details: 'Foundational temple drafting, kolam mathematics, and sacred geometry.',
    outcome: 'Master Sacred Proportion Grids',
  },
  {
    period: 'Day 11–20',
    title: 'Tamili Inscriptions & Palm Leaf',
    details: 'Tamili Brahmi letterforms, stylus handling, and copper plate rubbings.',
    outcome: 'Engrave Traditional Tamili Inscriptions',
  },
  {
    period: 'Day 21–30',
    title: 'Natural Pigments & Mural Art',
    details: 'Raw rock pigment preparation, organic binders, and sample fresco tablet.',
    outcome: 'Craft Authentic Natural Mineral Mural Artwork Tablet',
  },
];

export function parsePhasesFromHighlights(highlights, courseTitle = '') {
  if (typeof highlights === 'string' && highlights.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(highlights);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p, idx) => ({
          period: p.period || `Day ${idx * 10 + 1}–${(idx + 1) * 10}`,
          title: p.title || '',
          details: p.details || p.desc || '',
          outcome: p.outcome || (p.title ? `Master ${p.title} with authentic hands-on execution.` : ''),
        }));
      }
    } catch (_) {}
  }

  const norm = String(courseTitle || '').toLowerCase();
  if (norm.includes('60-day') || norm.includes('60 day')) {
    return JSON.parse(JSON.stringify(DEFAULT_60_DAY_PHASES));
  }
  if (norm.includes('30-day') || norm.includes('30 day')) {
    return JSON.parse(JSON.stringify(DEFAULT_30_DAY_PHASES));
  }

  if (!highlights) return [];

  const parts = String(highlights)
    .split(/[;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (parts.length === 0) return [];

  return parts.map((part, idx) => {
    const match = part.match(/^(Day\s*[\d–-]+)\s*:\s*(.+)$/i);
    const title = match ? match[2] : part;
    return {
      period: match ? match[1] : `Day ${idx * 10 + 1}–${(idx + 1) * 10}`,
      title,
      details: `${title} structured studio module.`,
      outcome: `Master ${title} with authentic hands-on execution.`,
    };
  });
}

// Helper to extract numeric days from duration strings (e.g. "40 Days", "40", "40 days cohort")
function parseDurationDays(durationStr) {
  if (!durationStr) return 0;
  const match = String(durationStr).match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

// Helper to extract day range from period string (e.g. "Day 1–10", "1-10", "Day 40")
function parseDaysFromPeriod(periodStr) {
  if (!periodStr) return { start: 0, end: 0 };
  const numbers = String(periodStr).match(/\d+/g);
  if (!numbers || numbers.length === 0) return { start: 0, end: 0 };
  if (numbers.length === 1) {
    const d = parseInt(numbers[0], 10);
    return { start: d, end: d };
  }
  return {
    start: parseInt(numbers[0], 10),
    end: parseInt(numbers[1], 10),
  };
}

// Helper to count words strictly
function countWords(str) {
  if (!str) return 0;
  const matches = String(str).trim().match(/[\S]+/g);
  return matches ? matches.length : 0;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('gni_admin_token') ? true : false;
  });

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard tabs: 'courses' | 'registrations'
  const [activeTab, setActiveTab] = useState('courses');

  // Offerings sub-filter tab: 'all' | 'workshops' | 'journeys' | 'courses'
  const [offeringFilterTab, setOfferingFilterTab] = useState('all');
  const [courseSearch, setCourseSearch] = useState('');

  // Form Offering Type: 'workshop' | 'journey' | 'course'
  const [formOfferingType, setFormOfferingType] = useState('workshop');

  // Courses state
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [stats, setStats] = useState({ totalRegistrations: 0, totalCourses: 4, activeOffers: 4 });

  // Student Registrations state
  const [registrations, setRegistrations] = useState([]);
  const [regLoading, setRegLoading] = useState(false);
  const [regSearch, setRegSearch] = useState('');
  const [regSkillFilter, setRegSkillFilter] = useState('all');

  // Add/Edit Course Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Image Upload State
  const [imageUploadMode, setImageUploadMode] = useState('upload'); // 'upload' | 'presets' | 'url'
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Left Sidebar Drawer State (3-line hamburger menu)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const initialCourseForm = {
    title: '',
    category: 'Workshop',
    badge: '',
    duration: '',
    mode: '',
    original_price: '',
    discount_price: '',
    description: '',
    highlights: '',
    image_url: '',
    seats_total: '',
    seats_available: '',
    is_active: 1,
  };

  const [courseFormData, setCourseFormData] = useState(initialCourseForm);

  // Journey Day-by-Day Roadmap Phases Builder State (starts empty so admin adds everything)
  const [journeyPhases, setJourneyPhases] = useState([]);

  // Calculate duration days and phase coverage limits dynamically
  const totalJourneyDays = parseDurationDays(courseFormData.duration);

  const maxAllocatedDay = journeyPhases.reduce((max, phase) => {
    const { end, start } = parseDaysFromPeriod(phase.period);
    return Math.max(max, end || start || 0);
  }, 0);

  const isAllDaysAllocated = totalJourneyDays > 0 && maxAllocatedDay >= totalJourneyDays;
  const remainingDays = Math.max(0, totalJourneyDays - maxAllocatedDay);
  const hasExceededDays = totalJourneyDays > 0 && maxAllocatedDay > totalJourneyDays;

  const handleAddPhase = () => {
    const totalDays = parseDurationDays(courseFormData.duration);
    if (!totalDays || totalDays <= 0) {
      setFormError('Please enter a duration with total days (e.g. "40 Days") first before adding phases.');
      return;
    }
    if (journeyPhases.length >= 10) {
      setFormError('A maximum of 10 phases can be added to a single journey.');
      return;
    }

    // Determine starting day for the new phase
    let nextStartDay = 1;
    if (journeyPhases.length > 0) {
      const lastPhase = journeyPhases[journeyPhases.length - 1];
      const { end, start } = parseDaysFromPeriod(lastPhase.period);
      const lastDay = end || start;
      if (lastDay > 0) {
        nextStartDay = lastDay + 1;
      }
    }

    if (nextStartDay > totalDays) {
      setFormError(`Cannot add more phases. All ${totalDays} days are already scheduled.`);
      return;
    }

    // Allocate next block (up to 10 days, bounded strictly by totalDays)
    const nextEndDay = Math.min(nextStartDay + 9, totalDays);

    setFormError('');
    setJourneyPhases((prev) => [
      ...prev,
      {
        period: `Day ${nextStartDay}–${nextEndDay}`,
        title: '',
        details: '',
        outcome: '',
      },
    ]);
  };

  const handleUpdatePhase = (index, field, value) => {
    setJourneyPhases((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemovePhase = (index) => {
    setJourneyPhases((prev) => prev.filter((_, i) => i !== index));
  };

  // Load Dashboard Data
  const loadDashboardData = async () => {
    setCoursesLoading(true);
    try {
      const allCourses = await fetchAllCourses();
      if (allCourses && allCourses.length > 0) {
        setCourses(allCourses);
        localStorage.setItem('gni_custom_courses', JSON.stringify(allCourses));
      }
      const statsData = await fetchAdminStats();
      if (statsData) setStats(statsData);
    } catch (err) {
      console.warn('Dashboard load warning:', err);
    } finally {
      setCoursesLoading(false);
    }
  };

  // Load Registrations Data
  const loadRegistrations = async () => {
    setRegLoading(true);
    try {
      const allRegs = await fetchAdminRegistrations();
      if (allRegs) {
        setRegistrations(allRegs);
      }
    } catch (err) {
      console.warn('Registrations load warning:', err);
    } finally {
      setRegLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const data = await adminLogin(username, password);
      if (data && data.token) {
        localStorage.setItem('gni_admin_token', data.token);
        setIsAuthenticated(true);
      } else {
        setLoginError('Invalid credentials received from server.');
      }
    } catch (err) {
      setLoginError(err.message || 'Invalid admin username or password.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('gni_admin_token');
    setIsAuthenticated(false);
  };

  // Open Create Modal with clean blank form (no pre-filled defaults)
  const handleOpenCreateModal = (initialType = 'workshop') => {
    setModalMode('create');
    setEditingCourseId(null);
    setFormOfferingType(initialType);
    setJourneyPhases([]);
    setCourseFormData({
      title: '',
      category: initialType === 'workshop' ? 'Workshop' : 'Learning Journey',
      badge: '',
      duration: '',
      mode: '',
      original_price: '',
      discount_price: '',
      description: '',
      highlights: '',
      image_url: '',
      seats_total: '',
      seats_available: '',
      is_active: 1,
    });
    setFormError('');
    setFormSuccess('');
    setIsModalOpen(true);
  };

  // Switch offering type inside the modal form
  const handleTypeSwitch = (newType) => {
    setFormOfferingType(newType);
    setCourseFormData((prev) => ({
      ...prev,
      category: newType === 'workshop' ? 'Workshop' : 'Learning Journey',
      duration: newType === 'journey' && (!prev.duration || !prev.duration.includes('Day')) ? '60 Days' : prev.duration,
    }));
    if (newType === 'journey') {
      setJourneyPhases((prev) => (prev.length === 0 ? JSON.parse(JSON.stringify(DEFAULT_60_DAY_PHASES)) : prev));
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (course) => {
    const detectedType = getOfferingType(course);
    setModalMode('edit');
    setEditingCourseId(course.id);
    setFormOfferingType(detectedType);
    setJourneyPhases(parsePhasesFromHighlights(course.highlights, course.title));
    setCourseFormData({
      title: course.title || '',
      category: course.category || (detectedType === 'workshop' ? 'Workshop' : 'Learning Journey'),
      badge: course.badge || 'Special Offer',
      duration: course.duration || (detectedType === 'workshop' ? '1 Day Pilot Event' : '50 Days'),
      mode: course.mode || 'Studio Hands-on',
      original_price: Number(course.original_price) || 0,
      discount_price: Number(course.discount_price) || 0,
      description: course.description || '',
      highlights: course.highlights || '',
      image_url: course.image_url || '/artisan/workshop.jpg',
      seats_total: Number(course.seats_total) || 50,
      seats_available: Number(course.seats_available) || 20,
      is_active: course.is_active ? 1 : 0,
    });
    setFormError('');
    setFormSuccess('');
    setIsModalOpen(true);
  };

  // Form input change
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? (checked ? 1 : 0) : value;
    setCourseFormData((prev) => ({ ...prev, [name]: val }));
  };

  // Upload an image file directly from user device
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image exceeds the 5MB size limit. Please choose a smaller file.');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setUploadError('Unsupported image type. Please select a PNG, JPG, or WEBP file.');
      return;
    }

    setUploadError('');
    setUploadingImage(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result;
          const res = await uploadOfferingImage(base64Data, file.name);
          if (res?.url) {
            setCourseFormData((prev) => ({ ...prev, image_url: res.url }));
          }
        } catch (err) {
          setUploadError(err.message || 'Image upload failed. Please try again.');
        } finally {
          setUploadingImage(false);
        }
      };
      reader.onerror = () => {
        setUploadError('Failed to read file from your device.');
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setUploadError('Error processing file.');
      setUploadingImage(false);
    }
  };

  // Save Course (Create or Update) with strict content limitations
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    const title = (courseFormData.title || '').trim();
    const description = (courseFormData.description || '').trim();
    const origPrice = Number(courseFormData.original_price) || 0;
    const discPrice = Number(courseFormData.discount_price) || 0;
    const seatsTotal = Number(courseFormData.seats_total) || 0;
    const seatsAvailable = Number(courseFormData.seats_available) || 0;

    // 1. Title validation & limitation (Words only)
    if (!title) {
      setFormError('Please enter an offering title.');
      return;
    }
    const titleWords = countWords(title);
    if (titleWords < 1) {
      setFormError('Title must contain at least 1 word.');
      return;
    }
    if (titleWords > 12) {
      setFormError(`Title cannot exceed 12 words (currently ${titleWords} words).`);
      return;
    }

    // 2. Category & Banner Badge limitations (Words only)
    const catWords = countWords(courseFormData.category);
    if (catWords > 6) {
      setFormError(`Category cannot exceed 6 words (currently ${catWords} words).`);
      return;
    }
    const badgeWords = countWords(courseFormData.badge);
    if (badgeWords > 5) {
      setFormError(`Banner badge cannot exceed 5 words (currently ${badgeWords} words).`);
      return;
    }

    // 3. Duration validation based on offering type (Words only)
    const rawDur = (courseFormData.duration || '').trim();
    const durWords = countWords(rawDur);
    if (durWords > 5) {
      setFormError(`Duration cannot exceed 5 words (currently ${durWords} words).`);
      return;
    }
    const dayMatch = rawDur.match(/(\d+)\s*day/i);
    const dayCount = dayMatch ? parseInt(dayMatch[1], 10) : null;

    if (formOfferingType === 'workshop') {
      if (dayCount !== null && dayCount > 9) {
        setFormError(
          `Workshop duration cannot exceed 9 days (detected ${dayCount} days). For 10+ days, please switch to "Learning Journey" above.`
        );
        return;
      }
      if (dayCount !== null && dayCount < 1) {
        setFormError('Workshop duration must be at least 1 day.');
        return;
      }
    } else {
      // Journey validation
      const totalDays = parseDurationDays(rawDur);
      if (!totalDays || totalDays < 10) {
        setFormError(
          'Learning Journeys are multi-week cohorts and must be 10 days or longer (e.g. "30 Days", "60 Days"). For 1–9 days, please select "Workshop" above.'
        );
        return;
      }
      if (totalDays > 365) {
        setFormError('Learning Journey duration cannot exceed 365 days.');
        return;
      }

      if (journeyPhases.length === 0) {
        setFormError('Please add at least 1 milestone phase to the learning journey.');
        return;
      }

      for (let i = 0; i < journeyPhases.length; i++) {
        const ph = journeyPhases[i];
        const pTitleWords = countWords(ph.title);
        if (pTitleWords === 0) {
          setFormError(`Phase ${i + 1} requires a milestone title.`);
          return;
        }
        if (pTitleWords > 8) {
          setFormError(`Phase ${i + 1} title cannot exceed 8 words (currently ${pTitleWords} words).`);
          return;
        }
        const pDetWords = countWords(ph.details);
        if (pDetWords > 18) {
          setFormError(`Phase ${i + 1} studio focus details cannot exceed 18 words (currently ${pDetWords} words).`);
          return;
        }
        const pOutWords = countWords(ph.outcome);
        if (pOutWords > 18) {
          setFormError(`Phase ${i + 1} outcome cannot exceed 18 words (currently ${pOutWords} words).`);
          return;
        }
        const { start, end } = parseDaysFromPeriod(ph.period);
        if (start > totalDays || end > totalDays) {
          setFormError(
            `Phase ${i + 1} ("${ph.period}") exceeds the total journey duration of ${totalDays} days. Please adjust the days before saving.`
          );
          return;
        }
      }
    }

    // 4. Learning Mode limitation (Words only)
    const modeWords = countWords(courseFormData.mode);
    if (modeWords > 5) {
      setFormError(`Learning mode cannot exceed 5 words (currently ${modeWords} words).`);
      return;
    }

    // 5. Description limitation (Words only)
    if (!description) {
      setFormError('Please enter an overview description.');
      return;
    }
    const descWords = countWords(description);
    if (descWords < 2) {
      setFormError('Description is too short. Please provide at least 2 words.');
      return;
    }
    if (descWords > 40) {
      setFormError(`Description cannot exceed 40 words to keep cards uniform (currently ${descWords} words).`);
      return;
    }

    // 6. Highlights limitation for workshop (Words only)
    if (formOfferingType === 'workshop') {
      const modWords = countWords(courseFormData.highlights);
      if (modWords > 45) {
        setFormError(`Practical modules text cannot exceed 45 words (currently ${modWords} words).`);
        return;
      }
    }

    // 6. Pricing limitations
    if (discPrice <= 0) {
      setFormError('Please enter a valid Discount / Offer Fee greater than ₹0.');
      return;
    }
    if (discPrice > 500000) {
      setFormError('Discount fee cannot exceed ₹5,00,000.');
      return;
    }
    if (origPrice > 0 && discPrice > origPrice) {
      setFormError(
        `Discount fee (₹${discPrice.toLocaleString('en-IN')}) cannot be higher than original regular fee (₹${origPrice.toLocaleString('en-IN')}).`
      );
      return;
    }

    // 7. Seats limitations
    if (seatsTotal <= 0 || seatsTotal > 500) {
      setFormError('Total batch seats must be between 1 and 500.');
      return;
    }
    if (seatsAvailable < 0 || seatsAvailable > seatsTotal) {
      setFormError(
        `Available seats (${seatsAvailable}) cannot be negative or exceed total batch seats (${seatsTotal}).`
      );
      return;
    }

    setModalLoading(true);
    setFormError('');

    try {
      const finalPayload = {
        ...courseFormData,
        original_price: Number(courseFormData.original_price) || 0,
        discount_price: Number(courseFormData.discount_price) || 0,
        seats_total: Number(courseFormData.seats_total) || 50,
        seats_available: Number(courseFormData.seats_available) || 30,
        image_url:
          (courseFormData.image_url || '').trim() ||
          (formOfferingType === 'workshop'
            ? '/artisan/workshop.jpg'
            : '/artisan/pedagogy-practice.jpg'),
        highlights:
          formOfferingType === 'journey'
            ? JSON.stringify(journeyPhases)
            : courseFormData.highlights,
      };

      if (modalMode === 'create') {
        const res = await createCourse(finalPayload);
        const created = res.data || { ...finalPayload, id: Date.now() };
        const updated = [created, ...courses];
        setCourses(updated);
        localStorage.setItem('gni_custom_courses', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
        setFormSuccess('Offering created successfully!');
      } else {
        await updateCourse(editingCourseId, finalPayload);
        const updated = courses.map((c) =>
          c.id === editingCourseId ? { ...c, ...finalPayload } : c
        );
        setCourses(updated);
        localStorage.setItem('gni_custom_courses', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
        setFormSuccess('Offering & Discounts updated successfully!');
      }

      setTimeout(() => {
        setIsModalOpen(false);
        loadDashboardData();
      }, 1000);
    } catch (err) {
      setFormError(err.message || 'Operation failed. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

  // Toggle Course Visibility
  const handleToggleCourse = async (courseId, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      await toggleCourseStatus(courseId, newStatus);
      const updated = courses.map((c) => (c.id === courseId ? { ...c, is_active: newStatus } : c));
      setCourses(updated);
      localStorage.setItem('gni_custom_courses', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.warn('Status toggle error:', err);
    }
  };

  // Delete Course
  const handleDeleteCourse = async (courseId, title) => {
    if (window.confirm(`Are you sure you want to remove "${title}"?`)) {
      try {
        await deleteCourse(courseId);
        const updated = courses.filter((c) => c.id !== courseId);
        setCourses(updated);
        localStorage.setItem('gni_custom_courses', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
      } catch (err) {
        console.warn('Delete error:', err);
      }
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (registrations.length === 0) return;
    const headers = 'ID,Full Name,Email,Phone,Location,Profession,Interested Skill,Experience,Created At\n';
    const rows = registrations
      .map(
        (r) =>
          `"${r.id}","${r.full_name || r.fullName}","${r.email}","${r.full_phone || r.phone}","${r.location}","${r.profession}","${r.interested_skill}","${r.experience_level}","${r.created_at}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gni-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Counts by offering type (Only 2 types: Workshop and Journey)
  const workshopCount = courses.filter((c) => getOfferingType(c) === 'workshop').length;
  const journeyCount = courses.filter((c) => getOfferingType(c) === 'journey').length;

  // Filtered offerings based on sub-tab and search
  const filteredOfferings = courses.filter((c) => {
    const type = getOfferingType(c);
    if (offeringFilterTab === 'workshops' && type !== 'workshop') return false;
    if (offeringFilterTab === 'journeys' && type !== 'journey') return false;
    if (courseSearch) {
      const term = courseSearch.toLowerCase();
      return (
        c.title?.toLowerCase().includes(term) ||
        c.category?.toLowerCase().includes(term) ||
        c.badge?.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term)
      );
    }
    return true;
  });

  // Filtered student registrations
  const filteredRegistrations = registrations.filter((r) => {
    const matchesSkill = regSkillFilter === 'all' || r.interested_skill === regSkillFilter;
    const query = regSearch.toLowerCase();
    const nameMatch = (r.full_name || r.fullName || '').toLowerCase().includes(query);
    const emailMatch = (r.email || '').toLowerCase().includes(query);
    const phoneMatch = (r.phone || r.full_phone || '').includes(query);
    const locMatch = (r.location || '').toLowerCase().includes(query);
    return matchesSkill && (nameMatch || emailMatch || phoneMatch || locMatch);
  });

  const calcOrig = Number(courseFormData.original_price) || 0;
  const calcDisc = Number(courseFormData.discount_price) || 0;
  const previewDiscountPercent =
    calcOrig > 0 && calcDisc < calcOrig ? Math.round(((calcOrig - calcDisc) / calcOrig) * 100) : 0;

  // -------------------------------------------------------------
  // LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F7F2E8] flex flex-col justify-center items-center px-4 py-12 font-['DM_Sans']">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#6B4030]/20 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-[#4A2C20] text-[#B89555] flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-bold text-[#241A16]">
              Faculty &amp; Admin Workspace
            </h1>
            <p className="font-['DM_Sans'] text-xs text-[#6B4030]">
              Global Nagas Institute • Admissions &amp; Offerings Portal
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                Institutional Email
              </label>
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#6B4030]/25 bg-[#FAF7F0] text-xs text-[#241A16] focus:outline-hidden focus:border-[#B89555]"
                placeholder="admin@globalnagas.org"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                Access Security Key / Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#6B4030]/25 bg-[#FAF7F0] text-xs text-[#241A16] focus:outline-hidden focus:border-[#B89555]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B4030] hover:text-[#241A16] transition-colors p-1 cursor-pointer focus:outline-hidden"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-[#4A2C20] hover:bg-[#6B4030] text-[#F7F2E8] font-['DM_Sans'] text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#B89555]" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Workspace</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-[#6B4030]/15 flex items-center justify-between text-xs font-['DM_Sans'] text-[#6B4030]">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-[#4A2C20]">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Site</span>
            </Link>
            <span className="text-[11px] text-[#6B4030]/70">Protected Route</span>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F7F2E8] text-[#241A16] flex flex-col font-['DM_Sans'] select-none [caret-color:transparent] [&_input]:select-text [&_textarea]:select-text [&_input]:caret-[#B89555] [&_textarea]:caret-[#B89555]">
      {/* Top Header */}
      <header className="bg-white text-[#241A16] border-b border-[#6B4030]/15 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* 3-lines Hamburger Menu button (Left Side) */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open navigation menu"
              className="p-2 -ml-1 rounded-xl text-[#4A2C20] hover:bg-[#FAF7F0] border border-[#6B4030]/20 hover:border-[#6B4030]/40 transition-all cursor-pointer flex items-center justify-center group"
              title="Add Offerings & Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 select-none cursor-default">
              <img
                src="/artisan/logo.png"
                alt="Global Nagas Institute"
                className="w-9 h-9 object-contain"
              />
              <div>
                <span className="font-['Cormorant_Garamond'] text-lg sm:text-xl font-bold text-[#4A2C20] tracking-tight leading-tight block">
                  Global Nagas Institute
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Left Slide-out Drawer / Sidebar (hidden until 3-line hamburger menu is clicked) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Left Drawer Content */}
          <aside className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 border-r border-[#6B4030]/15 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#6B4030]/15 flex items-center justify-between bg-[#FAF7F0]">
              <div className="flex items-center gap-2.5">
                <img
                  src="/artisan/logo.png"
                  alt="Global Nagas Institute"
                  className="w-8 h-8 object-contain"
                />
                <div>
                  <h3 className="font-['Cormorant_Garamond'] text-base font-bold text-[#4A2C20] leading-tight">
                    Global Nagas Institute
                  </h3>
                  <span className="text-[11px] text-[#6B4030] font-semibold block uppercase tracking-wider">
                    Admin
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 rounded-lg text-[#6B4030] hover:text-[#241A16] hover:bg-white/80 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* PRIMARY ACTION SECTION: + ADD OFFERING */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold text-[#6B4030] uppercase tracking-wider block px-1">
                  Create New Offerings
                </span>

                <div className="space-y-2">
                  {/* Add Workshop Button */}
                  <button
                    onClick={() => {
                      setIsSidebarOpen(false);
                      handleOpenCreateModal('workshop');
                    }}
                    className="w-full p-3 rounded-xl bg-[#4A2C20] hover:bg-[#5e3829] text-white flex items-center gap-3 shadow-xs transition-all text-left group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                      <Hammer className="w-4 h-4 text-[#B89555]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold block leading-tight">
                        + Add Workshop
                      </span>
                      <span className="text-[10px] text-[#F7F2E8]/75 leading-tight block truncate">
                        1–9 Days hands-on workshop
                      </span>
                    </div>
                  </button>

                  {/* Add Journey Button */}
                  <button
                    onClick={() => {
                      setIsSidebarOpen(false);
                      handleOpenCreateModal('journey');
                    }}
                    className="w-full p-3 rounded-xl bg-white hover:bg-[#FAF7F0] text-[#241A16] border border-[#6B4030]/25 flex items-center gap-3 shadow-2xs transition-all text-left group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#4A2C20]/10 flex items-center justify-center shrink-0 group-hover:bg-[#4A2C20]/15 transition-colors">
                      <Compass className="w-4 h-4 text-[#4A2C20]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-[#4A2C20] block leading-tight">
                        + Add Journey
                      </span>
                      <span className="text-[10px] text-[#6B4030] leading-tight block truncate">
                        30 / 60 Days structured cohort
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-[#6B4030]/15 bg-[#FAF7F0] space-y-2">
              <Link
                to="/"
                onClick={() => setIsSidebarOpen(false)}
                className="w-full py-2 px-3 rounded-xl bg-white border border-[#6B4030]/15 hover:bg-gray-50 text-[#4A2C20] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span>View User Website</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#B89555]" />
              </Link>

              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  handleLogout();
                }}
                className="w-full py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold border border-red-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white border border-[#6B4030]/15 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[#6B4030] text-xs">
              <span className="font-medium">Total Offerings</span>
              <Layers className="w-4 h-4 text-[#B89555]" />
            </div>
            <p className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-bold text-[#241A16]">
              {courses.length}
            </p>
            <span className="text-[11px] text-emerald-700 font-medium">
              {courses.filter((c) => c.is_active).length} Active on Website
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#6B4030]/15 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[#6B4030] text-xs">
              <span className="font-medium">Workshops &amp; Journeys</span>
              <Hammer className="w-4 h-4 text-amber-600" />
            </div>
            <p className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-bold text-[#4A2C20]">
              {workshopCount + journeyCount}
            </p>
            <span className="text-[11px] text-[#6B4030] font-medium">
              {workshopCount} Workshops • {journeyCount} Journeys
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#6B4030]/15 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[#6B4030] text-xs">
              <span className="font-medium">Registered Students</span>
              <Users className="w-4 h-4 text-[#4A2C20]" />
            </div>
            <p className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-bold text-[#4A2C20]">
              {registrations.length}
            </p>
            <span className="text-[11px] text-[#6B4030] font-medium">
              Enrolled Applicants
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#6B4030]/15 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[#6B4030] text-xs">
              <span className="font-medium">Active Discounts</span>
              <Flame className="w-4 h-4 text-red-600" />
            </div>
            <p className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-bold text-red-700">
              {courses.filter((c) => Number(c.discount_price) < Number(c.original_price)).length}
            </p>
            <span className="text-[11px] text-emerald-700 font-medium">
              Special Offers Running
            </span>
          </div>
        </div>

        {/* Top Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-[#6B4030]/20 pb-3 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'courses'
                  ? 'bg-[#4A2C20] text-[#F7F2E8] shadow-xs'
                  : 'bg-white text-[#6B4030] hover:bg-[#FAF7F0] border border-[#6B4030]/15'
              }`}
            >
              Workshops &amp; Journeys ({courses.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('registrations');
                loadRegistrations();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'registrations'
                  ? 'bg-[#4A2C20] text-[#F7F2E8] shadow-xs'
                  : 'bg-white text-[#6B4030] hover:bg-[#FAF7F0] border border-[#6B4030]/15'
              }`}
            >
              Student Applications ({registrations.length})
            </button>
          </div>

          {activeTab === 'courses' && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#4A2C20] hover:bg-[#603929] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Menu className="w-3.5 h-3.5 text-[#B89555]" />
              <span>+ Add Offerings</span>
            </button>
          )}

          {activeTab === 'registrations' && (
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF7F0] text-[#4A2C20] border border-[#6B4030]/20 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#B89555]" />
              <span>Export CSV</span>
            </button>
          )}
        </div>

        {/* TAB 1: OFFERINGS MANAGEMENT */}
        {activeTab === 'courses' && (
          <div className="space-y-4">
            {/* Filter Sub-Tabs & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#6B4030]/15 shadow-2xs">
              <div className="inline-flex p-1 rounded-xl bg-[#FAF7F0] border border-[#6B4030]/15 overflow-x-auto no-scrollbar gap-1">
                <button
                  onClick={() => setOfferingFilterTab('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    offeringFilterTab === 'all'
                      ? 'bg-[#4A2C20] text-[#F7F2E8] shadow-2xs'
                      : 'text-[#6B4030] hover:text-[#241A16]'
                  }`}
                >
                  All ({courses.length})
                </button>

                <button
                  onClick={() => setOfferingFilterTab('workshops')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    offeringFilterTab === 'workshops'
                      ? 'bg-[#4A2C20] text-[#F7F2E8] shadow-2xs'
                      : 'text-[#6B4030] hover:text-[#241A16]'
                  }`}
                >
                  <Hammer className="w-3 h-3 text-[#B89555]" />
                  <span>Workshops</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-number">
                    {workshopCount}
                  </span>
                </button>

                <button
                  onClick={() => setOfferingFilterTab('journeys')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    offeringFilterTab === 'journeys'
                      ? 'bg-[#4A2C20] text-[#F7F2E8] shadow-2xs'
                      : 'text-[#6B4030] hover:text-[#241A16]'
                  }`}
                >
                  <Compass className="w-3 h-3 text-[#B89555]" />
                  <span>Journeys &amp; Cohorts</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-number">
                    {journeyCount}
                  </span>
                </button>
              </div>

              {/* Search */}
              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#6B4030]/60" />
                <input
                  type="text"
                  placeholder="Search offerings..."
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#FAF7F0] border border-[#6B4030]/15 text-xs text-[#241A16] placeholder:text-[#6B4030]/50 focus:bg-white focus:border-[#B89555] focus:outline-hidden"
                />
              </div>
            </div>

            {coursesLoading ? (
              <div className="py-16 text-center text-[#6B4030] flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#B89555]" />
                <span className="text-xs">Loading offerings...</span>
              </div>
            ) : filteredOfferings.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-[#6B4030]/15 p-8 space-y-3">
                <Layers className="w-8 h-8 text-[#B89555] mx-auto" />
                <p className="text-sm text-[#6B4030]">No offerings match your current filter.</p>
                <button
                  onClick={() => handleOpenCreateModal('workshop')}
                  className="px-4 py-2 rounded-xl bg-[#4A2C20] text-white text-xs font-semibold"
                >
                  Create New Offering
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                {filteredOfferings.map((course) => {
                  const type = getOfferingType(course);
                  const origPrice = Number(course.original_price) || 0;
                  const discPrice = Number(course.discount_price) || 0;
                  const discPercent =
                    course.discount_percent ||
                    (origPrice > 0 ? Math.round(((origPrice - discPrice) / origPrice) * 100) : 0);

                  return (
                    <div
                      key={course.id}
                      className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-2xs space-y-3.5 flex flex-col justify-between transition-all ${
                        course.is_active
                          ? 'border-[#6B4030]/20'
                          : 'border-gray-200 opacity-60 bg-gray-50'
                      }`}
                    >
                      <div className="flex gap-3.5">
                        <img
                          src={course.image_url || '/artisan/workshop.jpg'}
                          alt={course.title}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 border border-[#6B4030]/15"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/artisan/workshop.jpg';
                          }}
                        />

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-1 flex-wrap">
                            <span
                              className={`text-[9.5px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md flex items-center gap-1 ${
                                type === 'workshop'
                                  ? 'bg-[#4A2C20] text-[#B89555]'
                                  : 'bg-indigo-950 text-indigo-300'
                              }`}
                            >
                              {type === 'workshop' ? (
                                <Hammer className="w-2.5 h-2.5 text-[#B89555]" />
                              ) : (
                                <Compass className="w-2.5 h-2.5 text-indigo-300" />
                              )}
                              <span>{type === 'workshop' ? 'Workshop' : 'Journey'}</span>
                            </span>

                            <span
                              className={`px-2 py-0.5 rounded-full text-[9.5px] font-semibold shrink-0 ${
                                course.is_active
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              {course.is_active ? 'Live on Site' : 'Hidden'}
                            </span>
                          </div>

                          <h3 className="font-['Cormorant_Garamond'] text-lg sm:text-xl font-bold text-[#241A16] leading-tight truncate">
                            {course.title}
                          </h3>

                          <div className="flex items-center gap-2 text-[11px] text-[#6B4030] font-number">
                            <span className="bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#6B4030]/10">
                              {course.duration}
                            </span>
                            <span>•</span>
                            <span>{course.seats_available || 15} seats left</span>
                          </div>
                        </div>
                      </div>

                      {/* Highlights */}
                      {course.highlights && (
                        <p className="text-[11.5px] text-[#6B4030]/90 line-clamp-2 bg-[#FAF7F0] p-2.5 rounded-xl border border-[#6B4030]/10">
                          {course.highlights}
                        </p>
                      )}

                      {/* Pricing Box */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F0] border border-[#6B4030]/10">
                        <div>
                          <span className="text-[10px] text-[#6B4030] uppercase font-bold block">
                            Offer Price
                          </span>
                          <div className="flex items-baseline gap-2">
                            <span className="font-number text-xl font-bold text-[#241A16]">
                              ₹{discPrice.toLocaleString('en-IN')}
                            </span>
                            {origPrice > discPrice && (
                              <span className="font-number text-xs text-[#6B4030]/60 line-through">
                                ₹{origPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                        </div>

                        {discPercent > 0 && (
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 border border-red-300 text-red-800 text-[11px] font-bold font-number">
                            <Flame className="w-3 h-3 text-red-600 fill-current" />
                            <span>{discPercent}% OFF</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#6B4030]/10">
                        <button
                          onClick={() => handleToggleCourse(course.id, course.is_active)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                            course.is_active
                              ? 'border-gray-300 text-gray-600 hover:bg-gray-100'
                              : 'border-emerald-600 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                          }`}
                        >
                          {course.is_active ? 'Hide from User Site' : 'Publish Live'}
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(course)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FAF7F0] hover:bg-[#eedfc8] text-[#4A2C20] text-xs font-medium border border-[#6B4030]/20 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#B89555]" />
                            <span>Edit / Offer</span>
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id, course.title)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                            title="Delete course"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REGISTRATIONS */}
        {activeTab === 'registrations' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#6B4030]/60" />
                <input
                  type="text"
                  placeholder="Search by student name, email, phone, location..."
                  value={regSearch}
                  onChange={(e) => setRegSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#6B4030]/20 text-xs text-[#241A16] placeholder:text-[#6B4030]/60 focus:outline-hidden focus:border-[#B89555]"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#6B4030]" />
                <select
                  value={regSkillFilter}
                  onChange={(e) => setRegSkillFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white border border-[#6B4030]/20 text-xs text-[#241A16] focus:outline-hidden cursor-pointer"
                >
                  <option value="all">All Skills</option>
                  <option value="Painting & Natural Mineral Pigments">Painting &amp; Mineral Pigments</option>
                  <option value="Libi – Language, Scripts & Epigraphy">Epigraphy &amp; Scripts</option>
                  <option value="Sculpturing & Sacred Nagas Metal Art">Sculpturing &amp; Metal Art</option>
                  <option value="Heritage Applications & Interior Crafts">Heritage Applications</option>
                  <option value="All Four Skill Pillars">All Four Pillars</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#6B4030]/15 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F0] text-[#4A2C20] border-b border-[#6B4030]/15 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-3">Applicant Name</th>
                      <th className="py-3 px-3">Contact</th>
                      <th className="py-3 px-3">Location / Profession</th>
                      <th className="py-3 px-3">Selected Discipline</th>
                      <th className="py-3 px-3">Payment Reference</th>
                      <th className="py-3 px-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#6B4030]/10">
                    {filteredRegistrations.map((reg) => (
                      <tr key={reg.id || Math.random()} className="hover:bg-[#FAF7F0]/50 transition-colors">
                        <td className="py-3 px-3">
                          <p className="font-bold text-[#241A16]">{reg.full_name || reg.fullName}</p>
                          <span className="text-[10px] text-[#6B4030]">
                            Level: {reg.experience_level || 'Beginner'}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-medium text-[#241A16]">{reg.email}</p>
                          <p className="text-[#6B4030] text-[11px] font-number">{reg.full_phone || reg.phone}</p>
                        </td>
                        <td className="py-3 px-3">
                          <p>{reg.location}</p>
                          <p className="text-[10px] text-[#6B4030]">{reg.profession}</p>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-[#B89555] block">
                            {reg.interested_skill}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {reg.payment_ref ? (
                            <span className="font-number bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10.5px] font-semibold">
                              {reg.payment_ref}
                            </span>
                          ) : (
                            <span className="text-[#6B4030]/50 text-[11px]">Pending / Direct</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-[11px] text-[#6B4030] font-number">
                          {reg.created_at ? new Date(reg.created_at).toLocaleDateString('en-IN') : 'Recent'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* -------------------------------------------------------------
          REDESIGNED MODAL: DYNAMIC TYPE SWITCHER & GROUPED CARDS
          ------------------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative z-10 bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col border border-[#6B4030]/20 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#6B4030]/15 px-6 py-4 bg-white shrink-0">
              <div>
                <h2 className="font-['Cormorant_Garamond'] text-2xl font-bold text-[#241A16]">
                  {modalMode === 'create' ? 'Add New Offering' : 'Edit Offering & Discount Offers'}
                </h2>
                <p className="text-xs text-[#6B4030]">
                  Changes will immediately reflect on the public website.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#FAF7F0] hover:bg-[#eedfc8] text-[#4A2C20] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form id="courseModalForm" onSubmit={handleSaveCourse} className="overflow-y-auto px-6 py-4 space-y-4 text-xs flex-1">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              {/* FEATURE 2: TOP TYPE SWITCHER */}
              <div className="p-3 rounded-2xl bg-[#FAF7F0] border border-[#6B4030]/15 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#4A2C20]">
                    Select Offering Category / Type:
                  </span>
                  <span className="text-[10px] text-[#6B4030]">
                    1–9 Days &rarr; Workshop &bull; 10+ Days &rarr; Learning Journey
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleTypeSwitch('workshop')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      formOfferingType === 'workshop'
                        ? 'bg-[#4A2C20] text-[#F7F2E8] shadow-xs'
                        : 'bg-white text-[#6B4030] border border-[#6B4030]/20 hover:bg-[#FAF7F0]'
                    }`}
                  >
                    <Hammer className={`w-3.5 h-3.5 ${formOfferingType === 'workshop' ? 'text-[#B89555]' : 'text-[#6B4030]'}`} />
                    <span>Workshop (1–9 Days)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTypeSwitch('journey')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      formOfferingType === 'journey'
                        ? 'bg-[#4A2C20] text-[#F7F2E8] shadow-xs'
                        : 'bg-white text-[#6B4030] border border-[#6B4030]/20 hover:bg-[#FAF7F0]'
                    }`}
                  >
                    <Compass className={`w-3.5 h-3.5 ${formOfferingType === 'journey' ? 'text-[#B89555]' : 'text-[#6B4030]'}`} />
                    <span>Learning Journey (10+ Days)</span>
                  </button>
                </div>
              </div>

              {/* CARD 1: IDENTITY & FORMAT */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#6B4030]/15 space-y-3">
                <span className="text-xs font-bold text-[#4A2C20] uppercase tracking-wide block border-b border-[#6B4030]/10 pb-1.5">
                  1. Title &amp; Details
                </span>

                <div className="space-y-1 text-left">
                  <div className="flex items-center justify-between">
                    <label className="block font-medium text-[#4A2C20]">
                      {formOfferingType === 'workshop' ? 'Workshop Title *' : 'Journey Track Title *'}
                    </label>
                    <span
                      className={`text-[10px] font-number ${
                        countWords(courseFormData.title) > 12
                          ? 'text-red-600 font-bold'
                          : countWords(courseFormData.title) >= 10
                          ? 'text-amber-700 font-bold'
                          : 'text-[#6B4030]/70'
                      }`}
                    >
                      {countWords(courseFormData.title)} / 12 words
                    </span>
                  </div>
                  <input
                    type="text"
                    name="title"
                    value={courseFormData.title}
                    onChange={handleFormChange}
                    placeholder="e.g. Ancient Tamil Art Workshop"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#6B4030]/20 bg-[#FAF7F0]/40 text-sm text-[#241A16] focus:outline-hidden focus:border-[#B89555]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block font-medium text-[#4A2C20]">Category / Pillar</label>
                      <span
                        className={`text-[10px] font-number ${
                          countWords(courseFormData.category) > 6
                            ? 'text-red-600 font-bold'
                            : 'text-[#6B4030]/70'
                        }`}
                      >
                        {countWords(courseFormData.category)} / 6 words
                      </span>
                    </div>
                    <input
                      type="text"
                      name="category"
                      value={courseFormData.category}
                      onChange={handleFormChange}
                      placeholder={formOfferingType === 'workshop' ? 'Workshop' : 'Learning Journey'}
                      className="w-full px-3 py-2 rounded-xl border border-[#6B4030]/20 bg-[#FAF7F0]/60 text-xs text-[#241A16]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block font-medium text-[#4A2C20]">Banner Badge / Promo Tag</label>
                      <span
                        className={`text-[10px] font-number ${
                          countWords(courseFormData.badge) > 5
                            ? 'text-red-600 font-bold'
                            : 'text-[#6B4030]/70'
                        }`}
                      >
                        {countWords(courseFormData.badge)} / 5 words
                      </span>
                    </div>
                    <input
                      type="text"
                      name="badge"
                      value={courseFormData.badge}
                      onChange={handleFormChange}
                      placeholder="e.g. Immersive Masterclass"
                      className="w-full px-3 py-2 rounded-xl border border-[#6B4030]/20 bg-[#FAF7F0]/40 text-xs text-[#241A16]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block font-medium text-[#4A2C20]">
                        Duration {formOfferingType === 'journey' ? <span className="text-red-600 font-bold">* (Total Days)</span> : <span className="text-xs text-[#6B4030]/70">(1–9 Days)</span>}
                      </label>
                      <span
                        className={`text-[10px] font-number ${
                          countWords(courseFormData.duration) > 5
                            ? 'text-red-600 font-bold'
                            : 'text-[#6B4030]/70'
                        }`}
                      >
                        {countWords(courseFormData.duration)} / 5 words
                      </span>
                    </div>
                    <input
                      type="text"
                      name="duration"
                      value={courseFormData.duration}
                      onChange={handleFormChange}
                      placeholder={formOfferingType === 'workshop' ? '1 Day Pilot Event' : 'e.g. 40 Days'}
                      className="w-full px-3 py-2 rounded-xl border border-[#6B4030]/20 bg-[#FAF7F0]/40 text-xs text-[#241A16]"
                    />
                    {formOfferingType === 'workshop' ? (
                      <p className="text-[10.5px] text-[#6B4030] mt-0.5">
                        Workshops are strictly limited to <strong>1–9 days</strong> (e.g. 1 Day, 3 Days).
                      </p>
                    ) : (
                      <p className="text-[10.5px] mt-0.5">
                        {totalJourneyDays >= 10 ? (
                          <span className="text-emerald-700 font-medium">
                            ✓ <strong>{totalJourneyDays} Days</strong> detected. Milestones will be bounded by this.
                          </span>
                        ) : (
                          <span className="text-amber-800 font-medium">
                            ⚠️ Enter 10+ days (e.g. <strong>30 Days</strong>, <strong>60 Days</strong>) to unlock milestones.
                          </span>
                        )}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block font-medium text-[#4A2C20]">Learning Mode</label>
                      <span
                        className={`text-[10px] font-number ${
                          countWords(courseFormData.mode) > 5
                            ? 'text-red-600 font-bold'
                            : 'text-[#6B4030]/70'
                        }`}
                      >
                        {countWords(courseFormData.mode)} / 5 words
                      </span>
                    </div>
                    <input
                      type="text"
                      name="mode"
                      value={courseFormData.mode}
                      onChange={handleFormChange}
                      placeholder="Studio Hands-on"
                      className="w-full px-3 py-2 rounded-xl border border-[#6B4030]/20 bg-[#FAF7F0]/40 text-xs text-[#241A16]"
                    />
                  </div>
                </div>
              </div>

              {/* CARD 2: PRICING & SPECIAL OFFER */}
              <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#B89555]/40 space-y-3">
                <div className="flex items-center justify-between border-b border-[#6B4030]/15 pb-2">
                  <div className="flex items-center gap-1.5 font-bold text-[#4A2C20]">
                    <Tag className="w-4 h-4 text-[#B89555]" />
                    <span>2. Pricing &amp; Discount Offer Settings</span>
                  </div>
                  {previewDiscountPercent > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-bold text-[11px] font-number animate-pulse">
                      {previewDiscountPercent}% Discount Active
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  <div className="space-y-1">
                    <label className="block font-medium text-[#4A2C20]">
                      Original Fee (₹) <span className="text-[#6B4030]/70">(Regular price, max ₹5,00,000)</span>
                    </label>
                    <input
                      type="number"
                      name="original_price"
                      value={courseFormData.original_price}
                      onChange={handleFormChange}
                      placeholder="9999"
                      required
                      min="1"
                      max="500000"
                      className="w-full px-3 py-2 rounded-xl border border-[#6B4030]/20 bg-white text-sm text-[#241A16] font-number"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-medium text-[#4A2C20]">
                      Discount / Offer Fee (₹) <span className="text-red-600 font-bold">*</span>
                    </label>
                    <input
                      type="number"
                      name="discount_price"
                      value={courseFormData.discount_price}
                      onChange={handleFormChange}
                      placeholder="4999"
                      required
                      min="1"
                      max="500000"
                      className="w-full px-3 py-2 rounded-xl border border-emerald-500 bg-white text-sm font-bold text-[#241A16] font-number"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-[#6B4030] italic font-number">
                  {calcDisc > 0 ? (
                    <>
                      Students see {calcOrig > 0 && <span className="line-through">₹{calcOrig.toLocaleString('en-IN')}</span>} discounted to{' '}
                      <strong className="text-emerald-700">₹{calcDisc.toLocaleString('en-IN')}</strong>
                      {previewDiscountPercent > 0 && ` (${previewDiscountPercent}% savings)`}.
                    </>
                  ) : (
                    'Set fee details above to preview student discount.'
                  )}
                </p>
              </div>

              {/* CARD 3: CURRICULUM MODULES & BANNER */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#6B4030]/15 space-y-3">
                <span className="text-xs font-bold text-[#4A2C20] uppercase tracking-wide block border-b border-[#6B4030]/10 pb-1.5">
                  3. Description &amp; Modules
                </span>

                <div className="space-y-1 text-left">
                  <div className="flex items-center justify-between">
                    <label className="block font-medium text-[#4A2C20]">
                      Overview Description <span className="text-red-600">*</span>
                    </label>
                    <span
                      className={`text-[10px] font-number ${
                        countWords(courseFormData.description) > 40
                          ? 'text-red-600 font-bold'
                          : countWords(courseFormData.description) >= 35
                          ? 'text-amber-700 font-bold'
                          : 'text-[#6B4030]/70'
                      }`}
                    >
                      {countWords(courseFormData.description)} / 40 words
                    </span>
                  </div>
                  <textarea
                    name="description"
                    value={courseFormData.description}
                    onChange={handleFormChange}
                    rows={2}
                    placeholder="Short description of the hands-on craft experience (max 40 words)..."
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#6B4030]/20 bg-[#FAF7F0]/40 text-xs text-[#241A16] resize-none"
                  />
                </div>

                {formOfferingType === 'journey' ? (
                  <div className="space-y-3 pt-2 border-t border-[#6B4030]/15">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <label className="block font-bold text-[#4A2C20] text-xs uppercase tracking-wide">
                          Day-by-Day Roadmap Phases ({journeyPhases.length} Phases)
                        </label>
                        <span className="text-[10.5px] text-[#6B4030]">
                          Customize milestones strictly within total duration ({totalJourneyDays > 0 ? `${totalJourneyDays} Days` : 'Set duration'}).
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddPhase}
                        disabled={totalJourneyDays <= 0 || isAllDaysAllocated}
                        className={`px-2.5 py-1.5 rounded-lg text-white text-[11px] font-bold shadow-2xs transition-colors flex items-center gap-1 cursor-pointer ${
                          totalJourneyDays <= 0 || isAllDaysAllocated
                            ? 'bg-stone-300 text-stone-600 cursor-not-allowed opacity-75'
                            : 'bg-[#4A2C20] hover:bg-[#603929]'
                        }`}
                        title={
                          totalJourneyDays <= 0
                            ? 'Please enter duration above first'
                            : isAllDaysAllocated
                            ? `All ${totalJourneyDays} days have already been allocated`
                            : '+ Add Phase'
                        }
                      >
                        <Plus className="w-3.5 h-3.5 text-[#B89555]" />
                        <span>
                          {isAllDaysAllocated && totalJourneyDays > 0
                            ? 'All Days Covered'
                            : '+ Add Phase'}
                        </span>
                      </button>
                    </div>

                    {/* Schedule Tracker Status Pill */}
                    <div
                      className={`flex items-center justify-between text-xs px-3 py-2 rounded-xl border ${
                        hasExceededDays
                          ? 'bg-red-50 border-red-300 text-red-800'
                          : isAllDaysAllocated
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : 'bg-[#FAF7F0] border-[#6B4030]/20 text-[#4A2C20]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Schedule Allocation:</span>
                        <span className="font-number font-semibold">
                          {totalJourneyDays > 0
                            ? `${maxAllocatedDay} / ${totalJourneyDays} Days Covered`
                            : 'Duration not entered yet'}
                        </span>
                      </div>
                      <div>
                        {hasExceededDays ? (
                          <span className="text-red-600 font-bold text-[11px]">
                            ⚠️ Exceeds limit by {maxAllocatedDay - totalJourneyDays} Days!
                          </span>
                        ) : isAllDaysAllocated ? (
                          <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                            ✓ 100% Scheduled ({totalJourneyDays} Days)
                          </span>
                        ) : totalJourneyDays > 0 ? (
                          <span className="text-amber-800 font-medium text-[11px]">
                            {remainingDays} Days Remaining
                          </span>
                        ) : (
                          <span className="text-amber-700 text-[11px]">
                            Set duration above
                          </span>
                        )}
                      </div>
                    </div>

                    {journeyPhases.length === 0 ? (
                      <div className="p-6 text-center rounded-2xl bg-[#FAF7F0] border border-dashed border-[#6B4030]/25 space-y-2">
                        <Calendar className="w-6 h-6 text-[#B89555] mx-auto" />
                        <p className="text-xs font-semibold text-[#4A2C20]">No Roadmap Phases Added</p>
                        <p className="text-[11px] text-[#6B4030]">
                          {totalJourneyDays > 0
                            ? `Total duration is ${totalJourneyDays} Days. Click below to add Phase 1.`
                            : 'Please enter total duration (e.g. 40 Days) above to start adding phases.'}
                        </p>
                        <button
                          type="button"
                          onClick={handleAddPhase}
                          disabled={totalJourneyDays <= 0}
                          className={`mt-1 px-3 py-1.5 rounded-lg text-white text-xs font-bold shadow-2xs transition-colors inline-flex items-center gap-1 cursor-pointer ${
                            totalJourneyDays <= 0
                              ? 'bg-stone-300 text-stone-600 cursor-not-allowed opacity-75'
                              : 'bg-[#4A2C20] hover:bg-[#603929]'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5 text-[#B89555]" />
                          <span>+ Add First Phase</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {journeyPhases.map((phase, idx) => {
                        const { start: pStart, end: pEnd } = parseDaysFromPeriod(phase.period);
                        const isExceeded =
                          totalJourneyDays > 0 &&
                          (pStart > totalJourneyDays || pEnd > totalJourneyDays);

                        return (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border space-y-2 text-left ${
                            isExceeded
                              ? 'bg-red-50/60 border-red-300'
                              : 'bg-[#FAF7F0] border-[#6B4030]/15'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="w-6 h-6 rounded-md bg-[#4A2C20] text-[#B89555] font-number text-[11px] font-bold flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <input
                                type="text"
                                value={phase.period}
                                onChange={(e) => handleUpdatePhase(idx, 'period', e.target.value)}
                                placeholder={`Day ${idx * 10 + 1}–${Math.min((idx + 1) * 10, totalJourneyDays || 100)}`}
                                className={`w-28 sm:w-32 px-2.5 py-1 rounded-md border bg-white font-number text-xs font-bold ${
                                  isExceeded
                                    ? 'border-red-500 text-red-700'
                                    : 'border-[#6B4030]/20 text-[#4A2C20]'
                                }`}
                              />
                              {isExceeded && (
                                <span className="text-[10.5px] text-red-600 font-bold">
                                  ⚠️ Exceeds {totalJourneyDays} Days!
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemovePhase(idx)}
                              className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                              title="Remove Phase"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="space-y-1.5">
                            <div>
                              <div className="flex items-center justify-between">
                                <label className="text-[10px] font-semibold text-[#4A2C20] block">
                                  Phase Title / Curriculum Topic *
                                </label>
                                <span
                                  className={`text-[9.5px] font-number ${
                                    countWords(phase.title) > 8
                                      ? 'text-red-600 font-bold'
                                      : 'text-[#6B4030]/70'
                                  }`}
                                >
                                  {countWords(phase.title)} / 8 words
                                </span>
                              </div>
                              <input
                                type="text"
                                value={phase.title}
                                onChange={(e) => handleUpdatePhase(idx, 'title', e.target.value)}
                                placeholder="e.g. Drawing & Sacred Geometry"
                                required
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#6B4030]/20 bg-white text-xs text-[#241A16] focus:border-[#B89555]"
                              />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <div className="flex items-center justify-between">
                                  <label className="text-[10px] font-semibold text-[#6B4030] block">
                                    Studio Focus / Details
                                  </label>
                                  <span
                                    className={`text-[9.5px] font-number ${
                                      countWords(phase.details) > 18
                                        ? 'text-red-600 font-bold'
                                        : 'text-[#6B4030]/70'
                                    }`}
                                  >
                                    {countWords(phase.details)} / 18 words
                                  </span>
                                </div>
                                <input
                                  type="text"
                                  value={phase.details}
                                  onChange={(e) => handleUpdatePhase(idx, 'details', e.target.value)}
                                  placeholder="e.g. Line geometry, sacred motifs, ancient grids"
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#6B4030]/20 bg-white text-[11px] text-[#241A16]"
                                />
                              </div>
                              <div className="p-2 sm:p-2.5 rounded-lg bg-[#B89555]/10 border border-[#B89555]/30 space-y-1">
                                <div className="flex items-center justify-between">
                                  <label className="text-[10px] font-bold text-[#4A2C20] flex items-center gap-1">
                                    <Award className="w-3.5 h-3.5 text-[#B89555]" />
                                    <span>Key Milestone Outcome</span>
                                    <span className="text-[9px] font-normal text-[#6B4030] bg-white px-1.5 py-0.5 rounded border border-[#6B4030]/15">
                                      Shown in Learning Journey
                                    </span>
                                  </label>
                                  <span
                                    className={`text-[9.5px] font-number ${
                                      countWords(phase.outcome) > 18
                                        ? 'text-red-600 font-bold'
                                        : 'text-[#6B4030]/70'
                                    }`}
                                  >
                                    {countWords(phase.outcome)} / 18 words
                                  </span>
                                </div>
                                <input
                                  type="text"
                                  value={phase.outcome}
                                  onChange={(e) => handleUpdatePhase(idx, 'outcome', e.target.value)}
                                  placeholder="e.g. Master Foundational Sacred Proportions"
                                  className="w-full px-2.5 py-1.5 rounded-md border border-[#B89555]/40 bg-white text-[11px] text-[#241A16] font-medium placeholder-[#6B4030]/40 focus:border-[#B89555] focus:ring-1 focus:ring-[#B89555]/30"
                                />
                                <p className="text-[9.5px] text-[#6B4030] leading-snug">
                                  💡 Appears in the gold quote box under &ldquo;{phase.title || `Phase ${idx + 1}`}&rdquo; in the Learning Journey section.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                  <div className="space-y-1 text-left">
                    <div className="flex items-center justify-between">
                      <label className="block font-medium text-[#4A2C20]">
                        Practical Modules <span className="text-[10px] text-[#6B4030]/70">(Separate with ;)</span>
                      </label>
                      <span
                        className={`text-[10px] font-number ${
                          countWords(courseFormData.highlights) > 45
                            ? 'text-red-600 font-bold'
                            : 'text-[#6B4030]/70'
                        }`}
                      >
                        {countWords(courseFormData.highlights)} / 45 words
                      </span>
                    </div>
                    <input
                      type="text"
                      name="highlights"
                      value={courseFormData.highlights}
                      onChange={handleFormChange}
                      placeholder="Rock Painting; Tamili Writing; Iconography Basics; Copper Plate Inscription"
                      className="w-full px-3 py-2 rounded-xl border border-[#6B4030]/20 bg-[#FAF7F0]/40 text-xs text-[#241A16]"
                    />
                    <p className="text-[10.5px] text-[#6B4030]">
                      Add up to 6–8 hands-on activities separated by a semicolon (;) (max 45 words).
                    </p>
                  </div>
                )}

                {/* Real Image Uploader with Tabs */}
                <div className="space-y-2 text-left">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <label className="block font-medium text-[#4A2C20]">Cover Image</label>
                    <div className="inline-flex p-0.5 rounded-lg bg-[#FAF7F0] border border-[#6B4030]/15 text-[10.5px]">
                      <button
                        type="button"
                        onClick={() => setImageUploadMode('upload')}
                        className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                          imageUploadMode === 'upload'
                            ? 'bg-[#4A2C20] text-white shadow-2xs'
                            : 'text-[#6B4030] hover:text-[#241A16]'
                        }`}
                      >
                        Upload from Device
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageUploadMode('presets')}
                        className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                          imageUploadMode === 'presets'
                            ? 'bg-[#4A2C20] text-white shadow-2xs'
                            : 'text-[#6B4030] hover:text-[#241A16]'
                        }`}
                      >
                        Preset Gallery
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageUploadMode('url')}
                        className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                          imageUploadMode === 'url'
                            ? 'bg-[#4A2C20] text-white shadow-2xs'
                            : 'text-[#6B4030] hover:text-[#241A16]'
                        }`}
                      >
                        Custom URL
                      </button>
                    </div>
                  </div>

                  {/* UPLOAD MODE */}
                  {imageUploadMode === 'upload' && (
                    <div>
                      <label
                        htmlFor="imageFileInput"
                        className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                          uploadingImage
                            ? 'border-[#B89555] bg-[#FAF7F0]'
                            : 'border-[#6B4030]/25 hover:border-[#B89555] hover:bg-[#FAF7F0]/50'
                        }`}
                      >
                        <input
                          id="imageFileInput"
                          type="file"
                          accept="image/png, image/jpeg, image/webp"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                        {uploadingImage ? (
                          <div className="flex flex-col items-center gap-1.5 py-2">
                            <Loader2 className="w-6 h-6 animate-spin text-[#B89555]" />
                            <span className="text-xs font-semibold text-[#4A2C20]">
                              Uploading image to server...
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1 py-1">
                            <UploadCloud className="w-6 h-6 text-[#B89555]" />
                            <span className="text-xs font-semibold text-[#241A16]">
                              Click to browse photo from your device
                            </span>
                            <span className="text-[10px] text-[#6B4030]/70">
                              Supports JPG, PNG, WEBP (Max 5MB)
                            </span>
                          </div>
                        )}
                      </label>
                      {uploadError && (
                        <p className="text-[11px] text-red-600 mt-1 font-medium">{uploadError}</p>
                      )}
                    </div>
                  )}

                  {/* PRESETS GALLERY MODE (The pills from your screenshot!) */}
                  {imageUploadMode === 'presets' && (
                    <div className="space-y-1.5">
                      <p className="text-[10.5px] text-[#6B4030]">
                        Click any curated studio image to set it as cover:
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {PRESET_IMAGES.map((img) => (
                          <button
                            key={img.url}
                            type="button"
                            onClick={() => setCourseFormData((prev) => ({ ...prev, image_url: img.url }))}
                            className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                              courseFormData.image_url === img.url
                                ? 'bg-[#4A2C20] text-white border-[#4A2C20] shadow-xs'
                                : 'bg-[#FAF7F0] text-[#6B4030] border-[#6B4030]/20 hover:bg-[#eedfc8]/40'
                            }`}
                          >
                            <img
                              src={img.url}
                              alt={img.label}
                              className="w-8 h-8 rounded-lg object-cover shrink-0"
                            />
                            <span className="text-[10px] font-medium truncate">{img.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CUSTOM URL MODE */}
                  {imageUploadMode === 'url' && (
                    <div>
                      <input
                        type="text"
                        name="image_url"
                        value={courseFormData.image_url}
                        onChange={handleFormChange}
                        placeholder="/artisan/workshop.jpg or https://..."
                        className="w-full px-3 py-2 rounded-xl border border-[#6B4030]/20 bg-[#FAF7F0]/40 text-xs text-[#241A16] focus:outline-hidden focus:border-[#B89555]"
                      />
                    </div>
                  )}

                  {/* LIVE PREVIEW BOX */}
                  {courseFormData.image_url && (
                    <div className="p-2.5 rounded-xl bg-[#FAF7F0] border border-[#6B4030]/15 flex items-center justify-between gap-3 mt-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={courseFormData.image_url}
                          alt="Preview"
                          className="w-12 h-12 rounded-lg object-cover shrink-0 border border-[#6B4030]/20 shadow-2xs"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/artisan/workshop.jpg';
                          }}
                        />
                        <div className="min-w-0">
                          <span className="text-[10.5px] font-bold text-[#4A2C20] block">
                            Active Cover Image:
                          </span>
                          <p className="text-[10.5px] text-[#6B4030] font-mono truncate">
                            {courseFormData.image_url}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCourseFormData((prev) => ({ ...prev, image_url: '' }))}
                        className="text-[10.5px] font-semibold text-red-600 hover:text-red-800 shrink-0 cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Seats & Active Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-1">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block font-medium text-[#4A2C20]">Total Batch Seats</label>
                    <span className="text-[10px] text-[#6B4030]/70 font-number">Max 500</span>
                  </div>
                  <input
                    type="number"
                    name="seats_total"
                    value={courseFormData.seats_total}
                    onChange={handleFormChange}
                    placeholder="50"
                    min="1"
                    max="500"
                    className="w-full px-3 py-1.5 rounded-xl border border-[#6B4030]/20 bg-[#FAF7F0]/40 text-xs text-[#241A16] font-number"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block font-medium text-[#4A2C20]">Seats Available</label>
                    <span className="text-[10px] text-[#6B4030]/70 font-number">≤ Total Seats</span>
                  </div>
                  <input
                    type="number"
                    name="seats_available"
                    value={courseFormData.seats_available}
                    onChange={handleFormChange}
                    placeholder="30"
                    min="0"
                    max="500"
                    className="w-full px-3 py-1.5 rounded-xl border border-[#6B4030]/20 bg-[#FAF7F0]/40 text-xs text-[#241A16] font-number"
                  />
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="border-t border-[#6B4030]/15 px-6 py-3 bg-[#FAF7F0] flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#6B4030]/20 text-[#6B4030] text-xs font-semibold hover:bg-white cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="courseModalForm"
                disabled={modalLoading}
                className="px-6 py-2 rounded-xl bg-[#4A2C20] hover:bg-[#6B4030] text-[#F7F2E8] text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
              >
                {modalLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#B89555]" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{modalMode === 'create' ? 'Publish Offering' : 'Save Updates'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
