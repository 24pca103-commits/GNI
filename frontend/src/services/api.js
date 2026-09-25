const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Register a new user at Global Nagas Institute
 * @param {Object} userData - { fullName, email, mobileNumber, password, confirmPassword }
 * @returns {Promise<Object>}
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
    // Network or server unreachable error
    const netErr = new Error('Unable to connect to the server. Please ensure the backend is running and try again.');
    netErr.errors = { general: 'Network connection error' };
    throw netErr;
  }
};

/**
 * Get institute live status and statistics
 * @returns {Promise<Object>}
 */
export const getInstituteStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/status`);
    if (!response.ok) throw new Error('Status fetch failed');
    return await response.json();
  } catch (err) {
    console.warn('Status endpoint unavailable, using default institute stats');
    return {
      stats: { totalEnrolled: 1250, liveRegistrations: 1 },
    };
  }
};
