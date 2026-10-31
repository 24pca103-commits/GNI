import { DEFAULT_PILLARS } from '../data/pillarData';
import { DEFAULT_COURSES } from '../data/coursesData';

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined') {
    // Relative '/api' routes via Vite dev proxy on port 5173 or directly on port 5000/production
    return '/api';
  }
  return 'https://api.globalnagasinstitute.com/api';
};

const API_BASE_URL = getApiBaseUrl();

// Safe fetch with built-in timeout to prevent browser network timeouts / unresponsiveness
async function fetchWithTimeout(url, options = {}, timeoutMs = 4000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

/**
 * Check Real-time Registration Status & Eligibility for Email and/or Phone
 */
export const checkRegistrationEligibility = async ({ email = '', phone = '', courseName = '' } = {}) => {
  try {
    const params = new URLSearchParams();
    if (email) params.append('email', email);
    if (phone) params.append('phone', phone);
    if (courseName) params.append('courseName', courseName);

    const response = await fetchWithTimeout(`${API_BASE_URL}/check-registration?${params.toString()}`, {}, 3500);
    if (!response.ok) {
      return { success: true, eligible: true };
    }
    return await response.json();
  } catch (err) {
    console.warn('[checkRegistrationEligibility] Fallback / timeout:', err.message);
    return { success: true, eligible: true };
  }
};

export const checkEmailEligibility = async (email, courseName = '') => {
  return checkRegistrationEligibility({ email, courseName });
};

/**
 * Register a new user at Global Nagas Institute
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Registration failed');
      error.errors = data.errors || {};
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.status) throw error;
    const netErr = new Error('Unable to connect to the server. Please ensure the backend is running and try again.');
    netErr.errors = { general: 'Network connection error' };
    throw netErr;
  }
};

/**
 * Get active courses for public website
 */
export const fetchActiveCourses = async () => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/courses`, {}, 4000);
    if (!response.ok) throw new Error('Failed to fetch courses');
    const data = await response.json();
    return data.data || [];
  } catch (err) {
    console.warn('[API] Courses fetch failed, checking localStorage or defaults:', err.message);
    const local = localStorage.getItem('gni_custom_courses');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.filter((c) => c.is_active);
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_COURSES.filter((c) => c.is_active);
  }
};

/**
 * Public: Get approved course pricing & durations configuration
 */
export const fetchPricingConfig = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/pricing-config`);
    if (!response.ok) throw new Error('Failed to fetch pricing config');
    const data = await response.json();
    return data.data || [];
  } catch (err) {
    console.warn('[API] Pricing config fetch error:', err.message);
    return null;
  }
};

/**
 * Public: Request server-side trusted course fee calculation
 */
export const calculateCourseFee = async (courseName, duration) => {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/calculate-fee`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseName, duration }),
    });
    if (!response.ok) throw new Error('Failed to calculate course fee');
    const data = await response.json();
    return data.data || null;
  } catch (err) {
    console.warn('[API] Dynamic fee calculation error:', err.message);
    return null;
  }
};

/**
 * Admin: Get all courses (active + inactive)
 */
export const fetchAllCourses = async () => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/courses/all`, {}, 4000);
    if (!response.ok) throw new Error('Failed to fetch all courses');
    const data = await response.json();
    return data.data || [];
  } catch (err) {
    console.warn('[API] Admin all courses fetch error:', err.message);
    const local = localStorage.getItem('gni_custom_courses');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_COURSES;
  }
};

/**
 * Admin: Create a new course
 */
export const createCourse = async (courseData) => {
  const response = await fetch(`${API_BASE_URL}/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courseData),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to create course');
  return result;
};

/**
 * Admin: Update course & discount offers
 */
export const updateCourse = async (id, courseData) => {
  const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courseData),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to update course');
  return result;
};

/**
 * Admin: Toggle course status
 */
export const toggleCourseStatus = async (id, is_active) => {
  const response = await fetch(`${API_BASE_URL}/courses/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_active }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to change course status');
  return result;
};

