import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  Eye,
  EyeOff,
  Hammer,
  ImageIcon,
  Loader2,
  MapPin,
  Monitor,
  Plus,
  Tag,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
import { createCourse, fetchPillars, updateCourse, uploadOfferingImage } from '../../services/api';
import { WorkshopDetail } from '../WorkshopSection';
import { JourneyDetail } from '../LearningJourney';
import {
  evenDayRanges,
  getDayCount,
  getOfferingKind,
  parseDetails,
  parseJourneyPhases,
  parseWorkshopModules,
} from '../../utils/offerings';
import {
  DAY_RANGE,
  LIMITS,
  MAX_MODULES,
  MAX_PHASES,
  MAX_PRICE,
  MAX_SEATS,
  MAX_SPECS,
  MAX_TAKEAWAYS,
  PRESET_IMAGES,
} from './offeringLimits';

/* ------------------------------------------------------------------ */
/* Small form primitives                                               */
/* ------------------------------------------------------------------ */

const inputBase =
  'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#241A16] placeholder:text-[#6B4030]/40 transition-colors focus:outline-none focus:ring-2 cursor-text select-text';
const inputOk = 'border-[#6B4030]/20 focus:border-[#B89555] focus:ring-[#B89555]/20';
const inputBad = 'border-red-500 bg-red-50 focus:border-red-600 focus:ring-red-200';

function inputClass(error, extra = '') {
  return `${inputBase} ${error ? inputBad : inputOk} ${extra}`;
}

function Counter({ value, limit }) {
  if (!limit) return null;
  const len = String(value ?? '').length;
  const over = len > limit.max;
  const under = len > 0 && len < limit.min;
  const near = !over && len >= limit.max * 0.9;
  return (
    <span
      className={`text-[11px] tabular-nums ${
        over || under ? 'text-red-600 font-semibold' : near ? 'text-amber-700 font-semibold' : 'text-[#6B4030]/60'
      }`}
    >
      {len}/{limit.max}
    </span>
  );
}

function Field({ label, required, optional, hint, value, limit, error, children, htmlFor }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-end justify-between gap-3">
        <label htmlFor={htmlFor} className="text-[13px] font-semibold text-[#241A16]">
          {label}
          {required && <span className="text-red-600"> *</span>}
          {optional && <span className="ml-1 font-normal text-[#6B4030]/60">(optional)</span>}
        </label>
        <Counter value={value} limit={limit} />
      </div>
      {children}
      {error ? (
        <p className="flex items-start gap-1.5 text-xs font-medium text-red-600">
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : (
        hint && <p className="text-xs leading-relaxed text-[#6B4030]/80">{hint}</p>
      )}
    </div>
  );
}

function Section({ id, number, icon: Icon, title, description, children }) {
  return (
    <section id={`oe-section-${id}`} className="scroll-mt-4 rounded-2xl border border-[#6B4030]/12 bg-white">
      <header className="flex items-start gap-3 border-b border-[#6B4030]/10 px-5 py-4 sm:px-6">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#4A2C20] text-[#E5B869]">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h3 className="text-[15px] font-bold text-[#241A16]">
            <span className="mr-1.5 text-[#B89555]">{number}.</span>
            {title}
          </h3>
          <p className="mt-0.5 text-xs leading-relaxed text-[#6B4030]">{description}</p>
        </div>
      </header>
      <div className="space-y-5 px-5 py-5 sm:px-6">{children}</div>
    </section>
  );
}

