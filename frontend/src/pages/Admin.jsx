import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OfferingEditor from '../components/admin/OfferingEditor';
import AdminShell from '../components/admin/AdminShell';
import OfferingsView from '../components/admin/OfferingsView';
import ApplicationsView from '../components/admin/ApplicationsView';
import { statusGroup } from '../components/admin/adminFormat';
import FeedbackView from '../components/admin/FeedbackView';
import { getOfferingKind } from '../utils/offerings';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';
import {
  fetchAllCourses,
  toggleCourseStatus,
  deleteCourse,
  fetchAdminRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
  adminLogin,
  verifyAdminLoginOtp,
  resendAdminLoginOtp,
  adminForgotPassword,
  verifyAdminResetOtp,
  resetAdminPassword,
  fetchAdminFeedbacks,
  updateFeedbackStatus,
  deleteFeedback,
} from '../services/api';

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

  // Dashboard section: 'courses' | 'registrations' | 'feedbacks'
  const [activeTab, setActiveTab] = useState('courses');

  // Courses state
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);

  // Student Registrations state
  const [registrations, setRegistrations] = useState([]);
  const [regLoading, setRegLoading] = useState(false);

  // Status messages (feedback moderation), shown as a toast
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    if (!formError && !formSuccess) return undefined;
    const t = setTimeout(() => {
      setFormError('');
      setFormSuccess('');
    }, 4000);
    return () => clearTimeout(t);
  }, [formError, formSuccess]);

  // Student Feedbacks & Testimonials Moderation State
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackActionId, setFeedbackActionId] = useState(null);

  const loadFeedbacks = async () => {
    setFeedbackLoading(true);
    try {
      const data = await fetchAdminFeedbacks();
      if (Array.isArray(data)) {
        setFeedbacks(data);
        localStorage.setItem('gni_feedbacks', JSON.stringify(data));
      }
    } catch (err) {
      console.warn('[Admin] Failed to fetch feedbacks, using local fallback:', err);
      const local = localStorage.getItem('gni_feedbacks');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) setFeedbacks(parsed);
        } catch (_) {}
      }
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleApproveFeedback = async (id) => {
    setFeedbackActionId(id);
    try {
      await updateFeedbackStatus(id, 'approved');
      const updated = feedbacks.map((f) => (String(f.id) === String(id) ? { ...f, status: 'approved' } : f));
      setFeedbacks(updated);
      localStorage.setItem('gni_feedbacks', JSON.stringify(updated));
      setFormSuccess('Feedback approved and published to website!');
    } catch (err) {
      setFormError(err.message || 'Failed to approve feedback.');
    } finally {
      setFeedbackActionId(null);
    }
  };

  const handleRejectFeedback = async (id) => {
    setFeedbackActionId(id);
    try {
      await updateFeedbackStatus(id, 'rejected');
      const updated = feedbacks.map((f) => (String(f.id) === String(id) ? { ...f, status: 'rejected' } : f));
      setFeedbacks(updated);
      localStorage.setItem('gni_feedbacks', JSON.stringify(updated));
      setFormSuccess('Feedback rejected.');
    } catch (err) {
      setFormError(err.message || 'Failed to reject feedback.');
    } finally {
      setFeedbackActionId(null);
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback review?')) return;
    setFeedbackActionId(id);
    try {
      await deleteFeedback(id);
      const updated = feedbacks.filter((f) => String(f.id) !== String(id));
      setFeedbacks(updated);
      localStorage.setItem('gni_feedbacks', JSON.stringify(updated));
      setFormSuccess('Feedback deleted successfully.');
    } catch (err) {
      setFormError(err.message || 'Failed to delete feedback.');
    } finally {
      setFeedbackActionId(null);
    }
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
        // Ensure chronological order so existing canonical offerings are first and new additions are at the end
        const sortedCourses = [...allCourses].sort((a, b) => Number(a.id) - Number(b.id));
        setCourses(sortedCourses);
        localStorage.setItem('gni_custom_courses', JSON.stringify(sortedCourses));
      }
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
    loadFeedbacks();

    const interval = setInterval(() => {
      loadDashboardData();
      if (activeTab === 'registrations') {
        loadRegistrations();
      } else if (activeTab === 'feedbacks') {
        loadFeedbacks();
      }
    }, 12000);

    const onWindowFocus = () => {
      loadDashboardData();
      loadRegistrations();
      loadFeedbacks();
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
      await Promise.all([loadDashboardData(), loadRegistrations(), loadFeedbacks()]);
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
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  // Handle Application Delete
  const handleDeleteRegistration = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the application record for ${name || 'this student'}?`)) {
      return false;
    }
    try {
      await deleteRegistration(id);
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
      return true;
    } catch (err) {
      alert('Failed to delete registration: ' + err.message);
      return false;
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

  // Offering editor (create / edit)
  const [editor, setEditor] = useState(null); // { mode, type, course }

  const handleOpenCreateModal = (initialType = 'workshop') => {
    setEditor({ mode: 'create', type: initialType, course: null });
  };

  const handleOpenEditModal = (course) => {
    setEditor({ mode: 'edit', type: getOfferingKind(course), course });
  };

  const handleOfferingSaved = (savedCourse, mode) => {
    const updated =
      mode === 'create'
        ? [...courses, savedCourse]
        : courses.map((c) => (c.id === savedCourse.id ? savedCourse : c));
    setCourses(updated);
    localStorage.setItem('gni_custom_courses', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    setEditor(null);
    loadDashboardData();
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
    <AdminShell
      active={activeTab}
      onNavigate={(tab) => {
        setActiveTab(tab);
        if (tab === 'registrations') loadRegistrations();
        if (tab === 'feedbacks') loadFeedbacks();
      }}
      badges={{
        courses: { count: courses.length },
        registrations: {
          count: registrations.filter((r) => statusGroup(r.payment_status) === 'pending').length,
          alert: true,
          title: 'Applications awaiting action',
        },
        feedbacks: {
          count: feedbacks.filter((f) => !f.status || f.status === 'pending').length,
          alert: true,
          title: 'Reviews awaiting approval',
        },
      }}
      onSync={handleSyncAllData}
      syncing={isSyncing}
      lastSync={lastSyncTime}
      onLogout={handleLogout}
    >
      {activeTab === 'courses' && (
        <OfferingsView
          courses={courses}
          loading={coursesLoading}
          onCreate={handleOpenCreateModal}
          onEdit={handleOpenEditModal}
          onToggle={handleToggleCourse}
          onDelete={handleDeleteCourse}
        />
      )}

      {activeTab === 'registrations' && (
        <ApplicationsView
          registrations={registrations}
          loading={regLoading}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteRegistration}
        />
      )}

      {activeTab === 'feedbacks' && (
        <FeedbackView
          feedbacks={feedbacks}
          loading={feedbackLoading}
          busyId={feedbackActionId}
          onRefresh={loadFeedbacks}
          onApprove={handleApproveFeedback}
          onReject={handleRejectFeedback}
          onDelete={handleDeleteFeedback}
        />
      )}

      {(formSuccess || formError) && (
        <div
          role="status"
          className={`fixed bottom-5 right-5 z-[70] flex max-w-sm items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg ${
            formError ? 'border-red-200 bg-red-50 text-red-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'
          }`}
        >
          {formError ? <AlertCircle className="h-4 w-4 shrink-0" /> : <CheckCircle2 className="h-4 w-4 shrink-0" />}
          {formError || formSuccess}
        </div>
      )}

      {editor && (
        <OfferingEditor
          key={editor.course?.id || `new-${editor.type}`}
          mode={editor.mode}
          course={editor.course}
          initialType={editor.type}
          bookedSeats={editor.course?.booked_seats || 0}
          onClose={() => setEditor(null)}
          onSaved={handleOfferingSaved}
        />
      )}
    </AdminShell>
  );
}