/**
 * Admin: Delete course
 */
export const deleteCourse = async (id) => {
  const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
    method: 'DELETE',
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to delete course');
  return result;
};

/**
 * Admin: Get student registrations
 */
export const fetchAdminRegistrations = async (search = '', skill = '') => {
  try {
    const q = new URLSearchParams();
    if (search) q.append('search', search);
    if (skill) q.append('skill', skill);
    const response = await fetchWithTimeout(`${API_BASE_URL}/admin/registrations?${q.toString()}`, {}, 4000);
    if (!response.ok) throw new Error('Failed to fetch registrations');
    const data = await response.json();
    return data.data || [];
  } catch (err) {
    console.warn('[API] Admin registrations fetch error:', err.message);
    return [];
  }
};

/**
 * Admin: Get dashboard stats
 */
export const fetchAdminStats = async () => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/admin/stats`, {}, 4000);
    if (!response.ok) throw new Error('Failed to fetch stats');
    const data = await response.json();
    return data.data || { totalRegistrations: 0, totalCourses: 4, activeOffers: 4 };
  } catch (err) {
    return { totalRegistrations: 0, totalCourses: 4, activeOffers: 4 };
  }
};

/**
 * Admin Login: Step 1 (Credential verification & request OTP)
 */
export const adminLogin = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Authentication failed');
  return data;
};

/**
 * Admin Login: Step 2 (Verify OTP & receive auth token)
 */
export const verifyAdminLoginOtp = async (otpSessionId, otp) => {
  const response = await fetch(`${API_BASE_URL}/admin/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ otpSessionId, otp }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'OTP verification failed');
  return data;
};

/**
 * Admin Login: Resend OTP
 */
export const resendAdminLoginOtp = async (otpSessionId) => {
  const response = await fetch(`${API_BASE_URL}/admin/resend-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ otpSessionId }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to resend OTP');
  return data;
};

/**
 * Admin Forgot Password: Step 1 (Request reset OTP)
 */
export const adminForgotPassword = async (email) => {
  const response = await fetch(`${API_BASE_URL}/admin/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to initiate password reset');
  return data;
};

/**
 * Admin Forgot Password: Step 2 (Verify reset OTP & get resetToken)
 */
export const verifyAdminResetOtp = async (resetSessionId, otp) => {
  const response = await fetch(`${API_BASE_URL}/admin/verify-reset-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resetSessionId, otp }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Reset code verification failed');
  return data;
};

/**
 * Admin Forgot Password: Step 3 (Submit new password)
 */
export const resetAdminPassword = async (resetToken, newPassword) => {
  const response = await fetch(`${API_BASE_URL}/admin/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resetToken, newPassword }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Password update failed');
  return data;
};

/**
 * Admin: Update student application status
 */
export const updateRegistrationStatus = async (id, status) => {
  const response = await fetch(`${API_BASE_URL}/admin/registrations/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update application status');
  return data;
};

/**
 * Admin: Delete a student registration record
 */
export const deleteRegistration = async (id) => {
  const response = await fetch(`${API_BASE_URL}/admin/registrations/${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to delete registration');
  return data;
};

/**
 * Upload an offering image file to the server
 */
export const uploadOfferingImage = async (base64Image, filename = 'image.jpg') => {
  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image, filename }),
    });
    if (response.ok) {
      const data = await response.json();
      if (data && data.url) return data;
    }
  } catch (err) {
    console.warn('[uploadOfferingImage] Server upload endpoint unavailable, using base64 directly:', err.message);
  }
  // Safe client fallback: return the base64 data URL directly so image is never lost
  return { success: true, url: base64Image };
};

/**
 * Resend student registration confirmation email
 */
export const resendConfirmationEmail = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/resend-confirmation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to resend confirmation email');
  return data;
};

/**
 * Admin: Send course/workshop broadcast update email to enrolled students
 */
