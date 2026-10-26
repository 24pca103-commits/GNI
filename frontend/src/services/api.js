const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000/api';
    }
    // In production on Hostinger or custom domain
    return '/api';
  }
  return 'https://api.globalnagasinstitute.in/api';
};

const API_BASE_URL = getApiBaseUrl();

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
    const response = await fetch(`${API_BASE_URL}/courses`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    const data = await response.json();
    return data.data || [];
  } catch (err) {
    console.warn('[API] Courses fetch failed, checking localStorage or defaults:', err.message);
    const local = localStorage.getItem('gni_custom_courses');
    if (local) {
      try {
        return JSON.parse(local).filter((c) => c.is_active);
      } catch (e) {
        // fallback
      }
    }
    return null;
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
    const response = await fetch(`${API_BASE_URL}/courses/all`);
    if (!response.ok) throw new Error('Failed to fetch all courses');
    const data = await response.json();
    return data.data || [];
  } catch (err) {
    console.warn('[API] Admin all courses fetch error:', err.message);
    const local = localStorage.getItem('gni_custom_courses');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        // fallback
      }
    }
    return null;
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
    const response = await fetch(`${API_BASE_URL}/admin/registrations?${q.toString()}`);
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
    const response = await fetch(`${API_BASE_URL}/admin/stats`);
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
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image, filename }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Image upload failed');
  return data;
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

export default {
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
