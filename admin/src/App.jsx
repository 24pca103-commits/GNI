import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Users,
  Tag,
  DollarSign,
  Search,
  Download,
  LogOut,
  Sparkles,
  Layers,
  Eye,
  EyeOff,
  Flame,
  Globe,
  ExternalLink,
  Server,
  RefreshCw,
  KeyRound,
  ShieldCheck,
  Check,
  ChevronRight,
  Database,
  Radio,
} from 'lucide-react';
import {
  adminLogin,
  fetchAllCourses,
  createCourse,
  updateCourse,
  toggleCourseStatus,
  deleteCourse,
  fetchAdminRegistrations,
  fetchAdminStats,
  API_BASE_URL,
} from './services/api';

const DEFAULT_IMAGES = [
  { label: 'Natural Mineral Pigments', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80' },
  { label: 'Sacred Epigraphy & Manuscripts', url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&auto=format&fit=crop&q=80' },
  { label: 'Lost-Wax Metallurgy & Sculpture', url: 'https://images.unsplash.com/photo-1569172122301-bc500f309134?w=800&auto=format&fit=crop&q=80' },
  { label: 'Heritage Interiors & Architecture', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80' },
  { label: 'Traditional Artisan Workshop', url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80' },
];

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('admin@globalnagas.org');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'registrations' | 'host'

  // Data State
  const [courses, setCourses] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [apiOnline, setApiOnline] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState('All');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // Form State for Add / Edit
  const [courseForm, setCourseForm] = useState({
    title: '',
    category: 'Painting & Natural Pigments',
    badge: 'Special Masterclass',
    duration: '60 Days',
    mode: 'Studio Hands-on',
    original_price: 9999,
    discount_price: 4999,
    description: '',
    highlights: '',
    image_url: DEFAULT_IMAGES[0].url,
    seats_total: 50,
    seats_available: 25,
  });

  const notify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Check persisted login session
  useEffect(() => {
    const savedToken = localStorage.getItem('gni_admin_token');
    const savedUser = localStorage.getItem('gni_admin_user');
    if (savedToken && savedUser) {
      try {
        setAdminUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (_) {
        setIsAuthenticated(false);
      }
    }
  }, []);

  // Fetch data on login
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [fetchedCourses, fetchedRegs, fetchedStats] = await Promise.all([
        fetchAllCourses().catch(() => []),
        fetchAdminRegistrations().catch(() => []),
        fetchAdminStats().catch(() => null),
      ]);
      setCourses(fetchedCourses || []);
      setRegistrations(fetchedRegs || []);
      setStats(fetchedStats);
      setApiOnline(true);
    } catch (err) {
      console.error('Error loading admin dashboard:', err);
      setApiOnline(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const data = await adminLogin({ email: loginEmail, password: loginPassword });
      setAdminUser(data.admin || { name: 'Faculty Administrator', email: loginEmail });
      setIsAuthenticated(true);
      notify('Welcome back, Administrator!');
    } catch (err) {
      setLoginError(err.message || 'Login failed. Check credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('gni_admin_token');
    localStorage.removeItem('gni_admin_user');
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  // Calculate discount percentage
  const calcDiscountPercent = (orig, disc) => {
    const o = Number(orig) || 0;
    const d = Number(disc) || 0;
    if (o <= 0 || d >= o) return 0;
    return Math.round(((o - d) / o) * 100);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCourseForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    const discount_percent = calcDiscountPercent(courseForm.original_price, courseForm.discount_price);
    const payload = {
      ...courseForm,
      original_price: Number(courseForm.original_price),
      discount_price: Number(courseForm.discount_price),
      discount_percent,
      seats_total: Number(courseForm.seats_total),
      seats_available: Number(courseForm.seats_available),
    };

    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, payload);
        notify('Course & Discount Offer updated successfully!');
      } else {
        await createCourse(payload);
        notify('New Course published successfully to user website!');
      }
      setShowAddModal(false);
      setEditingCourse(null);
      loadDashboardData();
    } catch (err) {
      notify('Error saving course: ' + err.message, 'error');
    }
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title || '',
      category: course.category || 'Painting & Natural Pigments',
      badge: course.badge || 'Special Masterclass',
      duration: course.duration || '60 Days',
      mode: course.mode || 'Studio Hands-on',
      original_price: course.original_price || 9999,
      discount_price: course.discount_price || 4999,
      description: course.description || '',
      highlights: course.highlights || '',
      image_url: course.image_url || DEFAULT_IMAGES[0].url,
      seats_total: course.seats_total || 50,
      seats_available: course.seats_available || 25,
    });
    setShowAddModal(true);
  };

  const handleToggleStatus = async (course) => {
    const nextStatus = course.is_active ? 0 : 1;
    try {
      await toggleCourseStatus(course.id, nextStatus);
      notify(`Course is now ${nextStatus ? 'Live on Website' : 'Hidden from Website'}`);
      loadDashboardData();
    } catch (err) {
      notify('Failed to change status: ' + err.message, 'error');
    }
  };

  const handleDeleteCourse = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from the catalog?`)) {
      return;
    }
    try {
      await deleteCourse(id);
      notify('Course removed successfully');
      loadDashboardData();
    } catch (err) {
      notify('Failed to delete course: ' + err.message, 'error');
    }
  };

  const exportRegistrationsCSV = () => {
    if (registrations.length === 0) {
      notify('No registrations to export', 'error');
      return;
    }
    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Country', 'Location', 'Profession', 'Skill Pillar', 'Experience', 'Payment Ref', 'Date'];
    const rows = registrations.map((r) => [
      r.id || '',
      `"${r.fullName || ''}"`,
      r.email || '',
      `"${r.fullPhone || r.phone || ''}"`,
      r.country || 'India',
      `"${r.location || ''}"`,
      `"${r.profession || ''}"`,
      `"${r.interestedSkill || ''}"`,
      r.experienceLevel || '',
      `"${r.paymentRef || ''}"`,
      r.created_at ? new Date(r.created_at).toLocaleDateString() : '',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GNI_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify('Registrations CSV exported successfully!');
  };

  // Filtered registrations
  const filteredRegistrations = registrations.filter((r) => {
    const matchesSearch =
      (r.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.phone || '').includes(searchTerm);
    const matchesSkill = filterSkill === 'All' || r.interestedSkill === filterSkill;
    return matchesSearch && matchesSkill;
  });

  // Calculate live host port and public client target
  const currentHost = window.location.host;
  const publicWebsiteUrl =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:5173'
      : 'https://globalnagasinstitute.in';

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#18110D] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans-brand">
        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#B89555]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#6B4030]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-md w-full bg-[#241A16] border border-[#B89555]/30 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative z-10">
          {/* Logo & Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#4A2C20] border border-[#B89555]/40 text-[#B89555] shadow-inner mb-2">
              <Sparkles className="w-7 h-7 animate-pulse" />
            </div>
            <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#F7F2E8]">
              Faculty &amp; Admin Host
            </h1>
            <p className="text-xs text-[#B89555] font-medium tracking-wide uppercase">
              Global Nagas Institute • Standalone Host
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-[#F7F2E8]/70 mt-1">
              <Server className="w-3 h-3 text-emerald-400" />
              <span>Current Host: <strong className="text-emerald-400 font-mono">{currentHost}</strong></span>
            </div>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#F7F2E8]/80 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18110D] border border-[#6B4030]/60 text-white text-xs focus:border-[#B89555] focus:outline-hidden transition-colors"
                placeholder="admin@globalnagas.org"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F7F2E8]/80 mb-1">
                Security Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#18110D] border border-[#6B4030]/60 text-white text-xs focus:border-[#B89555] focus:outline-hidden transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#B89555] to-[#c8a565] text-[#241A16] font-semibold text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              {loginLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Secure Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-[11px] text-[#F7F2E8]/60">
            <span>Pre-filled credentials available</span>
            <a
              href={publicWebsiteUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#B89555] hover:underline inline-flex items-center gap-1"
            >
              <span>User Site</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#18110D] text-[#F7F2E8] flex flex-col font-sans-brand">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl border text-xs font-medium flex items-center gap-2 transition-all ${
            notification.type === 'error'
              ? 'bg-red-950 border-red-500/50 text-red-200'
              : 'bg-[#241A16] border-[#B89555] text-[#F7F2E8]'
          }`}
        >
          {notification.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#B89555]" />
          )}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Top Navbar for Standalone Host */}
      <header className="sticky top-0 z-40 bg-[#241A16]/95 backdrop-blur-md border-b border-[#B89555]/20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          {/* Brand & Host Identifier */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#4A2C20] border border-[#B89555]/40 text-[#B89555] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-brand text-lg font-bold text-white tracking-wide">
                  Global Nagas Institute
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#B89555]/20 text-[#B89555] border border-[#B89555]/40">
                  Admin Host
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#F7F2E8]/60">
                <span className="flex items-center gap-1 font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {currentHost}
                </span>
                <span>•</span>
                <span>API: <strong className="font-mono text-[#B89555]">{API_BASE_URL}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Actions & User Controls */}
          <div className="flex items-center gap-3">
            <a
              href={publicWebsiteUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-[#F7F2E8] border border-white/10 transition-colors"
            >
              <span>View User Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#B89555]" />
            </a>

            <button
              onClick={loadDashboardData}
              title="Refresh Data"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#F7F2E8] border border-white/10 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#B89555]' : ''}`} />
            </button>

            <div className="h-6 w-px bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="text-right hidden md:block">
                <p className="text-xs font-semibold text-white leading-tight">
                  {adminUser?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-[#B89555] leading-tight">
                  {adminUser?.email || 'admin@globalnagas.org'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5 flex gap-2 pt-1">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'courses'
                ? 'border-[#B89555] text-[#B89555]'
                : 'border-transparent text-[#F7F2E8]/60 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Courses &amp; Discount Management</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/10 text-white font-mono">
              {courses.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('registrations')}
            className={`px-4 py-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'registrations'
                ? 'border-[#B89555] text-[#B89555]'
                : 'border-transparent text-[#F7F2E8]/60 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Student Registrations</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/10 text-white font-mono">
              {registrations.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('host')}
            className={`px-4 py-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'host'
                ? 'border-[#B89555] text-[#B89555]'
                : 'border-transparent text-[#F7F2E8]/60 hover:text-white'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Standalone Host Settings</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-[#241A16] border border-[#6B4030]/30 shadow-md">
            <div className="flex items-center justify-between text-[#B89555] mb-1">
              <span className="text-xs font-semibold">Total Programs</span>
              <BookOpen className="w-4 h-4" />
            </div>
            <p className="font-serif-brand text-2xl sm:text-3xl font-bold text-white">
              {courses.length}
            </p>
            <span className="text-[11px] text-emerald-400 font-medium">
              {courses.filter((c) => c.is_active).length} Active on Website
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#241A16] border border-[#6B4030]/30 shadow-md">
            <div className="flex items-center justify-between text-amber-400 mb-1">
              <span className="text-xs font-semibold">Active Offers</span>
              <Flame className="w-4 h-4" />
            </div>
            <p className="font-serif-brand text-2xl sm:text-3xl font-bold text-white">
              {courses.filter((c) => c.discount_price < c.original_price).length}
            </p>
            <span className="text-[11px] text-amber-300 font-medium">
              Up to 50% discount running
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#241A16] border border-[#6B4030]/30 shadow-md">
            <div className="flex items-center justify-between text-blue-400 mb-1">
              <span className="text-xs font-semibold">Student Applicants</span>
              <Users className="w-4 h-4" />
            </div>
            <p className="font-serif-brand text-2xl sm:text-3xl font-bold text-white">
              {registrations.length}
            </p>
            <span className="text-[11px] text-blue-300 font-medium">
              Verified submissions
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#241A16] border border-[#6B4030]/30 shadow-md">
            <div className="flex items-center justify-between text-emerald-400 mb-1">
              <span className="text-xs font-semibold">Host Status</span>
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <p className="font-mono text-sm sm:text-base font-bold text-emerald-400 truncate">
              {currentHost}
            </p>
            <span className="text-[11px] text-[#F7F2E8]/60 font-medium">
              Standalone Port 5174
            </span>
          </div>
        </div>

        {/* TAB 1: COURSES & DISCOUNT MANAGEMENT */}
        {activeTab === 'courses' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#241A16] p-4 rounded-2xl border border-[#6B4030]/30">
              <div>
                <h2 className="font-serif-brand text-xl font-bold text-white">
                  Courses &amp; Promotional Discount Offers
                </h2>
                <p className="text-xs text-[#F7F2E8]/70">
                  Manage heritage programs, custom cohorts, and customize discount offers. All changes reflect live on the user website.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingCourse(null);
                  setCourseForm({
                    title: '',
                    category: 'Painting & Natural Pigments',
                    badge: 'Special Masterclass',
                    duration: '60 Days',
                    mode: 'Studio Hands-on',
                    original_price: 9999,
                    discount_price: 4999,
                    description: '',
                    highlights: '',
                    image_url: DEFAULT_IMAGES[0].url,
                    seats_total: 50,
                    seats_available: 25,
                  });
                  setShowAddModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#B89555] hover:bg-[#c8a565] text-[#241A16] font-semibold text-xs flex items-center gap-1.5 shadow-md transition-transform active:scale-95 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Course</span>
              </button>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => {
                const discount = calcDiscountPercent(course.original_price, course.discount_price);
                return (
                  <div
                    key={course.id}
                    className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-200 ${
                      course.is_active
                        ? 'bg-[#241A16] border-[#6B4030]/50 hover:border-[#B89555]/50 shadow-md'
                        : 'bg-[#1e1512] border-white/5 opacity-70'
                    }`}
                  >
                    <div>
                      {/* Image Banner */}
                      <div className="relative h-44 w-full bg-[#18110D]">
                        <img
                          src={course.image_url || DEFAULT_IMAGES[0].url}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#241A16] via-transparent to-black/40" />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                          <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-[#B89555] text-[#241A16] shadow-sm">
                            {course.badge || 'Masterclass'}
                          </span>
                          {discount > 0 && (
                            <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-amber-500 text-black flex items-center gap-1 shadow-sm">
                              <Flame className="w-3 h-3 fill-current" />
                              {discount}% OFF
                            </span>
                          )}
                        </div>

                        {/* Visibility Status */}
                        <div className="absolute top-2.5 right-2.5">
                          <button
                            onClick={() => handleToggleStatus(course)}
                            title={course.is_active ? 'Click to hide from website' : 'Click to make live'}
                            className={`px-2 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                              course.is_active
                                ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                                : 'bg-neutral-900/90 border border-neutral-600 text-neutral-400'
                            }`}
                          >
                            {course.is_active ? (
                              <>
                                <Eye className="w-3 h-3 text-emerald-400" />
                                <span>Live</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3 text-neutral-400" />
                                <span>Hidden</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-white/90">
                          <span className="font-semibold uppercase tracking-wider text-[#B89555]">
                            {course.category}
                          </span>
                          <span>{course.duration}</span>
                        </div>
                      </div>

                      {/* Details Content */}
                      <div className="p-4 space-y-3">
                        <h3 className="font-serif-brand text-lg font-bold text-white leading-tight">
                          {course.title}
                        </h3>

                        <p className="text-xs text-[#F7F2E8]/75 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>

                        {/* Discount Offer Price Display */}
                        <div className="p-2.5 rounded-xl bg-[#18110D] border border-white/5 flex items-baseline justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-[#B89555] block">
                              Discounted Fee
                            </span>
                            <div className="flex items-baseline gap-2">
                              <span className="font-serif-brand text-xl font-bold text-white">
                                ₹{Number(course.discount_price || 0).toLocaleString('en-IN')}
                              </span>
                              {Number(course.original_price) > Number(course.discount_price) && (
                                <span className="text-xs text-[#F7F2E8]/50 line-through">
                                  ₹{Number(course.original_price).toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-[#F7F2E8]/60 block">Seats Remaining</span>
                            <span className="text-xs font-bold text-emerald-400">
                              {course.seats_available || 15} / {course.seats_total || 50}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="p-3 bg-[#1c130f] border-t border-white/5 flex items-center justify-between">
                      <span className="text-[11px] text-[#F7F2E8]/50">
                        ID: #{course.id}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(course)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#B89555] border border-[#B89555]/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit / Offer</span>
                        </button>

                        <button
                          onClick={() => handleDeleteCourse(course.id, course.title)}
                          className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-500/30 transition-colors cursor-pointer"
                          title="Delete Course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: STUDENT REGISTRATIONS */}
        {activeTab === 'registrations' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#241A16] p-4 rounded-2xl border border-[#6B4030]/30">
              <div>
                <h2 className="font-serif-brand text-xl font-bold text-white">
                  Enrolled Students &amp; Cohort Applications
                </h2>
                <p className="text-xs text-[#F7F2E8]/70">
                  Total {registrations.length} verified applications submitted through the public website.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={exportRegistrationsCSV}
                  className="px-3.5 py-2 rounded-xl bg-[#B89555] hover:bg-[#c8a565] text-[#241A16] font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export to CSV</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative sm:col-span-2">
                <Search className="w-4 h-4 text-[#F7F2E8]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by student name, email, or phone number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#241A16] border border-[#6B4030]/40 text-xs text-white placeholder-white/40 focus:border-[#B89555] focus:outline-hidden"
                />
              </div>

              <select
                value={filterSkill}
                onChange={(e) => setFilterSkill(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-[#241A16] border border-[#6B4030]/40 text-xs text-white focus:border-[#B89555] focus:outline-hidden"
              >
                <option value="All">All Skill Pillars</option>
                <option value="Painting & Natural Mineral Pigments">Painting & Natural Pigments</option>
                <option value="Libi – Language, Scripts & Epigraphy">Libi & Epigraphy</option>
                <option value="Sculpturing & Sacred Nagas Metal Art">Sculpturing & Metal Art</option>
                <option value="Heritage Applications & Interior Crafts">Heritage Applications</option>
              </select>
            </div>

            {/* Registrations Table */}
            <div className="rounded-2xl bg-[#241A16] border border-[#6B4030]/40 overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#18110D] border-b border-white/10 text-[#B89555] uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Location &amp; Profession</th>
                      <th className="py-3 px-4">Cohort Selected</th>
                      <th className="py-3 px-4">Payment Reference</th>
                      <th className="py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-[#F7F2E8]/50">
                          No matching registrations found.
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((reg) => (
                        <tr key={reg.id || Math.random()} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-semibold text-white block">{reg.fullName}</span>
                            <span className="text-[10px] text-[#B89555]">{reg.experienceLevel || 'Beginner'}</span>
                          </td>
                          <td className="py-3 px-4 text-[#F7F2E8]/80 space-y-0.5">
                            <div>{reg.email}</div>
                            <div className="font-mono text-[11px] text-[#B89555]">{reg.fullPhone || reg.phone}</div>
                          </td>
                          <td className="py-3 px-4 text-[#F7F2E8]/80">
                            <div>{reg.location || '-'}</div>
                            <div className="text-[10px] text-[#F7F2E8]/50">{reg.profession || '-'}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded-md bg-[#4A2C20] text-[#B89555] font-medium text-[11px]">
                              {reg.interestedSkill}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {reg.paymentRef ? (
                              <span className="font-mono text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                                {reg.paymentRef}
                              </span>
                            ) : (
                              <span className="text-[11px] text-amber-400/80 italic">Startupwala Link</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-[#F7F2E8]/60 text-[11px]">
                            {reg.created_at ? new Date(reg.created_at).toLocaleDateString() : 'Recent'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STANDALONE HOST SETTINGS & DEPLOYMENT GUIDE */}
        {activeTab === 'host' && (
          <div className="space-y-6">
            <div className="bg-[#241A16] p-6 rounded-2xl border border-[#B89555]/30 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#4A2C20] border border-[#B89555]/40 text-[#B89555] flex items-center justify-center">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif-brand text-xl font-bold text-white">
                    Standalone Host &amp; Architecture Overview
                  </h2>
                  <p className="text-xs text-[#F7F2E8]/70">
                    This admin panel runs independently from the main public user application.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#18110D] border border-white/10 space-y-1">
                  <span className="text-[11px] text-[#B89555] font-semibold uppercase">Admin Panel Host</span>
                  <p className="font-mono text-sm font-bold text-white">{currentHost}</p>
                  <p className="text-[11px] text-emerald-400">Independent Port 5174</p>
                </div>

                <div className="p-4 rounded-xl bg-[#18110D] border border-white/10 space-y-1">
                  <span className="text-[11px] text-[#B89555] font-semibold uppercase">Target API Backend</span>
                  <p className="font-mono text-sm font-bold text-white">{API_BASE_URL}</p>
                  <p className="text-[11px] text-emerald-400">Node/Express Server (Port 5000 / Production)</p>
                </div>

                <div className="p-4 rounded-xl bg-[#18110D] border border-white/10 space-y-1">
                  <span className="text-[11px] text-[#B89555] font-semibold uppercase">Public User Website Host</span>
                  <p className="font-mono text-sm font-bold text-white">{publicWebsiteUrl}</p>
                  <p className="text-[11px] text-blue-400">Separately Hosted Client</p>
                </div>
              </div>
            </div>

            {/* Production Deployment Instructions */}
            <div className="bg-[#241A16] p-6 rounded-2xl border border-white/10 space-y-4">
              <h3 className="font-serif-brand text-lg font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#B89555]" />
                <span>How to Host Admin Panel on a Separate Subdomain or Server</span>
              </h3>

              <div className="space-y-3 text-xs text-[#F7F2E8]/80 leading-relaxed">
                <div className="p-3.5 rounded-xl bg-[#18110D] border border-white/5 space-y-1.5">
                  <strong className="text-white text-xs block">Option A: Host on Hostinger Subdomain (e.g. admin.globalnagasinstitute.in)</strong>
                  <p>1. In Hostinger hPanel, create a Subdomain: <code className="text-[#B89555]">admin.globalnagasinstitute.in</code>.</p>
                  <p>2. Build the admin bundle: <code className="text-[#B89555]">npm run build --prefix admin</code>.</p>
                  <p>3. Upload the generated <code className="text-[#B89555]">admin/dist</code> contents into the subdomain's <code className="text-[#B89555]">public_html/admin</code> folder.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#18110D] border border-white/5 space-y-1.5">
                  <strong className="text-white text-xs block">Option B: Run as a Standalone Node / Vite Service</strong>
                  <p>Start standalone dev server: <code className="text-[#B89555]">npm run dev:admin</code> (Serves on <code className="text-[#B89555]">http://localhost:5174</code>).</p>
                  <p>Build command: <code className="text-[#B89555]">npm run build:admin</code>.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: ADD / EDIT COURSE & DISCOUNT OFFER */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#241A16] border border-[#B89555]/40 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-serif-brand text-xl font-bold text-white">
                  {editingCourse ? 'Edit Course & Discount Offer' : 'Add New Heritage Course'}
                </h3>
                <p className="text-xs text-[#F7F2E8]/60">
                  Customized parameters will dynamically display on the public website.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingCourse(null);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#F7F2E8]/80 mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={courseForm.title}
                    onChange={handleFormChange}
                    required
                    placeholder="e.g. Master Sculpting & Lost-Wax Bronze Metallurgy"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#18110D] border border-white/10 text-xs text-white focus:border-[#B89555] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F7F2E8]/80 mb-1">
                    Heritage Category
                  </label>
                  <select
                    name="category"
                    value={courseForm.category}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 rounded-xl bg-[#18110D] border border-white/10 text-xs text-white focus:border-[#B89555] focus:outline-hidden"
                  >
                    <option value="Painting & Natural Pigments">Painting & Natural Pigments</option>
                    <option value="Libi & Epigraphy">Libi & Epigraphy</option>
                    <option value="Sculpturing & Metal Art">Sculpturing & Metal Art</option>
                    <option value="Heritage Applications">Heritage Applications</option>
                    <option value="Master Guild Apprenticeship">Master Guild Apprenticeship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F7F2E8]/80 mb-1">
                    Badge / Tag
                  </label>
                  <input
                    type="text"
                    name="badge"
                    value={courseForm.badge}
                    onChange={handleFormChange}
                    placeholder="e.g. Bestseller Cohort / Special Masterclass"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#18110D] border border-white/10 text-xs text-white focus:border-[#B89555] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F7F2E8]/80 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={courseForm.duration}
                    onChange={handleFormChange}
                    placeholder="e.g. 60 Days / 8 Weeks"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#18110D] border border-white/10 text-xs text-white focus:border-[#B89555] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F7F2E8]/80 mb-1">
                    Learning Mode
                  </label>
                  <input
                    type="text"
                    name="mode"
                    value={courseForm.mode}
                    onChange={handleFormChange}
                    placeholder="e.g. Studio Hands-on & Forge"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#18110D] border border-white/10 text-xs text-white focus:border-[#B89555] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Pricing & Discount Offer Box */}
              <div className="p-4 rounded-2xl bg-[#18110D] border border-[#B89555]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Pricing &amp; Discount Offer Settings
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30">
                    {calcDiscountPercent(courseForm.original_price, courseForm.discount_price)}% Discount Applied
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#F7F2E8]/80 mb-1">
                      Original Price (₹)
                    </label>
                    <input
                      type="number"
                      name="original_price"
                      value={courseForm.original_price}
                      onChange={handleFormChange}
                      required
                      min="0"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#241A16] border border-white/10 text-xs text-white focus:border-[#B89555] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#F7F2E8]/80 mb-1">
                      Discounted / Offer Price (₹)
                    </label>
                    <input
                      type="number"
                      name="discount_price"
                      value={courseForm.discount_price}
                      onChange={handleFormChange}
                      required
                      min="0"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#241A16] border border-white/10 text-xs text-emerald-400 font-bold focus:border-[#B89555] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F7F2E8]/80 mb-1">
                  Course Description *
                </label>
                <textarea
                  name="description"
                  value={courseForm.description}
                  onChange={handleFormChange}
                  required
                  rows="2"
                  placeholder="Comprehensive description of the curriculum, ancient origins, and practical skills learned..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#18110D] border border-white/10 text-xs text-white focus:border-[#B89555] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F7F2E8]/80 mb-1">
                  Key Highlights (semicolon-separated)
                </label>
                <input
                  type="text"
                  name="highlights"
                  value={courseForm.highlights}
                  onChange={handleFormChange}
                  placeholder="Raw mineral grinding; Lost-wax furnace casting; Take-home certificate"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#18110D] border border-white/10 text-xs text-white focus:border-[#B89555] focus:outline-hidden"
                />
              </div>

              {/* Quick Image Picker */}
              <div>
                <label className="block text-xs font-semibold text-[#F7F2E8]/80 mb-1">
                  Image Banner URL
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={courseForm.image_url}
                  onChange={handleFormChange}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#18110D] border border-white/10 text-xs text-white focus:border-[#B89555] focus:outline-hidden mb-2"
                />
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {DEFAULT_IMAGES.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCourseForm((prev) => ({ ...prev, image_url: img.url }))}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border whitespace-nowrap transition-colors cursor-pointer ${
                        courseForm.image_url === img.url
                          ? 'bg-[#B89555] text-[#241A16] border-[#B89555] font-semibold'
                          : 'bg-white/5 text-[#F7F2E8]/70 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#F7F2E8]/80 mb-1">
                    Total Seats
                  </label>
                  <input
                    type="number"
                    name="seats_total"
                    value={courseForm.seats_total}
                    onChange={handleFormChange}
                    min="1"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#18110D] border border-white/10 text-xs text-white focus:border-[#B89555] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#F7F2E8]/80 mb-1">
                    Seats Available
                  </label>
                  <input
                    type="number"
                    name="seats_available"
                    value={courseForm.seats_available}
                    onChange={handleFormChange}
                    min="0"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#18110D] border border-white/10 text-xs text-white focus:border-[#B89555] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCourse(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#B89555] hover:bg-[#c8a565] text-[#241A16] font-semibold text-xs transition-transform active:scale-95 cursor-pointer shadow-md"
                >
                  {editingCourse ? 'Save Changes' : 'Publish Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
