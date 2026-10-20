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
  Search,
  Download,
  LogOut,
  Sparkles,
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
  Radio,
  Layers,
  GraduationCap,
  Percent,
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
  { label: 'Sacred Epigraphy & Scripts', url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&auto=format&fit=crop&q=80' },
  { label: 'Lost-Wax Bronze Metallurgy', url: 'https://images.unsplash.com/photo-1569172122301-bc500f309134?w=800&auto=format&fit=crop&q=80' },
  { label: 'Heritage Interiors & Architecture', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80' },
  { label: 'Traditional Artisan Studio', url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80' },
];

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('admin@globalnagas.org');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard Tabs: 'courses' | 'registrations' | 'host'
  const [activeTab, setActiveTab] = useState('courses');

  // Data State
  const [courses, setCourses] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

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
    } catch (err) {
      console.error('Error loading admin dashboard:', err);
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
        notify('Course and Discount Offer updated successfully!');
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

  const filteredRegistrations = registrations.filter((r) => {
    const matchesSearch =
      (r.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.phone || '').includes(searchTerm);
    const matchesSkill = filterSkill === 'All' || r.interestedSkill === filterSkill;
    return matchesSearch && matchesSkill;
  });

  const currentHost = window.location.host;
  const publicWebsiteUrl =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:5173'
      : 'https://globalnagasinstitute.in';

  // LOGIN SCREEN (CLEAN WHITE/LIGHT THEME WITH PROMINENT LOGO)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] flex flex-col justify-center items-center p-4 font-sans-brand relative">
        {/* Subtle decorative background gradient */}
        <div className="absolute inset-0 bg-radial-[at_top_center] from-[#B89555]/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-md w-full bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-9 shadow-[0_10px_40px_rgba(0,0,0,0.06)] relative z-10">
          {/* Logo Placement */}
          <div className="text-center space-y-3 mb-7">
            <div className="flex justify-center mb-1">
              <img
                src="/logo.png"
                alt="Global Nagas Institute"
                className="h-16 sm:h-20 w-auto object-contain hover:scale-105 transition-transform"
              />
            </div>
            <div>
              <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Global Nagas Institute
              </h1>
              <p className="text-xs font-semibold text-[#B89555] uppercase tracking-wider mt-0.5">
                Faculty &amp; Administrator Portal
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] text-slate-600 font-medium">
              <Server className="w-3 h-3 text-emerald-600" />
              <span>Standalone Host: <strong className="font-mono text-slate-800">{currentHost}</strong></span>
            </div>
          </div>

          {loginError && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Admin Email Address
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:border-[#4A2C20] focus:ring-2 focus:ring-[#B89555]/20 focus:outline-hidden transition-all shadow-xs"
                placeholder="admin@globalnagas.org"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Security Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:border-[#4A2C20] focus:ring-2 focus:ring-[#B89555]/20 focus:outline-hidden transition-all shadow-xs"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full mt-2 py-3 rounded-xl bg-[#4A2C20] hover:bg-[#603929] text-white font-semibold text-xs tracking-wider uppercase shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              {loginLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-[#B89555]" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-[#B89555]" />
                  <span>Sign In to Admin Workspace</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-[11.5px] text-slate-500">
            <span>Demo: admin@globalnagas.org</span>
            <a
              href={publicWebsiteUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#4A2C20] hover:text-[#B89555] font-semibold inline-flex items-center gap-1 transition-colors"
            >
              <span>User Site</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // MAIN WHITE-THEMED ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 flex flex-col font-sans-brand">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
            notification.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-white border-emerald-300 text-emerald-900'
          }`}
        >
          {notification.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Top Navbar in Clean Crisp White with Prominent Logo */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-4">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 sm:gap-4">
            <img
              src="/logo.png"
              alt="Global Nagas Institute Logo"
              className="h-10 sm:h-12 w-auto object-contain shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-brand text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">
                  Global Nagas Institute
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#B89555]/15 text-[#8C6B30] border border-[#B89555]/30">
                  Admin Portal
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="flex items-center gap-1 font-mono font-medium text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {currentHost}
                </span>
                <span>•</span>
                <span className="hidden md:inline font-sans">
                  API: <strong className="font-mono text-slate-700">{API_BASE_URL}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions & User Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={publicWebsiteUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors shadow-2xs"
            >
              <span>User Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#B89555]" />
            </a>

            <button
              onClick={loadDashboardData}
              title="Refresh Data"
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer shadow-2xs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#B89555]' : ''}`} />
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            {/* Admin Profile & Logout */}
            <div className="flex items-center gap-2">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {adminUser?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-slate-500 font-medium leading-tight">
                  {adminUser?.email || 'admin@globalnagas.org'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 flex gap-1 sm:gap-2 pt-0.5">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-3.5 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'courses'
                ? 'border-[#4A2C20] text-[#4A2C20]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Courses &amp; Discount Management</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-mono font-bold">
              {courses.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('registrations')}
            className={`px-3.5 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'registrations'
                ? 'border-[#4A2C20] text-[#4A2C20]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Student Registrations</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-mono font-bold">
              {registrations.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('host')}
            className={`px-3.5 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'host'
                ? 'border-[#4A2C20] text-[#4A2C20]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Host Settings</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full space-y-6">
        {/* KPI / Metric Cards in Clean White */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between text-slate-600 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Courses</span>
              <div className="w-8 h-8 rounded-lg bg-[#B89555]/15 text-[#8C6B30] flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <p className="font-serif-brand text-3xl font-bold text-slate-900">
              {courses.length}
            </p>
            <span className="text-xs text-emerald-700 font-semibold mt-0.5 inline-block">
              {courses.filter((c) => c.is_active).length} Active on Website
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between text-slate-600 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Offers</span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <p className="font-serif-brand text-3xl font-bold text-slate-900">
              {courses.filter((c) => c.discount_price < c.original_price).length}
            </p>
            <span className="text-xs text-amber-700 font-semibold mt-0.5 inline-block">
              Special Discounts Running
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between text-slate-600 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Registrations</span>
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="font-serif-brand text-3xl font-bold text-slate-900">
              {registrations.length}
            </p>
            <span className="text-xs text-blue-700 font-semibold mt-0.5 inline-block">
              Enrolled Applicants
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between text-slate-600 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Host Status</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
            </div>
            <p className="font-mono text-sm sm:text-base font-bold text-emerald-700 truncate">
              {currentHost}
            </p>
            <span className="text-xs text-slate-500 font-medium mt-0.5 inline-block">
              Standalone Port 5174
            </span>
          </div>
        </div>

        {/* TAB 1: COURSES & DISCOUNT MANAGEMENT */}
        {activeTab === 'courses' && (
          <div className="space-y-5">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
              <div>
                <h2 className="font-serif-brand text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  Courses &amp; Promotional Discount Management
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add new courses or edit prices and discount offers. All changes sync dynamically to the user site.
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
                className="px-4 py-2.5 rounded-xl bg-[#4A2C20] hover:bg-[#603929] text-white font-semibold text-xs flex items-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 text-[#B89555]" />
                <span>Add New Course</span>
              </button>
            </div>

            {/* Courses Grid in Crisp White Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((course) => {
                const discount = calcDiscountPercent(course.original_price, course.discount_price);
                return (
                  <div
                    key={course.id}
                    className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                      course.is_active ? 'border-slate-200' : 'border-slate-200/60 opacity-75'
                    }`}
                  >
                    <div>
                      {/* Image Thumbnail with Overlay Badges */}
                      <div className="relative h-44 w-full bg-slate-100">
                        <img
                          src={course.image_url || DEFAULT_IMAGES[0].url}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                          <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-[#B89555] text-white shadow-xs">
                            {course.badge || 'Masterclass'}
                          </span>
                          {discount > 0 && (
                            <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-amber-500 text-slate-900 flex items-center gap-1 shadow-xs">
                              <Flame className="w-3 h-3 fill-current" />
                              {discount}% OFF
                            </span>
                          )}
                        </div>

                        {/* Live Status Toggle */}
                        <div className="absolute top-2.5 right-2.5">
                          <button
                            onClick={() => handleToggleStatus(course)}
                            title={course.is_active ? 'Click to hide from website' : 'Click to make live'}
                            className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs ${
                              course.is_active
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-700 text-slate-200'
                            }`}
                          >
                            {course.is_active ? (
                              <>
                                <Eye className="w-3 h-3" />
                                <span>Live</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3" />
                                <span>Hidden</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white/95 font-medium">
                          <span className="font-semibold uppercase tracking-wider text-[#eedfc8]">
                            {course.category}
                          </span>
                          <span>{course.duration}</span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 sm:p-5 space-y-3.5">
                        <h3 className="font-serif-brand text-xl font-bold text-slate-900 leading-snug">
                          {course.title}
                        </h3>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>

                        {/* Pricing & Discount Highlights Box in Soft Amber */}
                        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">
                              Offer Price
                            </span>
                            <div className="flex items-baseline gap-2">
                              <span className="font-serif-brand text-2xl font-bold text-slate-900">
                                ₹{Number(course.discount_price || 0).toLocaleString('en-IN')}
                              </span>
                              {Number(course.original_price) > Number(course.discount_price) && (
                                <span className="text-xs text-slate-500 line-through">
                                  ₹{Number(course.original_price).toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-slate-500 font-semibold block">Seats Left</span>
                            <span className="text-xs font-bold text-emerald-700">
                              {course.seats_available || 15} / {course.seats_total || 50}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-mono">
                        ID: #{course.id}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(course)}
                          className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-xs font-semibold text-[#4A2C20] border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#B89555]" />
                          <span>Edit / Offer</span>
                        </button>

                        <button
                          onClick={() => handleDeleteCourse(course.id, course.title)}
                          className="p-1.5 rounded-lg bg-white hover:bg-red-50 text-red-600 border border-slate-300 hover:border-red-300 transition-colors cursor-pointer"
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

        {/* TAB 2: STUDENT REGISTRATIONS IN CRISP WHITE DATA TABLE */}
        {activeTab === 'registrations' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
              <div>
                <h2 className="font-serif-brand text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  Enrolled Students &amp; Cohort Applications
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Total {registrations.length} verified submissions from the public website.
                </p>
              </div>

              <button
                onClick={exportRegistrationsCSV}
                className="px-4 py-2 rounded-xl bg-[#4A2C20] hover:bg-[#603929] text-white font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4 text-[#B89555]" />
                <span>Export to CSV</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative sm:col-span-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by student name, email, or phone number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:border-[#4A2C20] focus:ring-2 focus:ring-[#B89555]/20 focus:outline-hidden shadow-2xs"
                />
              </div>

              <select
                value={filterSkill}
                onChange={(e) => setFilterSkill(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 font-medium focus:border-[#4A2C20] focus:outline-hidden shadow-2xs cursor-pointer"
              >
                <option value="All">All Skill Pillars</option>
                <option value="Painting & Natural Mineral Pigments">Painting & Natural Pigments</option>
                <option value="Libi – Language, Scripts & Epigraphy">Libi & Epigraphy</option>
                <option value="Sculpturing & Sacred Nagas Metal Art">Sculpturing & Metal Art</option>
                <option value="Heritage Applications & Interior Crafts">Heritage Applications</option>
              </select>
            </div>

            {/* Registrations White Data Table */}
            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10.5px] tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Location &amp; Profession</th>
                      <th className="py-3 px-4">Cohort Selected</th>
                      <th className="py-3 px-4">Payment Ref</th>
                      <th className="py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-10 text-center text-slate-400">
                          No student registrations found.
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((reg) => (
                        <tr key={reg.id || Math.random()} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-900 block">{reg.fullName}</span>
                            <span className="text-[10.5px] text-[#B89555] font-semibold">{reg.experienceLevel || 'Beginner'}</span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 space-y-0.5">
                            <div>{reg.email}</div>
                            <div className="font-mono text-[11px] text-slate-600 font-medium">{reg.fullPhone || reg.phone}</div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-700">
                            <div>{reg.location || '-'}</div>
                            <div className="text-[10.5px] text-slate-400">{reg.profession || '-'}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-[#4A2C20] font-semibold text-[11px] border border-slate-200/80 inline-block">
                              {reg.interestedSkill}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {reg.paymentRef ? (
                              <span className="font-mono text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                                {reg.paymentRef}
                              </span>
                            ) : (
                              <span className="text-[11px] text-amber-700 font-medium">Startupwala Link</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 text-[11px]">
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

        {/* TAB 3: STANDALONE HOST SETTINGS */}
        {activeTab === 'host' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#4A2C20] text-white flex items-center justify-center">
                  <Server className="w-5 h-5 text-[#B89555]" />
                </div>
                <div>
                  <h2 className="font-serif-brand text-xl sm:text-2xl font-bold text-slate-900">
                    Standalone Host &amp; Architecture Overview
                  </h2>
                  <p className="text-xs text-slate-500">
                    This admin application runs on its own independent host, decoupled from the public user client.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Admin Panel Host</span>
                  <p className="font-mono text-sm font-bold text-slate-900">{currentHost}</p>
                  <p className="text-xs text-emerald-700 font-medium">Port 5174 (Standalone)</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Target API Server</span>
                  <p className="font-mono text-sm font-bold text-slate-900">{API_BASE_URL}</p>
                  <p className="text-xs text-emerald-700 font-medium">Express API on Port 5000 / Production</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Public User Site</span>
                  <p className="font-mono text-sm font-bold text-slate-900">{publicWebsiteUrl}</p>
                  <p className="text-xs text-blue-700 font-medium">Port 5173 / Main Domain</p>
                </div>
              </div>
            </div>

            {/* Subdomain Deployment Guide */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-serif-brand text-lg font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#B89555]" />
                <span>Hosting Instructions for Production Subdomain</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <strong className="text-slate-900 text-xs block font-bold">Hostinger Subdomain Setup (e.g. admin.globalnagasinstitute.in)</strong>
                  <p>1. In Hostinger hPanel, create subdomain: <code className="text-[#4A2C20] font-bold">admin.globalnagasinstitute.in</code></p>
                  <p>2. Run build: <code className="text-[#4A2C20] font-bold">npm run build:admin</code></p>
                  <p>3. Upload files from <code className="text-[#4A2C20] font-bold">admin/dist</code> into the subdomain's <code className="text-[#4A2C20] font-bold">public_html</code>.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: ADD / EDIT COURSE IN PURE WHITE WITH STICKY HEADER & FOOTER */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <form
            onSubmit={handleSaveCourse}
            className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Sticky Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-white shrink-0">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Logo" className="h-8 w-auto object-contain" />
                <div>
                  <h3 className="font-serif-brand text-xl font-bold text-slate-900 leading-tight">
                    {editingCourse ? 'Edit Course & Discount Offer' : 'Add New Heritage Course'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Changes will sync live to the public user site.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingCourse(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="overflow-y-auto p-6 space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={courseForm.title}
                    onChange={handleFormChange}
                    required
                    placeholder="e.g. Master Sculpting & Lost-Wax Bronze Metallurgy"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:border-[#4A2C20] focus:ring-2 focus:ring-[#B89555]/20 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Heritage Category
                  </label>
                  <select
                    name="category"
                    value={courseForm.category}
                    onChange={handleFormChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:border-[#4A2C20] focus:outline-hidden cursor-pointer"
                  >
                    <option value="Painting & Natural Pigments">Painting & Natural Pigments</option>
                    <option value="Libi & Epigraphy">Libi & Epigraphy</option>
                    <option value="Sculpturing & Metal Art">Sculpturing & Metal Art</option>
                    <option value="Heritage Applications">Heritage Applications</option>
                    <option value="Master Guild Apprenticeship">Master Guild Apprenticeship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Badge / Tag
                  </label>
                  <input
                    type="text"
                    name="badge"
                    value={courseForm.badge}
                    onChange={handleFormChange}
                    placeholder="e.g. Popular Masterclass / 50% Off Special"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:border-[#4A2C20] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={courseForm.duration}
                    onChange={handleFormChange}
                    placeholder="e.g. 60 Days / 8 Weeks"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:border-[#4A2C20] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Learning Mode
                  </label>
                  <input
                    type="text"
                    name="mode"
                    value={courseForm.mode}
                    onChange={handleFormChange}
                    placeholder="e.g. Studio Hands-on & Forge"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:border-[#4A2C20] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Pricing & Discount Offer Box in Amber Accent */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs uppercase tracking-wider">
                    <Flame className="w-4 h-4 text-amber-600" />
                    <span>Pricing &amp; Discount Offer Settings</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300">
                    {calcDiscountPercent(courseForm.original_price, courseForm.discount_price)}% Discount Applied
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Original Fee (₹)
                    </label>
                    <input
                      type="number"
                      name="original_price"
                      value={courseForm.original_price}
                      onChange={handleFormChange}
                      required
                      min="0"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:border-[#4A2C20] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Offer / Discounted Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="discount_price"
                      value={courseForm.discount_price}
                      onChange={handleFormChange}
                      required
                      min="0"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-emerald-400 text-xs text-emerald-700 font-bold focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Course Description *
                </label>
                <textarea
                  name="description"
                  value={courseForm.description}
                  onChange={handleFormChange}
                  required
                  rows="2"
                  placeholder="Overview of the curriculum, historical foundations, and practical techniques..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:border-[#4A2C20] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Key Takeaways / Highlights (semicolon-separated)
                </label>
                <input
                  type="text"
                  name="highlights"
                  value={courseForm.highlights}
                  onChange={handleFormChange}
                  placeholder="Raw mineral grinding; Lost-wax furnace casting; Mastercraft certificate"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:border-[#4A2C20] focus:outline-hidden"
                />
              </div>

              {/* Image Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Image Banner URL
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={courseForm.image_url}
                  onChange={handleFormChange}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:border-[#4A2C20] focus:outline-hidden mb-2"
                />
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {DEFAULT_IMAGES.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCourseForm((prev) => ({ ...prev, image_url: img.url }))}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border whitespace-nowrap transition-colors cursor-pointer ${
                        courseForm.image_url === img.url
                          ? 'bg-[#4A2C20] text-white border-[#4A2C20] font-bold'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Total Seats
                  </label>
                  <input
                    type="number"
                    name="seats_total"
                    value={courseForm.seats_total}
                    onChange={handleFormChange}
                    min="1"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:border-[#4A2C20] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Seats Available
                  </label>
                  <input
                    type="number"
                    name="seats_available"
                    value={courseForm.seats_available}
                    onChange={handleFormChange}
                    min="0"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:border-[#4A2C20] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-3.5 border-t border-slate-200 bg-slate-50 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingCourse(null);
                }}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-300 transition-colors cursor-pointer shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#4A2C20] hover:bg-[#603929] text-white font-bold text-xs shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
              >
                {editingCourse ? 'Save Changes' : 'Publish Course'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