function IconButton({ onClick, title, children, tone = 'neutral', disabled }) {
  const tones = {
    neutral: 'text-[#6B4030] hover:bg-[#FAF7F0] hover:text-[#241A16]',
    danger: 'text-red-500 hover:bg-red-50 hover:text-red-700',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      disabled={disabled}
      className={`rounded-lg p-1.5 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

function AddButton({ onClick, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-[#B89555]/70 bg-[#FAF7F0] px-3.5 py-2 text-xs font-semibold text-[#4A2C20] transition-colors hover:border-[#B89555] hover:bg-[#F3EBDC] cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Plus className="h-3.5 w-3.5 text-[#B89555]" />
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* State helpers                                                       */
/* ------------------------------------------------------------------ */

const dayLabel = (start, end) => (start === end ? `Day ${start}` : `Day ${start}–${end}`);

function splitDuration(duration) {
  const days = getDayCount(duration);
  const label = String(duration || '')
    .replace(/^\s*\d+\s*days?\b/i, '')
    .trim();
  return { days: days ?? '', label: days ? label : '' };
}

function buildDuration(days, label) {
  const n = Number(days);
  return `${n} ${n === 1 ? 'Day' : 'Days'}${label.trim() ? ` ${label.trim()}` : ''}`;
}

function phasesFromCourse(course, totalDays) {
  return parseJourneyPhases(course?.highlights, totalDays).map((p) => {
    const nums = String(p.period).match(/\d+/g) || [];
    const start = nums[0] ? Number(nums[0]) : '';
    const end = nums[1] ? Number(nums[1]) : start;
    return {
      start,
      end,
      title: p.title,
      details: p.details,
      outcome: p.outcome,
      materials: p.materials.join(', '),
    };
  });
}

function initialState(course, type) {
  const kind = course ? getOfferingKind(course) : type;
  const { days, label } = splitDuration(course?.duration);
  const details = parseDetails(course?.details);
  const modules = course && kind === 'workshop' ? parseWorkshopModules(course.highlights) : [];
  return {
    type: kind,
    title: course?.title || '',
    badge: course?.badge || '',
    pillar_id: course?.pillar_id ? String(course.pillar_id) : '',
    description: course?.description || '',
    days: days === '' ? (kind === 'workshop' ? 1 : '') : days,
    durationLabel: label,
    mode: course?.mode || '',
    original_price: course ? Number(course.original_price) || '' : '',
    discount_price: course ? Number(course.discount_price) || '' : '',
    seats_total: course ? Number(course.seats_total) || '' : '',
    image_url: course?.image_url || '',
    is_active: course ? (Number(course.is_active) ? 1 : 0) : 1,
    modules: modules.length ? modules : [{ day: '', title: '', desc: '' }],
    phases: course && kind === 'journey' ? phasesFromCourse(course, getDayCount(course.duration)) : [],
    inclusions: details.inclusions,
    specs: details.specs,
    takeaways: details.takeaways,
    field_visit: details.field_visit,
  };
}

const len = (v) => String(v ?? '').trim().length;

function checkText(errors, key, value, limit, label, required) {
  const n = len(value);
  if (required && n === 0) errors[key] = `${label} is required.`;
  else if (n > 0 && n < limit.min) errors[key] = `${label} needs at least ${limit.min} characters (${n} now).`;
  else if (n > limit.max) errors[key] = `${label} must be ${limit.max} characters or fewer (${n} now). Please shorten it.`;
}

function validate(s, bookedSeats) {
  const e = {};
  const range = DAY_RANGE[s.type];
  checkText(e, 'title', s.title, LIMITS.title, 'Title', true);
  checkText(e, 'badge', s.badge, LIMITS.badge, 'Badge', false);
  checkText(e, 'description', s.description, LIMITS.description, 'Description', true);
  checkText(e, 'mode', s.mode, LIMITS.mode, 'Learning format', true);
  checkText(e, 'durationLabel', s.durationLabel, LIMITS.durationLabel, 'Duration label', false);

  const days = Number(s.days);
  if (!Number.isInteger(days) || days < range.min || days > range.max) {
    e.days =
      s.type === 'workshop'
        ? `Workshops run 1–9 days. For 10 days or more, switch the type to Learning Journey.`
        : `Learning journeys run 10–365 days. For shorter courses, switch the type to Workshop.`;
  }

  const offer = Number(s.discount_price);
  const regular = Number(s.original_price);
  if (!offer || offer <= 0) e.discount_price = 'Enter the fee students pay (greater than ₹0).';
  else if (offer > MAX_PRICE) e.discount_price = `Fee cannot exceed ₹${MAX_PRICE.toLocaleString('en-IN')}.`;
  if (s.original_price !== '' && regular > 0 && offer > regular)
    e.original_price = 'Regular fee must be equal to or higher than the offer fee.';
  if (regular > MAX_PRICE) e.original_price = `Fee cannot exceed ₹${MAX_PRICE.toLocaleString('en-IN')}.`;

  const seats = Number(s.seats_total);
  if (!Number.isInteger(seats) || seats < 1 || seats > MAX_SEATS) e.seats_total = `Enter total seats between 1 and ${MAX_SEATS}.`;
  else if (seats < bookedSeats) e.seats_total = `Cannot be lower than the ${bookedSeats} seats already booked.`;

  if (s.type === 'workshop') {
    const filled = s.modules.filter((m) => len(m.title) || len(m.desc) || len(m.day));
    if (filled.length === 0) e.modules = 'Add at least one step with a title.';
    s.modules.forEach((m, i) => {
      if (!(len(m.title) || len(m.desc) || len(m.day))) return;
      checkText(e, `modules.${i}.title`, m.title, LIMITS.moduleTitle, 'Step title', true);
      checkText(e, `modules.${i}.desc`, m.desc, LIMITS.moduleDesc, 'Step description', false);
      checkText(e, `modules.${i}.day`, m.day, LIMITS.moduleDay, 'Day / session', false);
    });
  } else {
    if (s.phases.length === 0) e.phases = 'Add at least one phase to the roadmap.';
    let prevEnd = 0;
    s.phases.forEach((p, i) => {
      checkText(e, `phases.${i}.title`, p.title, LIMITS.phaseTitle, 'Phase title', true);
      checkText(e, `phases.${i}.details`, p.details, LIMITS.phaseDetails, 'What is covered', true);
      checkText(e, `phases.${i}.outcome`, p.outcome, LIMITS.phaseOutcome, 'Outcome', false);
      checkText(e, `phases.${i}.materials`, p.materials, LIMITS.phaseMaterials, 'Materials', false);
      const start = Number(p.start);
      const end = Number(p.end);
      if (!start || !end || end < start) e[`phases.${i}.days`] = 'Enter a valid day range (end day ≥ start day).';
      else if (Number.isInteger(days) && end > days) e[`phases.${i}.days`] = `Ends after the last day of the journey (Day ${days}).`;
      else if (start <= prevEnd) e[`phases.${i}.days`] = `Overlaps the previous phase. Start from Day ${prevEnd + 1}.`;
      if (end) prevEnd = Math.max(prevEnd, end);
    });
  }

  checkText(e, 'inclusions', s.inclusions, LIMITS.inclusions, 'Fee inclusions', false);
  s.specs.forEach((sp, i) => {
    checkText(e, `specs.${i}.label`, sp.label, LIMITS.specLabel, 'Label', true);
    checkText(e, `specs.${i}.value`, sp.value, LIMITS.specValue, 'Value', true);
  });
  s.takeaways.forEach((t, i) => checkText(e, `takeaways.${i}`, t, LIMITS.takeaway, 'Item', true));
  if (s.type === 'journey' && s.field_visit.enabled) {
    checkText(e, 'fv.title', s.field_visit.title, LIMITS.fieldVisitTitle, 'Banner title', false);
    checkText(e, 'fv.description', s.field_visit.description, LIMITS.fieldVisitDescription, 'Field visit description', true);
  }
  return e;
}

const SECTION_OF = (key) => {
  if (/^(title|badge|description|mode|days|durationLabel)$/.test(key)) return 'basics';
  if (/^(original_price|discount_price|seats_total)$/.test(key)) return 'pricing';
  if (/^(modules|phases)/.test(key)) return 'curriculum';
  return 'details';
};

/** Full-screen preview using the same components as the public website. */
function PreviewPage({ course, isJourney, onClose, onSave, saveLabel }) {
  const bg = isJourney ? '#F7F2E8' : '#FAF7F0';
  return (
    <div className="fixed inset-0 z-[70] flex flex-col" style={{ backgroundColor: bg }} role="dialog" aria-modal="true" aria-label="Website preview">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[#6B4030]/15 bg-[#241A16] px-5 py-3 text-[#F7F2E8] sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
            <Monitor className="h-4 w-4 text-[#E5B869]" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Website preview</p>
            <p className="truncate text-xs text-[#F7F2E8]/60">
              How this {isJourney ? 'learning journey' : 'workshop'} will look. Nothing is saved until you click {saveLabel.toLowerCase()}.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-3.5 py-2 text-sm font-semibold text-[#F7F2E8] hover:bg-white/10 cursor-pointer"
          >
            <X className="h-4 w-4" />
            Back to editing
          </button>
          <button
            type="button"
            onClick={onSave}
            className="rounded-xl bg-[#B89555] px-4 py-2 text-sm font-bold text-[#241A16] hover:bg-[#C9A666] cursor-pointer"
          >
            {saveLabel}
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        <section className="gni-offering py-10 md:py-14" style={{ '--picker-bg': bg }}>
          <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:space-y-8 lg:px-8">
            {isJourney ? <JourneyDetail course={course} preview /> : <WorkshopDetail course={course} preview />}
          </div>
        </section>
      </div>
    </div>
  );
}

/** Shape the editor state into the course record that is saved (and previewed). */
function buildPayload(state, pillars, bookedSeats) {
  const pillar = pillars.find((p) => String(p.id) === String(state.pillar_id));
  const seatsTotal = Number(state.seats_total);
  const highlights = (state.type === 'journey')
    ? state.phases.map((p) => ({
        period: dayLabel(Number(p.start), Number(p.end)),
        title: p.title.trim(),
        details: p.details.trim(),
        outcome: p.outcome.trim(),
        materials: p.materials
          .split(',')
          .map((m) => m.trim())
          .filter(Boolean),
      }))
    : state.modules
        .filter((m) => len(m.title))
        .map((m, i) => ({
          step: String(i + 1).padStart(2, '0'),
          day: m.day.trim(),
          title: m.title.trim(),
          desc: m.desc.trim(),
        }));

  const payload = {
    title: state.title.trim(),
    category: (state.type === 'journey') ? 'Learning Journey' : 'Workshop',
    offering_type: state.type,
    badge: state.badge.trim(),
    duration: buildDuration(state.days, state.durationLabel),
    mode: state.mode.trim(),
    description: state.description.trim(),
    original_price: Number(state.original_price) || Number(state.discount_price),
    discount_price: Number(state.discount_price),
    seats_total: seatsTotal,
    seats_available: Math.max(0, seatsTotal - bookedSeats),
    image_url: state.image_url.trim() || ((state.type === 'journey') ? '/artisan/pedagogy-practice.jpg' : '/artisan/workshop.jpg'),
    is_active: state.is_active,
    pillar_id: pillar ? Number(pillar.id) : null,
    pillar_title: pillar ? pillar.title : '',
    highlights: JSON.stringify(highlights),
    details: {
      inclusions: state.inclusions.trim(),
      specs: state.specs.map((sp) => ({ label: sp.label.trim(), value: sp.value.trim() })),
      takeaways: state.takeaways.map((t) => t.trim()),
      field_visit: (state.type === 'journey')
        ? {
            enabled: state.field_visit.enabled,
            title: state.field_visit.title.trim(),
            description: state.field_visit.description.trim(),
          }
        : { enabled: false, title: '', description: '' },
    },
  };

  return payload;
}

/* ------------------------------------------------------------------ */
/* Editor                                                              */
/* ------------------------------------------------------------------ */

export default function OfferingEditor({ mode, course, initialType = 'workshop', bookedSeats = 0, onClose, onSaved }) {
  const [state, setState] = useState(() => initialState(course, initialType));
  const [snapshot] = useState(() => JSON.stringify(initialState(course, initialType)));
  const [pillars, setPillars] = useState([]);
  const [showErrors, setShowErrors] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [saved, setSaved] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [imageMode, setImageMode] = useState('upload');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef(null);

  const errors = useMemo(() => validate(state, bookedSeats), [state, bookedSeats]);
  const err = (key) => (showErrors ? errors[key] : undefined);
  const errorCount = Object.keys(errors).length;
  const sectionHasError = (id) => showErrors && Object.keys(errors).some((k) => SECTION_OF(k) === id);
  const isDirty = JSON.stringify(state) !== snapshot;
  const days = Number(state.days) || 0;
  const isJourney = state.type === 'journey';

  useEffect(() => {
    fetchPillars()
      .then((list) => setPillars(Array.isArray(list) ? list : []))
      .catch(() => setPillars([]));
  }, []);

  // Lock page scroll while the editor is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const requestClose = () => {
    if (saving) return;
    if (isDirty && !saved && !window.confirm('Discard your unsaved changes?')) return;
    onClose();
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (previewOpen) setPreviewOpen(false);
      else requestClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const set = (key, value) => setState((s) => ({ ...s, [key]: value }));
  const setItem = (listKey, index, key, value) =>
    setState((s) => ({
      ...s,
      [listKey]: s[listKey].map((item, i) => (i === index ? (key === null ? value : { ...item, [key]: value }) : item)),
    }));
  const removeItem = (listKey, index) => setState((s) => ({ ...s, [listKey]: s[listKey].filter((_, i) => i !== index) }));
  const moveItem = (listKey, index, dir) =>
    setState((s) => {
      const list = [...s[listKey]];
      const target = index + dir;
      if (target < 0 || target >= list.length) return s;
      [list[index], list[target]] = [list[target], list[index]];
      return { ...s, [listKey]: list };
    });

  const switchType = (type) => {
    if (type === state.type) return;
    setState((s) => ({
      ...s,
      type,
      days: type === 'workshop' ? 1 : 30,
      modules: s.modules.length ? s.modules : [{ day: '', title: '', desc: '' }],
      phases: s.phases,
    }));
  };

  /* ---- journey phase helpers ---- */
  const lastEnd = state.phases.reduce((m, p) => Math.max(m, Number(p.end) || 0), 0);
  const addPhase = () => {
    if (!days) return;
    const start = Math.min(lastEnd + 1, days);
    const end = Math.min(start + 9, days);
    setState((s) => ({
      ...s,
      phases: [...s.phases, { start, end, title: '', details: '', outcome: '', materials: '' }],
    }));
  };
  const spreadDays = () => {
    const ranges = evenDayRanges(days, state.phases.length);
    setState((s) => ({
      ...s,
      phases: s.phases.map((p, i) => {
        const nums = ranges[i].match(/\d+/g) || [];
        return { ...p, start: Number(nums[0]), end: Number(nums[1] || nums[0]) };
      }),
    }));
  };

  /* ---- image upload ---- */
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return setUploadError('Image is larger than 5 MB. Please choose a smaller file.');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
      return setUploadError('Please choose a JPG, PNG or WEBP image.');
    setUploadError('');
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      let url = reader.result;
      try {
        const res = await uploadOfferingImage(reader.result, file.name);
        if (res?.url) url = res.url;
      } catch (_) {
        // Server upload unavailable: keep the inline image
      }
      set('image_url', url);
      setUploading(false);
    };
    reader.onerror = () => {
      setUploadError('Could not read that file. Please try another image.');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  /* ---- save ---- */
  const scrollTo = (id) =>
    document.getElementById(`oe-section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const handleSave = async () => {
    setShowErrors(true);
    setSubmitError('');
    const keys = Object.keys(errors);
    if (keys.length) {
      scrollTo(SECTION_OF(keys[0]));
      return;
    }

    const payload = buildPayload(state, pillars, bookedSeats);

    setSaving(true);
    try {
      let savedCourse;
      if (mode === 'create') {
        const res = await createCourse(payload);
        savedCourse = res?.data || payload;
      } else {
        await updateCourse(course.id, payload);
        savedCourse = { ...course, ...payload };
      }
      setSaved(true);
      setTimeout(() => onSaved(savedCourse, mode), 700);
    } catch (e) {
      setSubmitError(e.message || 'Saving failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  /* ---- derived values ---- */
  const offer = Number(state.discount_price) || 0;
  const regular = Number(state.original_price) || 0;
  const savePercent = regular > offer && offer > 0 ? Math.round(((regular - offer) / regular) * 100) : 0;
  const seatsTotal = Number(state.seats_total) || 0;
  const durationPreview = days ? buildDuration(days, state.durationLabel) : '';

  const nav = [
    { id: 'basics', label: 'Basics' },
    { id: 'pricing', label: 'Fee & seats' },
    { id: 'image', label: 'Cover image' },
    { id: 'curriculum', label: isJourney ? 'Roadmap' : 'Steps' },
    { id: 'details', label: 'Customer details' },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-stretch justify-center bg-[#241A16]/60 backdrop-blur-sm sm:p-4" role="dialog" aria-modal="true" aria-labelledby="offering-editor-title">
      <div className="flex w-full max-w-6xl flex-col overflow-hidden bg-[#F7F2E8] shadow-2xl sm:rounded-3xl">
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[#6B4030]/15 bg-white px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#B89555]">
              {mode === 'create' ? 'New offering' : 'Edit offering'}
            </p>
            <h2 id="offering-editor-title" className="truncate font-['Cormorant_Garamond'] text-2xl font-bold text-[#241A16]">
              {state.title.trim() || (isJourney ? 'Untitled learning journey' : 'Untitled workshop')}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-[#4A2C20] bg-[#4A2C20] px-3.5 py-1.5 text-xs font-semibold text-[#F7F2E8] hover:bg-[#603929] cursor-pointer"
              title="See how this offering will look on the website"
            >
              <Monitor className="h-3.5 w-3.5 text-[#E5B869]" />
              Preview
            </button>
            <button
              type="button"
              onClick={() => set('is_active', state.is_active ? 0 : 1)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                state.is_active
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                  : 'border-[#6B4030]/20 bg-[#FAF7F0] text-[#6B4030]'
              }`}
              title="Choose whether this offering is visible on the website"
            >
              {state.is_active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{state.is_active ? 'Visible on website' : 'Hidden from website'}</span>
            </button>
            <button
              type="button"
              onClick={requestClose}
              aria-label="Close editor"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FAF7F0] text-[#4A2C20] hover:bg-[#EFE4D0] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          {/* Section nav */}
          <nav className="hidden w-52 shrink-0 flex-col gap-1 border-r border-[#6B4030]/10 bg-white/60 p-4 md:flex" aria-label="Editor sections">
            {nav.map((n, i) => (
              <button
                key={n.id}
                type="button"
                onClick={() => scrollTo(n.id)}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-left text-[13px] font-medium text-[#4A2C20] hover:bg-[#FAF7F0] cursor-pointer"
              >
                <span>
                  <span className="mr-2 text-[#B89555]">{i + 1}</span>
                  {n.label}
                </span>
                {sectionHasError(n.id) && <span className="h-2 w-2 rounded-full bg-red-500" aria-label="Has errors" />}
              </button>
            ))}
            <div className="mt-auto rounded-xl bg-[#FAF7F0] p-3 text-[11px] leading-relaxed text-[#6B4030]">
              Character limits keep every card tidy on the website. Counters turn amber near the limit and red when text must be
              shortened.
            </div>
          </nav>

          {/* Form */}
          <div className="min-w-0 flex-1 overflow-y-auto">
            <div className="space-y-5 p-4 sm:p-6 lg:p-8">
              {/* 1. Basics */}
              <Section
                id="basics"
                number={1}
                icon={BookOpen}
                title="Basics"
                description="The name, summary and format customers see first."
              >
                <div>
                  <span className="text-[13px] font-semibold text-[#241A16]">Type *</span>
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    {[
                      { id: 'workshop', icon: Hammer, label: 'Workshop', sub: '1–9 days, hands-on' },
                      { id: 'journey', icon: Compass, label: 'Learning Journey', sub: '10+ days, phased roadmap' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => switchType(t.id)}
                        className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                          state.type === t.id
                            ? 'border-[#4A2C20] bg-[#4A2C20] text-white'
                            : 'border-[#6B4030]/15 bg-white text-[#241A16] hover:border-[#B89555]/60'
                        }`}
                      >
                        <t.icon className={`h-4 w-4 shrink-0 ${state.type === t.id ? 'text-[#E5B869]' : 'text-[#B89555]'}`} />
                        <span>
                          <span className="block text-sm font-semibold">{t.label}</span>
                          <span className={`block text-xs ${state.type === t.id ? 'text-[#E5B869]' : 'text-[#6B4030]'}`}>{t.sub}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-1.5 text-xs text-[#6B4030]/80">
                    Workshops appear under &ldquo;Hands-on Workshops&rdquo;; journeys appear under &ldquo;Learning Journeys&rdquo;.
                  </p>
                </div>

                <Field
                  label="Title"
                  required
                  htmlFor="oe-title"
                  value={state.title}
                  limit={LIMITS.title}
                  error={err('title')}
                  hint={`${LIMITS.title.min}–${LIMITS.title.max} characters. Main heading on the website; fits two lines on the selector card. E.g. “Sacred Metal Casting & Jewellery Workshop”.`}
                >
                  <input
                    id="oe-title"
                    type="text"
                    value={state.title}
                    maxLength={LIMITS.title.max}
                    onChange={(e) => set('title', e.target.value)}
                    placeholder="e.g. Sacred Metal Casting & Jewellery Workshop"
                    className={inputClass(err('title'))}
                  />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Badge"
                    optional
                    htmlFor="oe-badge"
                    value={state.badge}
                    limit={LIMITS.badge}
                    error={err('badge')}
                    hint="Up to 28 characters. Small label on the photo, e.g. “Bestseller” or “New batch”."
                  >
                    <input
                      id="oe-badge"
                      type="text"
                      value={state.badge}
                      maxLength={LIMITS.badge.max}
                      onChange={(e) => set('badge', e.target.value)}
                      placeholder="e.g. Artisan Metallurgy"
                      className={inputClass(err('badge'))}
                    />
                  </Field>
                  <Field
                    label="Heritage pillar"
                    optional
                    htmlFor="oe-pillar"
                    hint="Shown in gold above the title. Pick the pillar this belongs to."
                  >
                    <select
                      id="oe-pillar"
                      value={state.pillar_id}
                      onChange={(e) => set('pillar_id', e.target.value)}
                      className={inputClass(false, 'cursor-pointer')}
                    >
                      <option value="">No pillar</option>
                      {pillars.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field
                  label="Description"
                  required
                  htmlFor="oe-desc"
                  value={state.description}
                  limit={LIMITS.description}
                  error={err('description')}
                  hint={`${LIMITS.description.min}–${LIMITS.description.max} characters (2–3 sentences). Say what students do and what they leave with.`}
                >
                  <textarea
                    id="oe-desc"
                    rows={3}
                    value={state.description}
                    maxLength={LIMITS.description.max}
                    onChange={(e) => set('description', e.target.value)}
                    placeholder="e.g. A hands-on masterclass in traditional lost-wax casting and Naga jewellery chasing. You leave with a brass medallion you cast yourself."
                    className={inputClass(err('description'), 'resize-none leading-relaxed')}
                  />
                </Field>

                <div className="grid gap-5 sm:grid-cols-[140px_1fr]">
                  <Field
                    label="Days"
                    required
                    htmlFor="oe-days"
                    error={err('days')}
                    hint={isJourney ? '10–365 days.' : '1–9 days.'}
                  >
                    <input
                      id="oe-days"
                      type="number"
                      inputMode="numeric"
                      min={DAY_RANGE[state.type].min}
                      max={DAY_RANGE[state.type].max}
                      value={state.days}
                      onChange={(e) => set('days', e.target.value === '' ? '' : Number(e.target.value))}
                      className={inputClass(err('days'), 'tabular-nums')}
                    />
                  </Field>
                  <Field
                    label="Duration label"
                    optional
                    htmlFor="oe-durlabel"
                    value={state.durationLabel}
                    limit={LIMITS.durationLabel}
                    error={err('durationLabel')}
                    hint={durationPreview ? `Shown as “${durationPreview}”.` : 'Word after the days, e.g. “Intensive” → “1 Day Intensive”.'}
                  >
                    <input
                      id="oe-durlabel"
                      type="text"
                      value={state.durationLabel}
                      maxLength={LIMITS.durationLabel.max}
                      onChange={(e) => set('durationLabel', e.target.value)}
                      placeholder={isJourney ? 'e.g. Cohort' : 'e.g. Intensive'}
                      className={inputClass(err('durationLabel'))}
                    />
                  </Field>
                </div>

                <Field
                  label="Learning format"
                  required
                  htmlFor="oe-mode"
                  value={state.mode}
                  limit={LIMITS.mode}
                  error={err('mode')}
                  hint="3–30 characters. How it's taught, e.g. “Studio hands-on” or “Studio + field visit”."
                >
                  <input
                    id="oe-mode"
                    type="text"
                    value={state.mode}
                    maxLength={LIMITS.mode.max}
                    onChange={(e) => set('mode', e.target.value)}
                    placeholder="e.g. Studio hands-on"
                    className={inputClass(err('mode'))}
                  />
                </Field>
              </Section>

              {/* 2. Fee & seats */}
              <Section
                id="pricing"
                number={2}
                icon={Tag}
                title="Fee & seats"
                description="Shown on the booking card. Seats left update automatically from confirmed bookings."
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label="Offer fee (₹)"
                    required
                    htmlFor="oe-offer"
                    error={err('discount_price')}
                    hint="The amount students pay."
                  >
                    <input
                      id="oe-offer"
                      type="number"
                      inputMode="numeric"
                      min="1"
                      max={MAX_PRICE}
                      value={state.discount_price}
                      onChange={(e) => set('discount_price', e.target.value)}
                      placeholder="5499"
                      className={inputClass(err('discount_price'), 'tabular-nums font-semibold')}
                    />
                  </Field>
                  <Field
                    label="Regular fee (₹)"
                    optional
                    htmlFor="oe-regular"
                    error={err('original_price')}
                    hint={
                      savePercent > 0
                        ? `Shown crossed out with “Save ${savePercent}%”.`
                        : 'Higher than the offer fee to show a discount. Leave empty for no discount.'
                    }
                  >
                    <input
                      id="oe-regular"
                      type="number"
                      inputMode="numeric"
                      min="0"
                      max={MAX_PRICE}
                      value={state.original_price}
                      onChange={(e) => set('original_price', e.target.value)}
                      placeholder="10999"
                      className={inputClass(err('original_price'), 'tabular-nums')}
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <Field label="Total seats" required htmlFor="oe-seats" error={err('seats_total')} hint={`1–${MAX_SEATS} per batch.`}>
                    <input
                      id="oe-seats"
                      type="number"
                      inputMode="numeric"
                      min={Math.max(1, bookedSeats)}
                      max={MAX_SEATS}
                      value={state.seats_total}
                      onChange={(e) => set('seats_total', e.target.value)}
                      placeholder="35"
                      className={inputClass(err('seats_total'), 'tabular-nums')}
                    />
                  </Field>
                  <div className="space-y-1.5">
                    <span className="text-[13px] font-semibold text-[#241A16]">Booked</span>
                    <div className="rounded-xl border border-[#6B4030]/10 bg-[#FAF7F0] px-3.5 py-2.5 text-sm font-semibold tabular-nums text-[#4A2C20]">
                      {bookedSeats}
                    </div>
                    <p className="text-xs text-[#6B4030]/80">From applications.</p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[13px] font-semibold text-[#241A16]">Seats left</span>
                    <div className="rounded-xl border border-[#6B4030]/10 bg-[#FAF7F0] px-3.5 py-2.5 text-sm font-semibold tabular-nums text-[#4A2C20]">
                      {Math.max(0, seatsTotal - bookedSeats)}
                    </div>
                    <p className="text-xs text-[#6B4030]/80">Total − booked.</p>
                  </div>
                </div>
              </Section>

              {/* 3. Image */}
              <Section
                id="image"
                number={3}
                icon={ImageIcon}
                title="Cover image"
                description="Landscape photo of the craft or studio. JPG, PNG or WEBP up to 5 MB."
              >
                <div className="grid gap-4 sm:grid-cols-[220px_1fr]">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[#6B4030]/15 bg-[#FAF7F0]">
                    {state.image_url ? (
                      <img
                        src={state.image_url}
                        alt="Cover preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/artisan/workshop.jpg';
                        }}
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-1 text-xs text-[#6B4030]/70">
                        <ImageIcon className="h-6 w-6 text-[#B89555]" />
                        No image yet
                      </div>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                        <Loader2 className="h-6 w-6 animate-spin text-[#B89555]" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="inline-flex rounded-xl border border-[#6B4030]/15 bg-[#FAF7F0] p-1 text-xs font-semibold">
                      {[
                        ['upload', 'Upload'],
                        ['presets', 'Gallery'],
                        ['url', 'Image URL'],
                      ].map(([id, label]) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setImageMode(id)}
                          className={`rounded-lg px-3 py-1.5 transition-colors cursor-pointer ${
                            imageMode === id ? 'bg-[#4A2C20] text-white' : 'text-[#6B4030] hover:text-[#241A16]'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    {imageMode === 'upload' && (
                      <>
                        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFile} className="hidden" />
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          disabled={uploading}
                          className="flex w-full flex-col items-center gap-1 rounded-xl border-2 border-dashed border-[#6B4030]/25 px-4 py-5 text-center transition-colors hover:border-[#B89555] hover:bg-white cursor-pointer disabled:opacity-60"
                        >
                          <UploadCloud className="h-5 w-5 text-[#B89555]" />
                          <span className="text-sm font-semibold text-[#4A2C20]">{state.image_url ? 'Replace image' : 'Choose image'}</span>
                          <span className="text-xs text-[#6B4030]/70">Landscape works best, at least 1200 px wide</span>
                        </button>
                      </>
                    )}
                    {imageMode === 'presets' && (
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {PRESET_IMAGES.map((img) => (
                          <button
                            key={img.url}
                            type="button"
                            onClick={() => set('image_url', img.url)}
                            className={`overflow-hidden rounded-xl border text-left transition-colors cursor-pointer ${
                              state.image_url === img.url ? 'border-[#4A2C20] ring-2 ring-[#B89555]/40' : 'border-[#6B4030]/15 hover:border-[#B89555]'
                            }`}
                          >
                            <img src={img.url} alt="" className="h-16 w-full object-cover" />
                            <span className="block truncate px-2 py-1 text-[11px] text-[#4A2C20]">{img.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {imageMode === 'url' && (
                      <Field label="Image URL" htmlFor="oe-imgurl" hint="A site path like /artisan/workshop.jpg or a full https:// link.">
                        <input
                          id="oe-imgurl"
                          type="text"
                          value={state.image_url.startsWith('data:') ? '' : state.image_url}
                          onChange={(e) => set('image_url', e.target.value)}
                          placeholder="/artisan/workshop.jpg"
                          className={inputClass(false)}
                        />
                      </Field>
                    )}
                    {uploadError && (
                      <p className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {uploadError}
                      </p>
                    )}
                    {state.image_url && (
                      <button
                        type="button"
                        onClick={() => set('image_url', '')}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove image (a default studio photo will be used)
                      </button>
                    )}
                  </div>
                </div>
              </Section>

              {/* 4. Curriculum */}
              <Section
                id="curriculum"
                number={4}
                icon={isJourney ? Compass : Hammer}
                title={isJourney ? 'Roadmap phases' : 'What students will do'}
                description={
                  isJourney
                    ? 'Break the journey into phases by day range. Shown as “Your roadmap”.'
                    : 'The hands-on steps in order. Shown as a numbered timeline under “What you’ll do”.'
                }
              >
                {isJourney ? (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#FAF7F0] px-4 py-3">
                      <div className="text-xs text-[#4A2C20]">
                        <span className="font-semibold">
                          {days ? `${Math.min(lastEnd, days)} of ${days} days planned` : 'Set the number of days in Basics first'}
                        </span>
                        {days > 0 && lastEnd < days && state.phases.length > 0 && (
                          <span className="text-amber-700"> · Days {lastEnd + 1}–{days} have no phase yet</span>
                        )}
                      </div>
                      {state.phases.length > 1 && days > 0 && (
                        <button
                          type="button"
                          onClick={spreadDays}
                          className="text-xs font-semibold text-[#4A2C20] underline decoration-[#B89555] underline-offset-2 hover:text-[#B89555] cursor-pointer"
                        >
                          Split {days} days evenly across {state.phases.length} phases
                        </button>
                      )}
                    </div>
                    {err('phases') && <p className="text-xs font-medium text-red-600">{err('phases')}</p>}

                    {state.phases.map((p, i) => (
                      <div key={i} className="space-y-4 rounded-2xl border border-[#6B4030]/12 bg-[#FCFAF6] p-4 sm:p-5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-2 text-sm font-bold text-[#241A16]">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#4A2C20] text-xs text-[#E5B869]">{i + 1}</span>
                            Phase {i + 1}
                          </span>
                          <div className="flex items-center">
                            <IconButton title="Move up" onClick={() => moveItem('phases', i, -1)} disabled={i === 0}>↑</IconButton>
                            <IconButton title="Move down" onClick={() => moveItem('phases', i, 1)} disabled={i === state.phases.length - 1}>↓</IconButton>
                            <IconButton title="Remove phase" tone="danger" onClick={() => removeItem('phases', i)}>
                              <Trash2 className="h-4 w-4" />
                            </IconButton>
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_2fr]">
                          <Field label="From day" required error={err(`phases.${i}.days`)}>
                            <input
                              type="number"
                              min="1"
                              max={days || undefined}
                              value={p.start}
                              onChange={(e) => setItem('phases', i, 'start', e.target.value === '' ? '' : Number(e.target.value))}
                              className={inputClass(err(`phases.${i}.days`), 'tabular-nums')}
                            />
                          </Field>
                          <Field label="To day" required>
                            <input
                              type="number"
                              min="1"
                              max={days || undefined}
                              value={p.end}
                              onChange={(e) => setItem('phases', i, 'end', e.target.value === '' ? '' : Number(e.target.value))}
                              className={inputClass(err(`phases.${i}.days`), 'tabular-nums')}
                            />
                          </Field>
                          <Field
                            label="Phase title"
                            required
                            value={p.title}
                            limit={LIMITS.phaseTitle}
                            error={err(`phases.${i}.title`)}
                            hint="E.g. “Drawing & Sacred Proportions”."
                          >
                            <input
                              type="text"
                              value={p.title}
                              maxLength={LIMITS.phaseTitle.max}
                              onChange={(e) => setItem('phases', i, 'title', e.target.value)}
                              placeholder="e.g. Tamili Brahmi & Epigraphy"
                              className={inputClass(err(`phases.${i}.title`))}
                            />
                          </Field>
                        </div>

                        <Field
                          label="What is covered"
                          required
                          value={p.details}
                          limit={LIMITS.phaseDetails}
                          error={err(`phases.${i}.details`)}
                          hint="One or two sentences on the skills and techniques in this phase."
                        >
                          <textarea
                            rows={2}
                            value={p.details}
                            maxLength={LIMITS.phaseDetails.max}
                            onChange={(e) => setItem('phases', i, 'details', e.target.value)}
                            placeholder="e.g. Decipher Tamil Brahmi scripts, study copper plate charters and practise rock scribing."
                            className={inputClass(err(`phases.${i}.details`), 'resize-none leading-relaxed')}
                          />
                        </Field>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field
                            label="You'll create"
                            optional
                            value={p.outcome}
                            limit={LIMITS.phaseOutcome}
                            error={err(`phases.${i}.outcome`)}
                            hint="The finished piece from this phase."
                          >
                            <input
                              type="text"
                              value={p.outcome}
                              maxLength={LIMITS.phaseOutcome.max}
                              onChange={(e) => setItem('phases', i, 'outcome', e.target.value)}
                              placeholder="e.g. Hand-scribed copper inscription tablet"
                              className={inputClass(err(`phases.${i}.outcome`))}
                            />
                          </Field>
                          <Field
                            label="Materials"
                            optional
                            value={p.materials}
                            limit={LIMITS.phaseMaterials}
                            error={err(`phases.${i}.materials`)}
                            hint="Separate items with commas. Each becomes a small tag."
                          >
                            <input
                              type="text"
                              value={p.materials}
                              maxLength={LIMITS.phaseMaterials.max}
                              onChange={(e) => setItem('phases', i, 'materials', e.target.value)}
                              placeholder="e.g. Copper sheets, Steel stylus, Ink pads"
                              className={inputClass(err(`phases.${i}.materials`))}
                            />
                          </Field>
                        </div>
                      </div>
                    ))}

                    <AddButton onClick={addPhase} disabled={!days || lastEnd >= days || state.phases.length >= MAX_PHASES}>
                      {lastEnd >= days && days > 0 ? 'All days are planned' : `Add phase (${state.phases.length}/${MAX_PHASES})`}
                    </AddButton>
                  </>
                ) : (
                  <>
                    {err('modules') && <p className="text-xs font-medium text-red-600">{err('modules')}</p>}
                    {state.modules.map((m, i) => (
                      <div key={i} className="space-y-4 rounded-2xl border border-[#6B4030]/12 bg-[#FCFAF6] p-4 sm:p-5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-2 text-sm font-bold text-[#241A16]">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#B89555]/50 bg-white text-xs text-[#4A2C20]">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            Step {i + 1}
                          </span>
                          <div className="flex items-center">
                            <IconButton title="Move up" onClick={() => moveItem('modules', i, -1)} disabled={i === 0}>↑</IconButton>
                            <IconButton title="Move down" onClick={() => moveItem('modules', i, 1)} disabled={i === state.modules.length - 1}>↓</IconButton>
                            <IconButton title="Remove step" tone="danger" onClick={() => removeItem('modules', i)} disabled={state.modules.length === 1}>
                              <Trash2 className="h-4 w-4" />
                            </IconButton>
                          </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
                          <Field
                            label="Day / session"
                            optional
                            value={m.day}
                            limit={LIMITS.moduleDay}
                            error={err(`modules.${i}.day`)}
                            hint={days > 1 ? 'E.g. “Day 2” or “Morning”.' : 'Leave empty for single-day workshops.'}
                          >
                            <input
                              type="text"
                              value={m.day}
                              maxLength={LIMITS.moduleDay.max}
                              onChange={(e) => setItem('modules', i, 'day', e.target.value)}
                              placeholder={days > 1 ? 'e.g. Day 2' : 'e.g. Morning'}
                              className={inputClass(err(`modules.${i}.day`))}
                            />
                          </Field>
                          <Field
                            label="Step title"
                            required
                            value={m.title}
                            limit={LIMITS.moduleTitle}
                            error={err(`modules.${i}.title`)}
                            hint="Short action, e.g. “Crucible Pouring”."
                          >
                            <input
                              type="text"
                              value={m.title}
                              maxLength={LIMITS.moduleTitle.max}
                              onChange={(e) => setItem('modules', i, 'title', e.target.value)}
                              placeholder="e.g. Clay Investment Mould"
                              className={inputClass(err(`modules.${i}.title`))}
                            />
                          </Field>
                        </div>
                        <Field
                          label="What happens in this step"
                          optional
                          value={m.desc}
                          limit={LIMITS.moduleDesc}
                          error={err(`modules.${i}.desc`)}
                          hint="One sentence describing the hands-on activity."
                        >
                          <textarea
                            rows={2}
                            value={m.desc}
                            maxLength={LIMITS.moduleDesc.max}
                            onChange={(e) => setItem('modules', i, 'desc', e.target.value)}
                            placeholder="e.g. Melt brass in a graphite crucible and pour it into the de-waxed mould."
                            className={inputClass(err(`modules.${i}.desc`), 'resize-none leading-relaxed')}
                          />
                        </Field>
                      </div>
                    ))}
                    <AddButton
                      onClick={() => set('modules', [...state.modules, { day: '', title: '', desc: '' }])}
                      disabled={state.modules.length >= MAX_MODULES}
                    >
                      Add step ({state.modules.length}/{MAX_MODULES})
                    </AddButton>
                  </>
                )}
              </Section>

              {/* 5. Customer details */}
              <Section
                id="details"
                number={5}
                icon={Award}
                title="Customer details"
                description="Optional extras. Anything left empty is hidden on the website."
              >
                <Field
                  label="What the fee includes"
                  optional
                  htmlFor="oe-incl"
                  value={state.inclusions}
                  limit={LIMITS.inclusions}
                  error={err('inclusions')}
                  hint="One sentence under the price, e.g. “All tools, brass stock and safety gear are included.”"
                >
                  <input
                    id="oe-incl"
                    type="text"
                    value={state.inclusions}
                    maxLength={LIMITS.inclusions.max}
                    onChange={(e) => set('inclusions', e.target.value)}
                    placeholder="e.g. Brass alloy stock, chasing tools and safety gear are included."
                    className={inputClass(err('inclusions'))}
                  />
                </Field>

                <div className="space-y-3">
                  <div>
                    <p className="text-[13px] font-semibold text-[#241A16]">
                      At a glance <span className="font-normal text-[#6B4030]/60">(optional, up to {MAX_SPECS})</span>
                    </p>
                    <p className="text-xs text-[#6B4030]/80">
                      Short facts as label + value. Label up to {LIMITS.specLabel.max} characters, value up to {LIMITS.specValue.max}.
                    </p>
                  </div>
                  {state.specs.map((sp, i) => (
                    <div key={i} className="grid grid-cols-[1fr_auto] gap-2 sm:grid-cols-[180px_1fr_auto]">
                      <Field value={sp.label} limit={LIMITS.specLabel} error={err(`specs.${i}.label`)} label="Label">
                        <input
                          type="text"
                          value={sp.label}
                          maxLength={LIMITS.specLabel.max}
                          onChange={(e) => setItem('specs', i, 'label', e.target.value)}
                          placeholder="e.g. Technique"
                          className={inputClass(err(`specs.${i}.label`))}
                        />
                      </Field>
                      <div className="order-3 col-span-2 sm:order-none sm:col-span-1">
                        <Field value={sp.value} limit={LIMITS.specValue} error={err(`specs.${i}.value`)} label="Value">
                          <input
                            type="text"
                            value={sp.value}
                            maxLength={LIMITS.specValue.max}
                            onChange={(e) => setItem('specs', i, 'value', e.target.value)}
                            placeholder="e.g. Lost-wax casting & repoussé"
                            className={inputClass(err(`specs.${i}.value`))}
                          />
                        </Field>
                      </div>
                      <div className="pt-7">
                        <IconButton title="Remove fact" tone="danger" onClick={() => removeItem('specs', i)}>
                          <Trash2 className="h-4 w-4" />
                        </IconButton>
                      </div>
                    </div>
                  ))}
                  <AddButton
                    onClick={() => set('specs', [...state.specs, { label: '', value: '' }])}
                    disabled={state.specs.length >= MAX_SPECS}
                  >
                    Add fact ({state.specs.length}/{MAX_SPECS})
                  </AddButton>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-[13px] font-semibold text-[#241A16]">
                      {isJourney ? "By the end you'll have" : 'What you take home'}{' '}
                      <span className="font-normal text-[#6B4030]/60">(optional, up to {MAX_TAKEAWAYS})</span>
                    </p>
                    <p className="text-xs text-[#6B4030]/80">
                      Things the student keeps: finished pieces, certificates, kits. {LIMITS.takeaway.min}–{LIMITS.takeaway.max} characters each.
                    </p>
                  </div>
                  {state.takeaways.map((t, i) => (
                    <div key={i} className="grid grid-cols-[1fr_auto] items-start gap-2">
                      <Field value={t} limit={LIMITS.takeaway} error={err(`takeaways.${i}`)} label={`Item ${i + 1}`}>
                        <input
                          type="text"
                          value={t}
                          maxLength={LIMITS.takeaway.max}
                          onChange={(e) => setItem('takeaways', i, null, e.target.value)}
                          placeholder="e.g. Handcrafted Naga brass medallion"
                          className={inputClass(err(`takeaways.${i}`))}
                        />
                      </Field>
                      <div className="pt-7">
                        <IconButton title="Remove item" tone="danger" onClick={() => removeItem('takeaways', i)}>
                          <Trash2 className="h-4 w-4" />
                        </IconButton>
                      </div>
                    </div>
                  ))}
                  <AddButton
                    onClick={() => set('takeaways', [...state.takeaways, ''])}
                    disabled={state.takeaways.length >= MAX_TAKEAWAYS}
                  >
                    Add item ({state.takeaways.length}/{MAX_TAKEAWAYS})
                  </AddButton>
                </div>

                {isJourney && (
                  <div className="space-y-4 rounded-2xl border border-[#6B4030]/12 bg-[#FCFAF6] p-4 sm:p-5">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={state.field_visit.enabled}
                        onChange={(e) => set('field_visit', { ...state.field_visit, enabled: e.target.checked })}
                        className="mt-0.5 h-4 w-4 cursor-pointer accent-[#4A2C20]"
                      />
                      <span>
                        <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[#241A16]">
                          <MapPin className="h-3.5 w-3.5 text-[#B89555]" />
                          This journey includes a field visit
                        </span>
                        <span className="text-xs text-[#6B4030]/80">Adds a banner below the roadmap and a “Field visit included” tag.</span>
                      </span>
                    </label>
                    {state.field_visit.enabled && (
                      <>
                        <Field
                          label="Banner title"
                          optional
                          value={state.field_visit.title}
                          limit={LIMITS.fieldVisitTitle}
                          error={err('fv.title')}
                          hint="Defaults to “Includes an on-site field visit”."
                        >
                          <input
                            type="text"
                            value={state.field_visit.title}
                            maxLength={LIMITS.fieldVisitTitle.max}
                            onChange={(e) => set('field_visit', { ...state.field_visit, title: e.target.value })}
                            placeholder="Includes an on-site field visit"
                            className={inputClass(err('fv.title'))}
                          />
                        </Field>
                        <Field
                          label="Where students go"
                          required
                          value={state.field_visit.description}
                          limit={LIMITS.fieldVisitDescription}
                          error={err('fv.description')}
                          hint="1–2 sentences about the places and what students see."
                        >
                          <textarea
                            rows={2}
                            value={state.field_visit.description}
                            maxLength={LIMITS.fieldVisitDescription.max}
                            onChange={(e) => set('field_visit', { ...state.field_visit, description: e.target.value })}
                            placeholder="e.g. Explore temple rock inscriptions and working artisan studios across Tamil Nadu, guided by historians."
                            className={inputClass(err('fv.description'), 'resize-none leading-relaxed')}
                          />
                        </Field>
                      </>
                    )}
                  </div>
                )}
              </Section>
            </div>
          </div>

        </div>

        {previewOpen && (
          <PreviewPage
            course={{ ...(course || {}), ...buildPayload(state, pillars, bookedSeats), booked_seats: bookedSeats }}
            isJourney={isJourney}
            onClose={() => setPreviewOpen(false)}
            onSave={() => {
              setPreviewOpen(false);
              handleSave();
            }}
            saveLabel={mode === 'create' ? 'Publish offering' : 'Save changes'}
          />
        )}

        {/* Footer */}
        <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-[#6B4030]/15 bg-white px-5 py-3 sm:px-6">
          <div className="min-w-0 text-xs">
            {saved ? (
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                Saved. Changes are live on the website.
              </span>
            ) : submitError ? (
              <span className="inline-flex items-center gap-1.5 font-semibold text-red-600">
                <AlertCircle className="h-4 w-4" />
                {submitError}
              </span>
            ) : showErrors && errorCount > 0 ? (
              <span className="inline-flex items-center gap-1.5 font-semibold text-red-600">
                <AlertCircle className="h-4 w-4" />
                {errorCount === 1 ? '1 field needs attention' : `${errorCount} fields need attention`}. They are marked in red.
              </span>
            ) : (
              <span className="text-[#6B4030]/80">{isDirty ? 'You have unsaved changes.' : 'Fields marked * are required.'}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={requestClose}
              className="rounded-xl border border-[#6B4030]/20 px-4 py-2.5 text-sm font-semibold text-[#6B4030] hover:bg-[#FAF7F0] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || saved}
              className="inline-flex items-center gap-2 rounded-xl bg-[#4A2C20] px-5 py-2.5 text-sm font-bold text-[#F7F2E8] hover:bg-[#603929] cursor-pointer disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin text-[#B89555]" />}
              {mode === 'create' ? 'Publish offering' : 'Save changes'}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
