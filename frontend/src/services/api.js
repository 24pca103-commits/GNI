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
 * Admin Login
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

export default {
  registerUser,
  fetchActiveCourses,
  fetchAllCourses,
  createCourse,
  updateCourse,
  toggleCourseStatus,
  deleteCourse,
  fetchAdminRegistrations,
  fetchAdminStats,
  adminLogin,
};
