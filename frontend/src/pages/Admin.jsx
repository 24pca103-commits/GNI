import React, { useState, useEffect, useRef } from 'react';
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
  KeyRound,
  ShieldCheck,
  Check,
  Mail,
  RotateCcw,
  CheckSquare,
  XCircle,
  ImagePlus,
} from 'lucide-react';
import {
  fetchAllCourses,
  createCourse,
  updateCourse,
  toggleCourseStatus,
  deleteCourse,
  fetchAdminRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
  fetchAdminStats,
  adminLogin,
  verifyAdminLoginOtp,
  resendAdminLoginOtp,
  adminForgotPassword,
  verifyAdminResetOtp,
  resetAdminPassword,
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

// Helper to count characters cleanly (Character-based validation)
function countChars(str) {
  return str ? String(str).length : 0;
}

export const CHAR_LIMITS = {
  title: { min: 5, max: 100, label: 'Offering Title' },
  category: { min: 3, max: 50, label: 'Category / Pillar' },
  badge: { min: 0, max: 40, label: 'Banner Badge' },
  duration: { min: 2, max: 30, label: 'Duration' },
  mode: { min: 3, max: 40, label: 'Learning Mode' },
  description: { min: 15, max: 500, label: 'Description' },
  highlights: { min: 10, max: 500, label: 'Practical Modules / Highlights' },
  phaseTitle: { min: 3, max: 80, label: 'Phase Title' },
  phaseDetails: { min: 10, max: 200, label: 'Studio Focus' },
  phaseOutcome: { min: 5, max: 120, label: 'Key Milestone Outcome' },
};

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('gni_admin_token') ? true : false;
  });

  // Multi-step Authentication state:
  // 'login' | 'verify_otp' | 'forgot_password' | 'verify_reset_otp' | 'new_password'
  const [authView, setAuthView] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // OTP 2FA verification state
  const [otpSessionId, setOtpSessionId] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Forgot password flow state
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSessionId, setResetSessionId] = useState('');
  const [resetOtpInput, setResetOtpInput] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Real-time Dashboard Syncing & Data Refresh
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(new Date().toLocaleTimeString());

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
  const fileInputRef = useRef(null);
  const changeFileInputRef = useRef(null);

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

  // Countdown timer for OTP resend cooldown
  useEffect(() => {
    let timer = null;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendCooldown]);

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
      setLastSyncTime(new Date().toLocaleTimeString());
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
      setLastSyncTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn('Registrations load warning:', err);
    } finally {
      setRegLoading(false);
    }
  };

  // Real-time synchronization: Auto-poll every 12s & refetch on window focus
  useEffect(() => {
    if (!isAuthenticated) return;

    loadDashboardData();
    loadRegistrations();

    const interval = setInterval(() => {
      loadDashboardData();
      if (activeTab === 'registrations') {
        loadRegistrations();
      }
    }, 12000);

    const onWindowFocus = () => {
      loadDashboardData();
      loadRegistrations();
    };

    window.addEventListener('focus', onWindowFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onWindowFocus);
    };
  }, [isAuthenticated, activeTab]);

  // Manual Trigger to refresh all data immediately
  const handleSyncAllData = async () => {
    setIsSyncing(true);
    try {
      await Promise.all([loadDashboardData(), loadRegistrations()]);
    } finally {
      setTimeout(() => setIsSyncing(false), 500);
    }
  };

  // 1. Handle Admin Login Step 1: Credential check & OTP trigger
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');
    setLoginLoading(true);

    try {
      const data = await adminLogin(username, password);
      if (data && data.requireOtp) {
        setOtpSessionId(data.otpSessionId);
        setMaskedEmail(data.maskedEmail);
        setAuthView('verify_otp');
        setResendCooldown(60);
        setLoginSuccess(data.message || 'OTP verification code sent to your registered admin email.');
      } else if (data && data.token) {
        localStorage.setItem('gni_admin_token', data.token);
        setIsAuthenticated(true);
      } else {
        setLoginError('Invalid response received from authentication server.');
      }
    } catch (err) {
      setLoginError(err.message || 'Invalid admin username or password.');
    } finally {
      setLoginLoading(false);
    }
  };

  // 1. Handle Admin Login Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const data = await verifyAdminLoginOtp(otpSessionId, otpInput);
      if (data && data.token) {
        localStorage.setItem('gni_admin_token', data.token);
        setIsAuthenticated(true);
      } else {
        setLoginError('OTP verification failed. Please check the code.');
      }
    } catch (err) {
      setLoginError(err.message || 'Incorrect verification code. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  // 1. Handle Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setLoginError('');
    setLoginLoading(true);

    try {
      const data = await resendAdminLoginOtp(otpSessionId);
      setResendCooldown(60);
      setLoginSuccess(data.message || 'Fresh OTP dispatched.');
    } catch (err) {
      setLoginError(err.message || 'Failed to resend code.');
    } finally {
      setLoginLoading(false);
    }
  };

  // 1. Forgot Password Step 1: Request OTP
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');
    setLoginLoading(true);

    try {
      const data = await adminForgotPassword(forgotEmail);
      if (data && data.resetSessionId) {
        setResetSessionId(data.resetSessionId);
        setMaskedEmail(data.maskedEmail);
        setAuthView('verify_reset_otp');
        setLoginSuccess(data.message || 'Password reset OTP sent.');
      }
    } catch (err) {
      setLoginError(err.message || 'Failed to initiate password reset.');
    } finally {
      setLoginLoading(false);
    }
  };

  // 1. Forgot Password Step 2: Verify Reset OTP
  const handleVerifyResetOtp = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const data = await verifyAdminResetOtp(resetSessionId, resetOtpInput);
      if (data && data.resetToken) {
        setResetToken(data.resetToken);
        setAuthView('new_password');
        setLoginSuccess('Verification successful. Please choose a new password.');
      }
    } catch (err) {
      setLoginError(err.message || 'Invalid reset OTP code.');
    } finally {
      setLoginLoading(false);
    }
  };

  // 1. Forgot Password Step 3: Submit New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (newPassword !== confirmPassword) {
      setLoginError('Passwords do not match. Please re-enter.');
      return;
    }
    if (newPassword.length < 8) {
      setLoginError('Password must be at least 8 characters long.');
      return;
    }

    setLoginLoading(true);

    try {
      const data = await resetAdminPassword(resetToken, newPassword);
      setAuthView('login');
      setLoginSuccess(data.message || 'Password updated successfully! You can now log in.');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setLoginError(err.message || 'Failed to update password.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Application Status Update
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateRegistrationStatus(id, newStatus);
      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, payment_status: newStatus } : r))
      );
      // Immediately refresh stats
      const statsData = await fetchAdminStats();
      if (statsData) setStats(statsData);
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  // Handle Application Delete
  const handleDeleteRegistration = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the application record for ${name || 'this student'}?`)) {
      return;
    }
    try {
      await deleteRegistration(id);
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
      const statsData = await fetchAdminStats();
      if (statsData) setStats(statsData);
    } catch (err) {
      alert('Failed to delete registration: ' + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('gni_admin_token');
    setIsAuthenticated(false);
    setAuthView('login');
    setUsername('');
    setPassword('');
    setOtpInput('');
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

    // 1. Title validation & limitation (Character count)
    if (!title) {
      setFormError('Please enter an offering title.');
      return;
    }
    const titleChars = countChars(title);
    if (titleChars < CHAR_LIMITS.title.min) {
      setFormError(`Title must contain at least ${CHAR_LIMITS.title.min} characters (currently ${titleChars} chars).`);
      return;
    }
    if (titleChars > CHAR_LIMITS.title.max) {
      setFormError(`Title cannot exceed ${CHAR_LIMITS.title.max} characters (currently ${titleChars} chars).`);
      return;
    }

    // 2. Category & Banner Badge limitations (Character count)
    const catChars = countChars(courseFormData.category);
    if (catChars < CHAR_LIMITS.category.min || catChars > CHAR_LIMITS.category.max) {
      setFormError(`Category must be between ${CHAR_LIMITS.category.min} and ${CHAR_LIMITS.category.max} characters (currently ${catChars} chars).`);
      return;
    }
    const badgeChars = countChars(courseFormData.badge);
    if (badgeChars > CHAR_LIMITS.badge.max) {
      setFormError(`Banner badge cannot exceed ${CHAR_LIMITS.badge.max} characters (currently ${badgeChars} chars).`);
      return;
    }

    // 3. Duration validation based on offering type (Character count)
    const rawDur = (courseFormData.duration || '').trim();
    const durChars = countChars(rawDur);
    if (durChars < CHAR_LIMITS.duration.min || durChars > CHAR_LIMITS.duration.max) {
      setFormError(`Duration must be between ${CHAR_LIMITS.duration.min} and ${CHAR_LIMITS.duration.max} characters (currently ${durChars} chars).`);
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
        const pTitleChars = countChars(ph.title);
        if (pTitleChars < CHAR_LIMITS.phaseTitle.min) {
          setFormError(`Phase ${i + 1} milestone title must be at least ${CHAR_LIMITS.phaseTitle.min} characters.`);
          return;
        }
        if (pTitleChars > CHAR_LIMITS.phaseTitle.max) {
          setFormError(`Phase ${i + 1} title cannot exceed ${CHAR_LIMITS.phaseTitle.max} characters (currently ${pTitleChars} chars).`);
          return;
        }
        const pDetChars = countChars(ph.details);
        if (pDetChars < CHAR_LIMITS.phaseDetails.min) {
          setFormError(`Phase ${i + 1} studio focus details must be at least ${CHAR_LIMITS.phaseDetails.min} characters.`);
          return;
        }
        if (pDetChars > CHAR_LIMITS.phaseDetails.max) {
          setFormError(`Phase ${i + 1} studio focus cannot exceed ${CHAR_LIMITS.phaseDetails.max} characters (currently ${pDetChars} chars).`);
          return;
        }
        const pOutChars = countChars(ph.outcome);
        if (pOutChars < CHAR_LIMITS.phaseOutcome.min) {
          setFormError(`Phase ${i + 1} outcome must be at least ${CHAR_LIMITS.phaseOutcome.min} characters.`);
          return;
        }
        if (pOutChars > CHAR_LIMITS.phaseOutcome.max) {
          setFormError(`Phase ${i + 1} outcome cannot exceed ${CHAR_LIMITS.phaseOutcome.max} characters (currently ${pOutChars} chars).`);
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

    // 4. Learning Mode limitation (Character count)
    const modeChars = countChars(courseFormData.mode);
    if (modeChars > CHAR_LIMITS.mode.max) {
      setFormError(`Learning mode cannot exceed ${CHAR_LIMITS.mode.max} characters (currently ${modeChars} chars).`);
      return;
    }

    // 5. Description limitation (Character count)
    if (!description) {
      setFormError('Please enter an overview description.');
      return;
    }
    const descChars = countChars(description);
    if (descChars < CHAR_LIMITS.description.min) {
      setFormError(`Description must be at least ${CHAR_LIMITS.description.min} characters (currently ${descChars} chars).`);
      return;
    }
    if (descChars > CHAR_LIMITS.description.max) {
      setFormError(`Description cannot exceed ${CHAR_LIMITS.description.max} characters (currently ${descChars} chars).`);
      return;
    }

    // 6. Highlights limitation for workshop (Character count)
    if (formOfferingType === 'workshop') {
      const modChars = countChars(courseFormData.highlights);
      if (modChars < CHAR_LIMITS.highlights.min) {
        setFormError(`Practical modules text must be at least ${CHAR_LIMITS.highlights.min} characters.`);
        return;
      }
      if (modChars > CHAR_LIMITS.highlights.max) {
        setFormError(`Practical modules text cannot exceed ${CHAR_LIMITS.highlights.max} characters (currently ${modChars} chars).`);
        return;
      }
    }

    // 7. Pricing limitations
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

    // 8. Seat Capacity & Booking Consistency (Requirement 7)
    if (seatsTotal <= 0 || seatsTotal > 500) {
      setFormError('Total batch seats must be between 1 and 500.');
      return;
    }

    // Check confirmed bookings when editing to prevent reducing capacity below confirmed seats
    const currentCourse = courses.find((c) => c.id === editingCourseId);
    const confirmedBookings = currentCourse?.booked_seats || 0;

    if (modalMode === 'edit' && seatsTotal < confirmedBookings) {
      setFormError(
        `Total batch seats (${seatsTotal}) cannot be reduced below the ${confirmedBookings} currently confirmed student bookings.`
      );
      return;
    }

    const calculatedAvailableSeats = Math.max(0, seatsTotal - confirmedBookings);

    setModalLoading(true);
    setFormError('');

    try {
      const finalPayload = {
        ...courseFormData,
        original_price: Number(courseFormData.original_price) || 0,
        discount_price: Number(courseFormData.discount_price) || 0,
        seats_total: seatsTotal,
        seats_available: calculatedAvailableSeats,
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
  // MULTI-STEP ADMIN AUTHENTICATION (OTP 2FA & FORGOT PASSWORD)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F7F2E8] flex flex-col justify-center items-center px-4 py-12 font-['DM_Sans']">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#6B4030]/20 shadow-xl space-y-6">
          {/* Header Brand */}
          <div className="text-center space-y-2.5">
            <div className="flex items-center justify-center">
              <img
                src="/artisan/logo.png"
                alt="Global Nagas Institute"
                className="w-16 h-16 object-contain drop-shadow-xs"
              />
            </div>
            <h1 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-bold text-[#241A16]">
              {authView === 'login' && 'Faculty & Admin Workspace'}
              {authView === 'verify_otp' && 'Two-Factor Verification'}
              {authView === 'forgot_password' && 'Reset Admin Password'}
              {authView === 'verify_reset_otp' && 'Verify Password Reset'}
              {authView === 'new_password' && 'Create New Password'}
            </h1>
            <p className="font-['DM_Sans'] text-xs text-[#6B4030]">
              Global Nagas Institute • Admissions &amp; Offerings Portal
            </p>
          </div>

          {/* Alert Notifications */}
          {loginError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {loginSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{loginSuccess}</span>
            </div>
          )}

          {/* VIEW 1: ADMIN LOGIN FORM */}
          {authView === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                  Institutional Administrator Email
                </label>
                <input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#6B4030]/25 bg-[#FAF7F0] text-xs text-[#241A16] cursor-text select-text focus:outline-hidden focus:border-[#B89555]"
                  placeholder="kan93095@gmail.com"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                    Access Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthView('forgot_password');
                      setLoginError('');
                      setLoginSuccess('');
                    }}
                    className="text-[11px] font-semibold text-[#B89555] hover:text-[#4A2C20] cursor-pointer transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#6B4030]/25 bg-[#FAF7F0] text-xs text-[#241A16] cursor-text select-text focus:outline-hidden focus:border-[#B89555]"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B4030] hover:text-[#241A16] transition-colors p-1 cursor-pointer focus:outline-hidden"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                    <span>Verifying Credentials &amp; Sending OTP...</span>
                  </>
                ) : (
                  <span>Continue to OTP Verification</span>
                )}
              </button>
            </form>
          )}

          {/* VIEW 2: LOGIN OTP VERIFICATION */}
          {authView === 'verify_otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <span className="text-[11px] font-medium text-[#6B4030]">
                  Enter the 6-digit verification code sent to:
                </span>
                <p className="font-mono font-bold text-xs text-[#4A2C20]">{maskedEmail}</p>
              </div>

              <div className="space-y-1">
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  required
                  autoFocus
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[12px] font-mono text-2xl font-bold py-3 rounded-xl border border-[#B89555] bg-[#FAF7F0] text-[#4A2C20] cursor-text select-text focus:outline-hidden focus:ring-2 focus:ring-[#B89555]/30"
                />
                <span className="text-[10px] text-center block text-[#6B4030]/70">
                  Valid for 10 minutes
                </span>
              </div>

              <button
                type="submit"
                disabled={loginLoading || otpInput.length < 6}
                className="w-full py-3 rounded-xl bg-[#4A2C20] hover:bg-[#6B4030] text-[#F7F2E8] font-['DM_Sans'] text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#B89555]" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <span>Verify Code &amp; Access Dashboard</span>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || loginLoading}
                  className="text-[#B89555] font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : 'Resend Code'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthView('login');
                    setLoginError('');
                    setLoginSuccess('');
                    setOtpInput('');
                  }}
                  className="text-[#6B4030] hover:text-[#4A2C20] cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* VIEW 3: FORGOT PASSWORD REQUEST OTP */}
          {authView === 'forgot_password' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="text-left space-y-1">
                <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                  Registered Admin Email
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  placeholder="kan93095@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#6B4030]/25 bg-[#FAF7F0] text-xs text-[#241A16] cursor-text select-text focus:outline-hidden focus:border-[#B89555]"
                />
                <span className="text-[10.5px] text-[#6B4030]/80 block">
                  A password reset authorization code will be dispatched to this email.
                </span>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-xl bg-[#4A2C20] hover:bg-[#6B4030] text-[#F7F2E8] font-['DM_Sans'] text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#B89555]" />
                    <span>Sending Reset Code...</span>
                  </>
                ) : (
                  <span>Send Password Reset OTP</span>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthView('login');
                    setLoginError('');
                    setLoginSuccess('');
                  }}
                  className="text-xs text-[#6B4030] hover:text-[#4A2C20] cursor-pointer"
                >
                  &larr; Back to Admin Sign In
                </button>
              </div>
            </form>
          )}

          {/* VIEW 4: VERIFY FORGOT PASSWORD RESET OTP */}
          {authView === 'verify_reset_otp' && (
            <form onSubmit={handleVerifyResetOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <span className="text-[11px] font-medium text-[#6B4030]">
                  Enter 6-digit password reset code sent to:
                </span>
                <p className="font-mono font-bold text-xs text-[#4A2C20]">{maskedEmail}</p>
              </div>

              <div className="space-y-1">
                <input
                  type="text"
                  maxLength={6}
                  value={resetOtpInput}
                  onChange={(e) => setResetOtpInput(e.target.value.replace(/\D/g, ''))}
                  required
                  autoFocus
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[12px] font-mono text-2xl font-bold py-3 rounded-xl border border-[#B89555] bg-[#FAF7F0] text-[#4A2C20] cursor-text select-text focus:outline-hidden focus:ring-2 focus:ring-[#B89555]/30"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading || resetOtpInput.length < 6}
                className="w-full py-3 rounded-xl bg-[#4A2C20] hover:bg-[#6B4030] text-[#F7F2E8] font-['DM_Sans'] text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#B89555]" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <span>Verify &amp; Create New Password</span>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthView('login');
                    setLoginError('');
                    setLoginSuccess('');
                  }}
                  className="text-xs text-[#6B4030] hover:text-[#4A2C20] cursor-pointer"
                >
                  Cancel &amp; Return to Sign In
                </button>
              </div>
            </form>
          )}

          {/* VIEW 5: SET NEW ADMIN PASSWORD */}
          {authView === 'new_password' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                  New Administrator Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="At least 8 chars (letters & numbers)"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#6B4030]/25 bg-[#FAF7F0] text-xs text-[#241A16] cursor-text select-text focus:outline-hidden focus:border-[#B89555]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B4030] hover:text-[#241A16] p-1 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="block text-xs font-['DM_Sans'] font-medium text-[#4A2C20]">
                  Confirm New Password
                </label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#6B4030]/25 bg-[#FAF7F0] text-xs text-[#241A16] cursor-text select-text focus:outline-hidden focus:border-[#B89555]"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-xl bg-[#4A2C20] hover:bg-[#6B4030] text-[#F7F2E8] font-['DM_Sans'] text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#B89555]" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <span>Update Password &amp; Proceed to Login</span>
                )}
              </button>
            </form>
          )}

          {/* Footer Back Link */}
          <div className="pt-2 border-t border-[#6B4030]/15 flex items-center justify-between text-xs font-['DM_Sans'] text-[#6B4030]">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-[#4A2C20] cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Site</span>
            </Link>
            <span className="text-[11px] text-[#6B4030]/70 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>2FA Secured</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F7F2E8] text-[#241A16] flex flex-col font-['DM_Sans']">
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
        {/* KPI Summary Cards - Requirement 5 Ordered:
            1. Registered Students (Visually Prominent)
            2. Total Offerings
            3. Workshops & Learning Journeys
            4. Active Discounts
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {/* 1. REGISTERED STUDENTS (First & Visually Prominent) */}
          <div
            onClick={() => {
              setActiveTab('registrations');
              loadRegistrations();
            }}
            className="p-4 sm:p-5 rounded-2xl bg-[#4A2C20] text-[#F7F2E8] border-2 border-[#B89555] shadow-md space-y-2 cursor-pointer group hover:bg-[#573527] transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#B89555]/10 rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1.5 text-[#E5B869] uppercase tracking-wider text-[11px]">
                <Users className="w-4 h-4 text-[#E5B869]" />
                <span>Registered Students</span>
              </span>
              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-[#B89555] text-[#241A16] font-number">
                Top Metric
              </span>
            </div>
            <p className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {registrations.length}
            </p>
            <div className="flex items-center justify-between text-[11px] text-[#F7F2E8]/80 pt-1 border-t border-white/10">
              <span>
                {registrations.filter((r) => !['Cancelled', 'Rejected'].includes(r.payment_status)).length} Confirmed Seats
              </span>
              <span className="text-[#E5B869] font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
                <span>View Applicants</span>
                <span>&rarr;</span>
              </span>
            </div>
          </div>

          {/* 2. TOTAL OFFERINGS */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#6B4030]/15 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-[#6B4030] text-xs">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Total Offerings</span>
              <Layers className="w-4 h-4 text-[#B89555]" />
            </div>
            <p className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl font-bold text-[#241A16]">
              {courses.length}
            </p>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#6B4030]/10">
              <span className="text-emerald-700 font-semibold">
                {courses.filter((c) => c.is_active).length} Active on Website
              </span>
              <span className="text-[#6B4030]/70 font-number">
                {courses.filter((c) => !c.is_active).length} Hidden
              </span>
            </div>
          </div>

          {/* 3. WORKSHOPS & LEARNING JOURNEYS */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#6B4030]/15 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-[#6B4030] text-xs">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Workshops &amp; Journeys</span>
              <Hammer className="w-4 h-4 text-amber-600" />
            </div>
            <p className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl font-bold text-[#4A2C20]">
              {workshopCount + journeyCount}
            </p>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#6B4030]/10 text-[#6B4030]">
              <span>{workshopCount} Workshops</span>
              <span>•</span>
              <span>{journeyCount} Journeys</span>
            </div>
          </div>

          {/* 4. ACTIVE DISCOUNTS */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#6B4030]/15 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-[#6B4030] text-xs">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Active Discounts</span>
              <Flame className="w-4 h-4 text-red-600" />
            </div>
            <p className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl font-bold text-red-700">
              {courses.filter((c) => Number(c.discount_price) < Number(c.original_price)).length}
            </p>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#6B4030]/10">
              <span className="text-emerald-700 font-semibold">Special Offers Running</span>
              <span className="text-[#6B4030]/70 font-number">
                {courses.filter((c) => Number(c.discount_price) >= Number(c.original_price)).length} Regular
              </span>
            </div>
          </div>
        </div>

        {/* Top Navigation Tabs & Real-time Live Refetch Controls */}
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

          <div className="flex items-center gap-2.5">
            {/* Live Data Sync Button */}
            <button
              type="button"
              onClick={handleSyncAllData}
              disabled={isSyncing}
              title={`Last synced at ${lastSyncTime}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#FAF7F0] text-[#4A2C20] border border-[#6B4030]/20 text-xs font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#B89555] ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync Data'}</span>
              <span className="text-[10px] text-[#6B4030]/70 font-normal">({lastSyncTime})</span>
            </button>

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

                          <div className="flex items-center justify-between gap-1.5 pt-0.5 flex-wrap">
                            <span className="bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#6B4030]/15 text-[11px] font-number text-[#6B4030]">
                              {course.duration}
                            </span>

                            {/* Requirement 7: Live Seat Availability Status Badge */}
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${
                                course.availability_status === 'Full' || course.seats_available === 0
                                  ? 'bg-red-50 text-red-800 border-red-200'
                                  : course.availability_status === 'Almost Full' || (course.seats_available > 0 && course.seats_available <= 5)
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                              <span>{course.availability_status || (course.seats_available === 0 ? 'Full' : course.seats_available <= 5 ? 'Almost Full' : 'Available')}</span>
                            </span>
                          </div>

                          {/* Requirement 7: Total Seats, Booked Seats & Available Seats Breakdown */}
                          <div className="grid grid-cols-3 gap-1 p-2 rounded-xl bg-[#FAF7F0] border border-[#6B4030]/10 text-center font-number text-[11px] mt-1.5">
                            <div>
                              <span className="text-[9px] uppercase tracking-wider text-[#6B4030] block font-sans">Total</span>
                              <span className="font-bold text-[#4A2C20]">{course.seats_total || 50}</span>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase tracking-wider text-[#6B4030] block font-sans">Booked</span>
                              <span className="font-bold text-[#B89555]">{course.booked_seats || 0}</span>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase tracking-wider text-[#6B4030] block font-sans">Available</span>
                              <span className={`font-bold ${
                                (course.seats_available === 0 || course.availability_status === 'Full')
                                  ? 'text-red-700 font-extrabold'
                                  : (course.seats_available <= 5 || course.availability_status === 'Almost Full')
                                  ? 'text-amber-700 font-extrabold'
                                  : 'text-emerald-700 font-extrabold'
                              }`}>
                                {course.seats_available !== undefined ? course.seats_available : Math.max(0, (course.seats_total || 50) - (course.booked_seats || 0))}
                              </span>
                            </div>
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
              {regLoading && (
                <div className="p-4 bg-[#FAF7F0] border-b border-[#6B4030]/10 flex items-center justify-center gap-2 text-xs text-[#6B4030]">
                  <Loader2 className="w-4 h-4 animate-spin text-[#B89555]" />
                  <span>Refreshing applications from database...</span>
                </div>
              )}

              {filteredRegistrations.length === 0 ? (
                <div className="p-10 text-center space-y-2">
                  <Users className="w-10 h-10 text-[#6B4030]/40 mx-auto" />
                  <p className="font-['Cormorant_Garamond'] text-lg font-bold text-[#241A16]">
                    No Student Applications Found
                  </p>
                  <p className="text-xs text-[#6B4030] max-w-sm mx-auto">
                    When applicants register on the public website, their submissions sync and appear here automatically in real time.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F0] text-[#4A2C20] border-b border-[#6B4030]/15 uppercase font-bold text-[10px] tracking-wider">
                      <tr>
                        <th className="py-3 px-3">Applicant &amp; Ref ID</th>
                        <th className="py-3 px-3">Contact</th>
                        <th className="py-3 px-3">Location &amp; Profession</th>
                        <th className="py-3 px-3">Selected Course</th>
                        <th className="py-3 px-3">Status &amp; Actions</th>
                        <th className="py-3 px-3 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#6B4030]/10">
                      {filteredRegistrations.map((reg) => {
                        const statusVal = reg.payment_status || 'Pending Offline Payment at Campus';
                        const isConfirmed = statusVal === 'Confirmed' || statusVal === 'Approved';
                        const isCancelled = statusVal === 'Cancelled' || statusVal === 'Rejected';

                        return (
                          <tr key={reg.id || Math.random()} className="hover:bg-[#FAF7F0]/50 transition-colors">
                            <td className="py-3 px-3">
                              <p className="font-bold text-[#241A16]">{reg.full_name || reg.fullName}</p>
                              {reg.application_ref && (
                                <span className="font-mono text-[10px] text-[#B89555] font-semibold block">
                                  {reg.application_ref}
                                </span>
                              )}
                              <span className="text-[10px] text-[#6B4030]">
                                Level: {reg.experience_level || 'Beginner'}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <p className="font-medium text-[#241A16]">{reg.email}</p>
                              <p className="text-[#6B4030] text-[11px] font-number">{reg.full_phone || reg.phone}</p>
                            </td>
                            <td className="py-3 px-3">
                              <p className="font-medium text-[#241A16]">{reg.location}</p>
                              <p className="text-[10px] text-[#6B4030]">{reg.profession}</p>
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-bold text-[#4A2C20] block">
                                {reg.interested_skill || reg.course_name}
                              </span>
                              {reg.course_duration && (
                                <span className="text-[10px] text-[#6B4030] font-number block">
                                  {reg.course_duration}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <select
                                  value={statusVal}
                                  onChange={(e) => handleStatusChange(reg.id, e.target.value)}
                                  className={`text-[11px] font-semibold px-2 py-1 rounded-lg border cursor-pointer focus:outline-hidden ${
                                    isConfirmed
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                      : isCancelled
                                      ? 'bg-red-50 text-red-800 border-red-300'
                                      : 'bg-amber-50 text-amber-800 border-amber-300'
                                  }`}
                                >
                                  <option value="Pending Offline Payment at Campus">Pending Offline</option>
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Approved">Approved</option>
                                  <option value="Cancelled">Cancelled</option>
                                  <option value="Rejected">Rejected</option>
                                </select>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteRegistration(reg.id, reg.full_name || reg.fullName)}
                                  className="p-1 rounded-md text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                                  title="Delete record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-[11px] text-[#6B4030] font-number text-right">
                              {reg.created_at ? new Date(reg.created_at).toLocaleDateString('en-IN') : 'Recent'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
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
                        countChars(courseFormData.title) > CHAR_LIMITS.title.max
                          ? 'text-red-600 font-bold'
                          : countChars(courseFormData.title) >= CHAR_LIMITS.title.max - 10
                          ? 'text-amber-700 font-bold'
                          : 'text-[#6B4030]/70'
                      }`}
                    >
                      {countChars(courseFormData.title)} / {CHAR_LIMITS.title.max} characters
                    </span>
                  </div>
                  <input
                    type="text"
                    name="title"
                    value={courseFormData.title}
                    onChange={handleFormChange}
                    placeholder="e.g. Ancient Tamil Art Workshop"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#6B4030]/20 bg-[#FAF7F0]/40 text-sm text-[#241A16] cursor-text select-text focus:outline-hidden focus:border-[#B89555]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block font-medium text-[#4A2C20]">Category / Pillar</label>
                      <span
                        className={`text-[10px] font-number ${
                          countChars(courseFormData.category) > CHAR_LIMITS.category.max
                            ? 'text-red-600 font-bold'
                            : 'text-[#6B4030]/70'
                        }`}
                      >
                        {countChars(courseFormData.category)} / {CHAR_LIMITS.category.max} characters
                      </span>
                    </div>
                    <input
                      type="text"
                      name="category"
                      value={courseFormData.category}
                      onChange={handleFormChange}
                      placeholder={formOfferingType === 'workshop' ? 'Workshop' : 'Learning Journey'}
                      className="w-full px-3 py-2 rounded-xl border border-[#6B4030]/20 bg-[#FAF7F0]/60 text-xs text-[#241A16] cursor-text select-text"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block font-medium text-[#4A2C20]">Banner Badge / Promo Tag</label>
                      <span
                        className={`text-[10px] font-number ${
                          countChars(courseFormData.badge) > CHAR_LIMITS.badge.max
                            ? 'text-red-600 font-bold'
                            : 'text-[#6B4030]/70'
                        }`}
                      >
                        {countChars(courseFormData.badge)} / {CHAR_LIMITS.badge.max} characters
                      </span>
                    </div>
                    <input
                      type="text"
                      name="badge"
                      value={courseFormData.badge}
                      onChange={handleFormChange}
                      placeholder="e.g. Immersive Masterclass"
                      className="w-full px-3 py-2 rounded-xl border border-[#6B4030]/20 bg-[#FAF7F0]/40 text-xs text-[#241A16] cursor-text select-text"
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
                          countChars(courseFormData.duration) > CHAR_LIMITS.duration.max
                            ? 'text-red-600 font-bold'
                            : 'text-[#6B4030]/70'
                        }`}
                      >
                        {countChars(courseFormData.duration)} / {CHAR_LIMITS.duration.max} characters
                      </span>
                    </div>
                    <input
                      type="text"
                      name="duration"
                      value={courseFormData.duration}
                      onChange={handleFormChange}
                      placeholder={formOfferingType === 'workshop' ? '1 Day Pilot Event' : 'e.g. 40 Days'}
                      className="w-full px-3 py-2 rounded-xl border border-[#6B4030]/20 bg-[#FAF7F0]/40 text-xs text-[#241A16] cursor-text select-text"
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
                          countChars(courseFormData.mode) > CHAR_LIMITS.mode.max
                            ? 'text-red-600 font-bold'
                            : 'text-[#6B4030]/70'
                        }`}
                      >
                        {countChars(courseFormData.mode)} / {CHAR_LIMITS.mode.max} characters
                      </span>
                    </div>
                    <input
                      type="text"
                      name="mode"
                      value={courseFormData.mode}
                      onChange={handleFormChange}
                      placeholder="Studio Hands-on"
                      className="w-full px-3 py-2 rounded-xl border border-[#6B4030]/20 bg-[#FAF7F0]/40 text-xs text-[#241A16] cursor-text select-text"
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
                        countChars(courseFormData.description) > CHAR_LIMITS.description.max
                          ? 'text-red-600 font-bold'
                          : countChars(courseFormData.description) >= CHAR_LIMITS.description.max - 30
                          ? 'text-amber-700 font-bold'
                          : 'text-[#6B4030]/70'
                      }`}
                    >
                      {countChars(courseFormData.description)} / {CHAR_LIMITS.description.max} characters
                    </span>
                  </div>
                  <textarea
                    name="description"
                    value={courseFormData.description}
                    onChange={handleFormChange}
                    rows={2}
                    placeholder={`Short description of the hands-on craft experience (${CHAR_LIMITS.description.min}–${CHAR_LIMITS.description.max} characters)...`}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#6B4030]/20 bg-[#FAF7F0]/40 text-xs text-[#241A16] resize-none cursor-text select-text"
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
                                    countChars(phase.title) > CHAR_LIMITS.phaseTitle.max
                                      ? 'text-red-600 font-bold'
                                      : 'text-[#6B4030]/70'
                                  }`}
                                >
                                  {countChars(phase.title)} / {CHAR_LIMITS.phaseTitle.max} characters
                                </span>
                              </div>
                              <input
                                type="text"
                                value={phase.title}
                                onChange={(e) => handleUpdatePhase(idx, 'title', e.target.value)}
                                placeholder="e.g. Drawing & Sacred Geometry"
                                required
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#6B4030]/20 bg-white text-xs text-[#241A16] cursor-text select-text focus:border-[#B89555]"
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
                                      countChars(phase.details) > CHAR_LIMITS.phaseDetails.max
                                        ? 'text-red-600 font-bold'
                                        : 'text-[#6B4030]/70'
                                    }`}
                                  >
                                    {countChars(phase.details)} / {CHAR_LIMITS.phaseDetails.max} characters
                                  </span>
                                </div>
                                <input
                                  type="text"
                                  value={phase.details}
                                  onChange={(e) => handleUpdatePhase(idx, 'details', e.target.value)}
                                  placeholder="e.g. Line geometry, sacred motifs, ancient grids"
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#6B4030]/20 bg-white text-[11px] text-[#241A16] cursor-text select-text"
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
                                      countChars(phase.outcome) > CHAR_LIMITS.phaseOutcome.max
                                        ? 'text-red-600 font-bold'
                                        : 'text-[#6B4030]/70'
                                    }`}
                                  >
                                    {countChars(phase.outcome)} / {CHAR_LIMITS.phaseOutcome.max} characters
                                  </span>
                                </div>
                                <input
                                  type="text"
                                  value={phase.outcome}
                                  onChange={(e) => handleUpdatePhase(idx, 'outcome', e.target.value)}
                                  placeholder="e.g. Master Foundational Sacred Proportions"
                                  className="w-full px-2.5 py-1.5 rounded-md border border-[#B89555]/40 bg-white text-[11px] text-[#241A16] font-medium placeholder-[#6B4030]/40 focus:border-[#B89555] focus:ring-1 focus:ring-[#B89555]/30 cursor-text select-text"
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
                          countChars(courseFormData.highlights) > CHAR_LIMITS.highlights.max
                            ? 'text-red-600 font-bold'
                            : 'text-[#6B4030]/70'
                        }`}
                      >
                        {countChars(courseFormData.highlights)} / {CHAR_LIMITS.highlights.max} characters
                      </span>
                    </div>
                    <input
                      type="text"
                      name="highlights"
                      value={courseFormData.highlights}
                      onChange={handleFormChange}
                      placeholder="Rock Painting; Tamili Writing; Iconography Basics; Copper Plate Inscription"
                      className="w-full px-3 py-2 rounded-xl border border-[#6B4030]/20 bg-[#FAF7F0]/40 text-xs text-[#241A16] cursor-text select-text"
                    />
                    <p className="text-[10.5px] text-[#6B4030]">
                      Add up to 6–8 hands-on activities separated by a semicolon (;) (max {CHAR_LIMITS.highlights.max} characters).
                    </p>
                  </div>
                )}

                {/* REAL IMAGE UPLOADER & PREVIEW MANAGEMENT (Requirement 3) */}
                <div className="space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <label className="block font-medium text-[#4A2C20]">Cover Image</label>
                    {courseFormData.image_url && (
                      <span className="text-[10.5px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                        Image Attached
                      </span>
                    )}
                  </div>

                  {!courseFormData.image_url ? (
                    /* STATE A: NO IMAGE SELECTED -> Show Choose Image / Browse Control */
                    <div className="space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <span className="text-[10.5px] text-[#6B4030]">Choose image source:</span>
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
                            Device Browse
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

                      {imageUploadMode === 'upload' && (
                        <div>
                          <input
                            ref={fileInputRef}
                            id="imageFileInput"
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={handleFileUpload}
                            className="hidden"
                            disabled={uploadingImage}
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                            className={`w-full border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                              uploadingImage
                                ? 'border-[#B89555] bg-[#FAF7F0]'
                                : 'border-[#6B4030]/25 hover:border-[#B89555] hover:bg-[#FAF7F0]/50'
                            }`}
                          >
                            {uploadingImage ? (
                              <div className="flex flex-col items-center gap-1.5 py-2">
                                <Loader2 className="w-6 h-6 animate-spin text-[#B89555]" />
                                <span className="text-xs font-semibold text-[#4A2C20]">
                                  Uploading image to server...
                                </span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-1 py-1">
                                <div className="w-10 h-10 rounded-full bg-[#B89555]/15 text-[#B89555] flex items-center justify-center mb-1">
                                  <UploadCloud className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold text-[#4A2C20]">
                                  Choose Image / Browse
                                </span>
                                <span className="text-[10px] text-[#6B4030]/70">
                                  Supports JPG, PNG, WEBP (Max 5MB)
                                </span>
                              </div>
                            )}
                          </button>
                        </div>
                      )}

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
                                onClick={() => {
                                  setCourseFormData((prev) => ({ ...prev, image_url: img.url }));
                                  setUploadError('');
                                }}
                                className="p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer bg-[#FAF7F0] text-[#6B4030] border-[#6B4030]/20 hover:border-[#B89555] hover:bg-[#FAF7F0]/80"
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

                      {imageUploadMode === 'url' && (
                        <div>
                          <input
                            type="text"
                            name="image_url"
                            value={courseFormData.image_url}
                            onChange={handleFormChange}
                            placeholder="/artisan/workshop.jpg or https://..."
                            className="w-full px-3 py-2 rounded-xl border border-[#6B4030]/20 bg-[#FAF7F0]/40 text-xs text-[#241A16] cursor-text select-text focus:outline-hidden focus:border-[#B89555]"
                          />
                        </div>
                      )}

                      {uploadError && (
                        <p className="text-[11px] text-red-600 mt-1 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{uploadError}</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    /* STATE B: IMAGE SELECTED -> Hide Choose Image / Browse, Show Preview with Change Image & Remove Image */
                    <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#B89555]/30 space-y-2.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={courseFormData.image_url}
                          alt="Cover Preview"
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shrink-0 border border-[#6B4030]/20 shadow-xs"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/artisan/workshop.jpg';
                          }}
                        />

                        <div className="min-w-0 flex-1 space-y-1.5">
                          <div>
                            <span className="text-[10px] font-semibold text-[#6B4030] uppercase tracking-wider block">
                              Active Cover Preview
                            </span>
                            <p className="text-[11px] text-[#241A16] font-mono truncate bg-white px-2 py-0.5 rounded border border-[#6B4030]/15" title={courseFormData.image_url}>
                              {courseFormData.image_url}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <input
                              ref={changeFileInputRef}
                              type="file"
                              accept="image/png, image/jpeg, image/webp"
                              onChange={handleFileUpload}
                              className="hidden"
                              disabled={uploadingImage}
                            />
                            <button
                              type="button"
                              onClick={() => changeFileInputRef.current?.click()}
                              disabled={uploadingImage}
                              className="px-2.5 py-1 rounded-lg bg-[#4A2C20] hover:bg-[#603929] text-[#F7F2E8] text-[10.5px] font-bold transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                              {uploadingImage ? (
                                <Loader2 className="w-3 h-3 animate-spin text-[#B89555]" />
                              ) : (
                                <RefreshCw className="w-3 h-3 text-[#B89555]" />
                              )}
                              <span>Change Image</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setCourseFormData((prev) => ({ ...prev, image_url: '' }));
                                setUploadError('');
                              }}
                              className="px-2.5 py-1 rounded-lg border border-red-300 bg-white hover:bg-red-50 text-red-700 text-[10.5px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3 text-red-600" />
                              <span>Remove Image</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {uploadError && (
                        <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{uploadError}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* CARD 4: SEATS CAPACITY & BOOKING MANAGEMENT (Requirement 7) */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#6B4030]/15 space-y-3">
                <div className="flex items-center justify-between border-b border-[#6B4030]/10 pb-1.5">
                  <span className="text-xs font-bold text-[#4A2C20] uppercase tracking-wide">
                    4. Seat Capacity &amp; Booking Management
                  </span>
                  <span className="text-[10.5px] text-[#6B4030] font-medium">
                    Available = Total − Confirmed Bookings
                  </span>
                </div>

                {(() => {
                  const currentCourse = courses.find((c) => c.id === editingCourseId);
                  const confirmedBookings = currentCourse?.booked_seats || 0;
                  const totalSeatsVal = Number(courseFormData.seats_total) || 0;
                  const calculatedAvailable = Math.max(0, totalSeatsVal - confirmedBookings);
                  const isBelowConfirmed = modalMode === 'edit' && totalSeatsVal < confirmedBookings;

                  return (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                        {/* Total Seats Input */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="block font-medium text-[#4A2C20] text-xs">
                              Total Batch Seats <span className="text-red-600">*</span>
                            </label>
                            <span className="text-[10px] text-[#6B4030]/70 font-number">Max 500</span>
                          </div>
                          <input
                            type="number"
                            name="seats_total"
                            value={courseFormData.seats_total}
                            onChange={(e) => {
                              const newTotal = parseInt(e.target.value, 10) || 0;
                              setCourseFormData((prev) => ({
                                ...prev,
                                seats_total: e.target.value,
                                seats_available: Math.max(0, newTotal - confirmedBookings),
                              }));
                            }}
                            placeholder="50"
                            min={modalMode === 'edit' ? confirmedBookings : 1}
                            max="500"
                            required
                            className={`w-full px-3 py-2 rounded-xl border text-xs text-[#241A16] font-number focus:outline-hidden cursor-text select-text ${
                              isBelowConfirmed
                                ? 'border-red-500 bg-red-50 text-red-700'
                                : 'border-[#6B4030]/20 bg-[#FAF7F0]/40 focus:border-[#B89555]'
                            }`}
                          />
                          {isBelowConfirmed ? (
                            <p className="text-[10px] text-red-600 font-bold leading-tight">
                              ⚠️ Cannot reduce below {confirmedBookings} confirmed bookings!
                            </p>
                          ) : (
                            <p className="text-[10px] text-[#6B4030]">
                              {modalMode === 'edit' && confirmedBookings > 0
                                ? `Minimum allowed: ${confirmedBookings} seats`
                                : 'Batch capacity limit'}
                            </p>
                          )}
                        </div>

                        {/* Confirmed Bookings (Read-only) */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="block font-medium text-[#4A2C20] text-xs">Confirmed Bookings</label>
                            <span className="text-[10px] text-[#6B4030]/70">Students</span>
                          </div>
                          <div className="w-full px-3 py-2 rounded-xl border border-[#6B4030]/15 bg-[#FAF7F0] text-xs font-number font-bold text-[#4A2C20] flex items-center justify-between">
                            <span>{confirmedBookings} Booked</span>
                            <Users className="w-3.5 h-3.5 text-[#B89555]" />
                          </div>
                          <p className="text-[10px] text-[#6B4030]">From student applications</p>
                        </div>

                        {/* Available Seats (Auto-calculated) */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="block font-medium text-[#4A2C20] text-xs">Available Seats</label>
                            <span className="text-[10px] text-[#6B4030]/70 font-number">Dynamic</span>
                          </div>
                          <div
                            className={`w-full px-3 py-2 rounded-xl border text-xs font-number font-bold flex items-center justify-between ${
                              calculatedAvailable === 0
                                ? 'bg-red-50 border-red-300 text-red-700'
                                : calculatedAvailable <= 5
                                ? 'bg-amber-50 border-amber-300 text-amber-800'
                                : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            }`}
                          >
                            <span>{calculatedAvailable} Seats Left</span>
                            <span
                              className={`text-[9.5px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                                calculatedAvailable === 0
                                  ? 'bg-red-200 text-red-800'
                                  : calculatedAvailable <= 5
                                  ? 'bg-amber-200 text-amber-900'
                                  : 'bg-emerald-200 text-emerald-900'
                              }`}
                            >
                              {calculatedAvailable === 0
                                ? 'Full'
                                : calculatedAvailable <= 5
                                ? 'Almost Full'
                                : 'Available'}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#6B4030]">Total ({totalSeatsVal}) − Booked ({confirmedBookings})</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
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