export const notifyCourseStudents = async (courseId, payload) => {
  const response = await fetch(`${API_BASE_URL}/admin/courses/${courseId}/notify-students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to notify course students');
  return data;
};

/**
 * Public & Admin: Fetch all Heritage Skill Pillars
 */
export const fetchPillars = async () => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/pillars`, {}, 4000);
    if (!response.ok) {
      console.warn(`[API] /pillars returned status ${response.status}, using default pillars.`);
      const local = localStorage.getItem('gni_custom_pillars');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (_) {}
      }
      return DEFAULT_PILLARS;
    }
    const data = await response.json();
    return data.data && data.data.length > 0 ? data.data : DEFAULT_PILLARS;
  } catch (err) {
    console.warn('[API] Pillars fetch fallback:', err.message);
    const local = localStorage.getItem('gni_custom_pillars');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (_) {}
    }
    return DEFAULT_PILLARS;
  }
};

/**
 * Admin: Create a new Heritage Skill Pillar
 */
export const createPillar = async (pillarData) => {
  const response = await fetch(`${API_BASE_URL}/pillars`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pillarData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to create pillar');
  return data;
};

/**
 * Admin: Update an existing Heritage Skill Pillar
 */
export const updatePillar = async (id, pillarData) => {
  const response = await fetch(`${API_BASE_URL}/pillars/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pillarData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update pillar');
  return data;
};

/**
 * Admin: Delete a Heritage Skill Pillar
 */
export const deletePillar = async (id) => {
  const response = await fetch(`${API_BASE_URL}/pillars/${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to delete pillar');
  return data;
};

/**
 * Public: Fetch approved feedbacks for user page
 */
export const fetchPublicFeedbacks = async () => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/feedbacks`, {}, 3000);
    if (!response.ok) throw new Error('Failed to fetch feedbacks');
    const data = await response.json();
    return data.data || [];
  } catch (err) {
    console.warn('[API] Feedbacks fetch warning:', err.message);
    return [];
  }
};

/**
 * Public: Submit user review / feedback
 */
export const submitFeedback = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/feedbacks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to submit feedback');
  return data;
};

/**
 * Admin: Fetch all feedbacks (approved, pending, rejected)
 */
export const fetchAdminFeedbacks = async () => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/feedbacks/admin`, {}, 4000);
    if (!response.ok) throw new Error('Failed to fetch admin feedbacks');
    const data = await response.json();
    return data.data || [];
  } catch (err) {
    console.warn('[API] Admin feedbacks fetch error:', err.message);
    return [];
  }
};

/**
 * Admin: Update feedback status ('approved' | 'rejected' | 'pending')
 */
export const updateFeedbackStatus = async (id, status) => {
  const response = await fetch(`${API_BASE_URL}/feedbacks/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update feedback status');
  return data;
};

/**
 * Admin: Delete a feedback entry
 */
export const deleteFeedback = async (id) => {
  const response = await fetch(`${API_BASE_URL}/feedbacks/${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to delete feedback');
  return data;
};

export default {
  checkRegistrationEligibility,
  checkEmailEligibility,
  registerUser,
  resendConfirmationEmail,
  fetchActiveCourses,
  fetchPricingConfig,
  calculateCourseFee,
  fetchAllCourses,
  createCourse,
  updateCourse,
  toggleCourseStatus,
  deleteCourse,
  fetchPillars,
  createPillar,
  updatePillar,
  deletePillar,
  fetchPublicFeedbacks,
  submitFeedback,
  fetchAdminFeedbacks,
  updateFeedbackStatus,
  deleteFeedback,
  fetchAdminRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
  notifyCourseStudents,
  fetchAdminStats,
  adminLogin,
  verifyAdminLoginOtp,
  resendAdminLoginOtp,
  adminForgotPassword,
  verifyAdminResetOtp,
  resetAdminPassword,
  uploadOfferingImage,
};
