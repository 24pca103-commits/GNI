import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  Eye,
  EyeOff,
  Hammer,
  ImageIcon,
  Loader2,
  MapPin,
  Monitor,
  Tag,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
import { createCourse, fetchPillars, updateCourse, uploadOfferingImage } from '../../services/api';
import { AddButton, Field, IconButton, Section } from './FormUI';
import { inputClass } from './adminFormat';
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
  PRESET_IMAGES,
} from './offeringLimits';

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

export const handleOnlyNumericKeyDown = (e) => {
  if (
    ['Backspace', 'Tab', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter'].includes(
      e.key
    )
  ) {
    return;
  }
  if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x', 'z'].includes(e.key.toLowerCase())) {
    return;
  }
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
  }
};

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

function phasesFromRaw(rawPhases) {
  if (!Array.isArray(rawPhases) || !rawPhases.length) return [];
  return rawPhases.map((p) => {
    const nums = String(p.period || '').match(/\d+/g) || [];
    const start = p.start !== undefined && p.start !== '' ? Number(p.start) : (nums[0] ? Number(nums[0]) : '');
    const end = p.end !== undefined && p.end !== '' ? Number(p.end) : (nums[1] ? Number(nums[1]) : start);
    return {
      start,
      end,
      title: p.title || '',
      details: p.details || p.desc || '',
      outcome: p.outcome || '',
      materials: Array.isArray(p.materials) ? p.materials.join(', ') : (p.materials || ''),
    };
  });
}

const blankOption = (days = '', kind = 'journey', defaultSeats = 35) => {
  const d = Number(days);
  return {
    days,
    label: '',
    fee: '',
    original_price: '',
    seats_total: defaultSeats || 35,
    phases: kind === 'journey' && d >= 10 ? [{ start: 1, end: d, title: '', details: '', outcome: '', materials: '' }] : [],
  };
};

/** Duration options from the API, or built from an older offering's single duration and prices. */
function durationsFromCourse(course, kind) {
  const globalPhases = course && kind === 'journey' ? phasesFromCourse(course, getDayCount(course.duration)) : [];
  const defaultSeats = course ? Number(course.seats_total) || 50 : 35;
  if (Array.isArray(course?.durations) && course.durations.length) {
    return course.durations.map((o, idx) => {
      const dDays = Number(o.days) || '';
      let dPhases = [];
      if (Array.isArray(o.phases) && o.phases.length) {
        dPhases = phasesFromRaw(o.phases);
      } else if (idx === 0 && globalPhases.length) {
        dPhases = globalPhases;
      } else if (kind === 'journey' && dDays >= 10) {
        dPhases = [{ start: 1, end: dDays, title: '', details: '', outcome: '', materials: '' }];
      }
      return {
        days: dDays,
        label: o.label || '',
        fee: Number(o.fee) || '',
        original_price: Number(o.original_price) > Number(o.fee) ? Number(o.original_price) : '',
        seats_total: o.seats_total !== undefined && o.seats_total !== '' ? Number(o.seats_total) : defaultSeats,
        booked_seats: Number(o.booked_seats) || 0,
        seats_available: o.seats_available !== undefined ? Number(o.seats_available) : undefined,
        phases: dPhases,
      };
    });
  }
  if (!course) return [blankOption(kind === 'workshop' ? 1 : 30, kind, defaultSeats)];
  const { days, label } = splitDuration(course.duration);
  const fee = Number(course.discount_price) || '';
  const regular = Number(course.original_price);
  return [{
    days,
    label,
    fee,
    original_price: regular > fee ? regular : '',
    seats_total: defaultSeats,
    phases: globalPhases.length ? globalPhases : (kind === 'journey' && days ? [{ start: 1, end: days, title: '', details: '', outcome: '', materials: '' }] : []),
  }];
}

function initialState(course, type) {
  const kind = course ? getOfferingKind(course) : type;
  const details = parseDetails(course?.details);
  const modules = course && kind === 'workshop' ? parseWorkshopModules(course.highlights) : [];
  const durs = durationsFromCourse(course, kind);
  const initSeats = course ? (Number(course.seats_total) || durs[0]?.seats_total || '') : (durs[0]?.seats_total || 35);
  return {
    type: kind,
    title: course?.title || '',
    badge: course?.badge || '',
    pillar_id: course?.pillar_id !== undefined && course?.pillar_id !== null ? String(Number(course.pillar_id) === 0 ? 'all' : course.pillar_id) : '',
    description: course?.description || '',
    durations: durs,
    mode: course?.mode || '',
    seats_total: initSeats,
    image_url: course?.image_url || '',
    is_active: course ? (Number(course.is_active) ? 1 : 0) : 1,
    modules: modules.length ? modules : [{ day: '', title: '', desc: '' }],
    phases: course && kind === 'journey' ? phasesFromCourse(course, getDayCount(course.duration)) : [],
    inclusions: details.inclusions,
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
  if (!s.pillar_id || String(s.pillar_id).trim() === '') e.pillar_id = 'Please select a heritage pillar.';
  checkText(e, 'description', s.description, LIMITS.description, 'Description', true);
  checkText(e, 'mode', s.mode, LIMITS.mode, 'Learning format', true);

  // Duration options: the first is the main one (decides the type and the website price)
  const seen = new Set();
  s.durations.forEach((o, i) => {
    const rawDays = o.days;
    const r = range;

    if (rawDays === '' || rawDays === null || rawDays === undefined) {
      e[`durations.${i}.days`] = s.type === 'workshop'
        ? 'Days is required (must be 1–9 days for workshops).'
        : 'Days is required (must be at least 10 days for learning journeys).';
      return;
    }

    const d = Number(rawDays);
    if (!Number.isInteger(d)) {
      e[`durations.${i}.days`] = 'Days must be a valid whole number.';
    } else if (s.type === 'workshop' && (d < 1 || d > 9)) {
      e[`durations.${i}.days`] = 'Double digits not allowed for Workshop! Workshop duration must strictly be 1–9 days (single digit). For 10+ days, switch offering type to Learning Journey.';
    } else if (s.type === 'journey' && d < 10) {
      e[`durations.${i}.days`] = 'Single digit not allowed for Learning Journey! Duration must start from 10 days (10+ days). Single digits (1–9 days) are strictly for Workshops.';
    } else if (d < r.min || d > r.max) {
      e[`durations.${i}.days`] = `Days must be between ${r.min} and ${r.max}.`;
    }

    const offer = Number(o.fee);
    const regular = Number(o.original_price);
    if (!offer || offer <= 0) {
      e[`durations.${i}.fee`] = 'Enter the fee students pay (must be greater than ₹0).';
    } else if (offer > MAX_PRICE) {
      e[`durations.${i}.fee`] = `Offer fee cannot exceed ₹${MAX_PRICE.toLocaleString('en-IN')}.`;
    }
    if (o.original_price !== '' && o.original_price !== null && o.original_price !== undefined) {
      if (!regular || regular <= 0) {
        e[`durations.${i}.original_price`] = 'Regular fee must be greater than ₹0.';
      } else if (regular < offer) {
        e[`durations.${i}.original_price`] = `Regular fee (₹${regular.toLocaleString('en-IN')}) must be equal to or higher than offer fee (₹${offer.toLocaleString('en-IN')}).`;
      } else if (regular > MAX_PRICE) {
        e[`durations.${i}.original_price`] = `Regular fee cannot exceed ₹${MAX_PRICE.toLocaleString('en-IN')}.`;
      }
    }
    const key = Number.isInteger(d) ? buildDuration(d, o.label || '').toLowerCase() : '';
    if (key && seen.has(key)) e[`durations.${i}.days`] = 'This duration is already listed.';
    if (key) seen.add(key);
  });

  s.durations.forEach((o, i) => {
    const optSeats = Number(o.seats_total);
    if (!Number.isInteger(optSeats) || optSeats < 1 || optSeats > MAX_SEATS) {
      e[`durations.${i}.seats_total`] = `Seats must be between 1 and ${MAX_SEATS}.`;
    } else if (i === 0 && optSeats < bookedSeats) {
      e[`durations.${i}.seats_total`] = `Cannot be lower than ${bookedSeats} booked seats.`;
    }
  });

  const mainSeats = Number(s.durations?.[0]?.seats_total || s.seats_total);
  if (!Number.isInteger(mainSeats) || mainSeats < 1 || mainSeats > MAX_SEATS) e.seats_total = `Enter total seats between 1 and ${MAX_SEATS}.`;
  else if (mainSeats < bookedSeats) e.seats_total = `Cannot be lower than the ${bookedSeats} seats already booked.`;

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
    // Validate roadmap phases for each duration option
    s.durations.forEach((dOpt, dIdx) => {
      const durDays = Number(dOpt.days);
      const phases = dOpt.phases || [];
      if (!Number.isInteger(durDays) || durDays < 10) return;

      if (phases.length === 0) {
        e[`durations.${dIdx}.phases`] = `Add at least one phase for the ${durDays}-day roadmap.`;
        return;
      }

      let prevEnd = 0;
      phases.forEach((p, pIdx) => {
        const pKey = `durations.${dIdx}.phases.${pIdx}`;
        checkText(e, `${pKey}.title`, p.title, LIMITS.phaseTitle, `Phase ${pIdx + 1} title (${durDays}D)`, true);
        checkText(e, `${pKey}.details`, p.details, LIMITS.phaseDetails, `Phase ${pIdx + 1} details (${durDays}D)`, true);
        checkText(e, `${pKey}.outcome`, p.outcome, LIMITS.phaseOutcome, `Phase ${pIdx + 1} outcome (${durDays}D)`, false);
        checkText(e, `${pKey}.materials`, p.materials, LIMITS.phaseMaterials, `Phase ${pIdx + 1} materials (${durDays}D)`, false);

        const start = Number(p.start);
        const end = Number(p.end);
        if (!start || !end || end < start) {
          e[`${pKey}.days`] = 'Enter a valid day range (end day ≥ start day).';
        } else if (pIdx === 0 && start !== 1) {
          e[`${pKey}.days`] = 'Phase 1 must start from Day 1.';
        } else if (pIdx > 0 && start !== prevEnd + 1) {
          e[`${pKey}.days`] = `Must follow Phase ${pIdx} contiguously without gap. Start from Day ${prevEnd + 1}.`;
        } else if (Number.isInteger(durDays) && end > durDays) {
          e[`${pKey}.days`] = `Ends after Day ${durDays} (last day of this cohort).`;
        } else if (start <= prevEnd) {
          e[`${pKey}.days`] = `Overlaps the previous phase. Start from Day ${prevEnd + 1}.`;
        }
        if (end) prevEnd = Math.max(prevEnd, end);
      });

      // STRICT VALIDATION: The phases MUST cover all `durDays` of this duration!
      if (Number.isInteger(durDays) && durDays >= 10 && phases.length > 0) {
        if (prevEnd < durDays) {
          e[`durations.${dIdx}.phases`] = `Roadmap phases must cover all ${durDays} days (currently planned up to Day ${prevEnd}).`;
          const lastIdx = phases.length - 1;
          if (!e[`durations.${dIdx}.phases.${lastIdx}.days`]) {
            e[`durations.${dIdx}.phases.${lastIdx}.days`] = `Final phase must end at Day ${durDays} (currently ends at Day ${prevEnd}).`;
          }
        }
      }
    });
  }

  checkText(e, 'inclusions', s.inclusions, LIMITS.inclusions, 'Fee inclusions', false);
  if (s.type === 'journey' && s.field_visit.enabled) {
    checkText(e, 'fv.title', s.field_visit.title, LIMITS.fieldVisitTitle, 'Banner title', false);
    checkText(e, 'fv.description', s.field_visit.description, LIMITS.fieldVisitDescription, 'Field visit description', true);
  }
  return e;
}

const SECTION_OF = (key) => {
  if (/^(title|badge|description|mode|pillar_id)$/.test(key)) return 'basics';
  if (/^(durations|seats_total)/.test(key)) return 'pricing';
  if (/^(modules|phases)/.test(key)) return 'curriculum';
  return 'details';
};

/** Dedicated Roadmap Phases manager nested directly under each Duration option for Learning Journeys */
function DurationRoadmapEditor({
  durationIndex,
  days,
  phases = [],
  err,
  onChangePhase,
  onAddPhase,
  onRemovePhase,
  onMovePhase,
  onSpreadDays,
}) {
  const durErr = err(`durations.${durationIndex}.phases`);
  const anyPhaseError = phases.some((_, pIdx) => {
    const pKey = `durations.${durationIndex}.phases.${pIdx}`;
    return err(`${pKey}.days`) || err(`${pKey}.title`) || err(`${pKey}.details`) || err(`${pKey}.outcome`) || err(`${pKey}.materials`);
  });
  const [open, setOpen] = useState(Boolean(durErr || anyPhaseError || durationIndex === 0));
  const lastEnd = phases.reduce((m, p) => Math.max(m, Number(p.end) || 0), 0);

  return (
    <div className="mt-2.5 border-t border-[#6B4030]/15 pt-2">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#FAF7F0] hover:bg-[#F3EBDD] px-3 py-2 rounded-xl border border-[#6B4030]/15 transition-colors">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex flex-wrap items-center gap-2 text-xs font-bold text-[#4A2C20] cursor-pointer"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4A2C20] text-[10px] text-[#E5B869] font-bold shrink-0">
            {phases.length}
          </span>
          <span className="font-['Cormorant_Garamond'] text-base font-bold text-[#241A16]">
            Roadmap Phases ({days ? `${days} Days Cohort` : 'Set Days'})
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-[#6B4030]/10 px-2 py-0.5 text-[11px] font-semibold text-[#4A2C20]">
            {open ? 'Hide Phases' : <><span className="hidden sm:inline">Dropdown: </span>View / Edit Phases</>}
            {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </span>
        </button>

        <div className="flex items-center gap-2.5 text-xs ml-auto">
          <span className={`tabular-nums text-[11px] font-semibold ${lastEnd >= days && days > 0 ? 'text-emerald-700' : 'text-[#B89555]'}`}>
            {Math.min(lastEnd, days)}/{days || 0}d planned
            {days > 0 && lastEnd < days && ` (Missing ${days - lastEnd}d)`}
            {days > 0 && lastEnd >= days && ' ✓'}
          </span>
          {open && phases.length > 1 && days > 0 && (
            <button
              type="button"
              onClick={onSpreadDays}
              className="text-[11px] font-semibold text-[#4A2C20] underline decoration-[#B89555] underline-offset-2 hover:text-[#B89555] cursor-pointer"
            >
              Split evenly
            </button>
          )}
        </div>
      </div>

      {durErr && (
        <div className="mb-2 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600" />
          <span>{durErr}</span>
        </div>
      )}

      {open && (
        <div className="space-y-2">
          {phases.map((p, pIdx) => {
            const pKey = `durations.${durationIndex}.phases.${pIdx}`;
            const phaseDaysErr = err(`${pKey}.days`);
            const phaseTitleErr = err(`${pKey}.title`);
            const phaseDetailsErr = err(`${pKey}.details`);
            const anyPhaseErr = phaseDaysErr || phaseTitleErr || phaseDetailsErr || err(`${pKey}.outcome`) || err(`${pKey}.materials`);

            return (
              <div key={pIdx} className="space-y-1.5 rounded-lg border border-[#6B4030]/15 bg-white p-2.5 shadow-2xs">
                {/* Row 1: Phase Number + From Day + To Day + Phase Title + Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#241A16] shrink-0">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4A2C20] text-[10px] text-[#E5B869] font-semibold">
                        {pIdx + 1}
                      </span>
                      <span className="hidden sm:inline">Phase {pIdx + 1}:</span>
                    </span>

                    <div className="flex items-center gap-1 text-xs shrink-0">
                      <span className="text-[11px] text-[#6B4030] font-medium">Day</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={p.start ?? ''}
                        placeholder="1"
                        onKeyDown={handleOnlyNumericKeyDown}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          onChangePhase(pIdx, 'start', val === '' ? '' : Number(val));
                        }}
                        className={inputClass(phaseDaysErr, 'w-10 sm:w-11 text-center py-0.5 px-1 text-xs font-semibold tabular-nums')}
                      />
                      <span className="text-[11px] text-[#6B4030]">to</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={p.end ?? ''}
                        placeholder="15"
                        onKeyDown={handleOnlyNumericKeyDown}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          onChangePhase(pIdx, 'end', val === '' ? '' : Number(val));
                        }}
                        className={inputClass(phaseDaysErr, 'w-10 sm:w-11 text-center py-0.5 px-1 text-xs font-semibold tabular-nums')}
                      />
                    </div>
                  </div>

                  <div className="flex items-center shrink-0 ml-auto sm:order-last">
                    <IconButton title="Move up" onClick={() => onMovePhase(pIdx, -1)} disabled={pIdx === 0}>↑</IconButton>
                    <IconButton title="Move down" onClick={() => onMovePhase(pIdx, 1)} disabled={pIdx === phases.length - 1}>↓</IconButton>
                    <IconButton title="Remove phase" tone="danger" onClick={() => onRemovePhase(pIdx)} disabled={phases.length === 1}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </IconButton>
                  </div>

                  <div className="w-full sm:w-auto sm:flex-1 sm:min-w-[180px] sm:max-w-md">
                    <input
                      type="text"
                      value={p.title}
                      maxLength={LIMITS.phaseTitle.max}
                      onChange={(e) => onChangePhase(pIdx, 'title', e.target.value)}
                      placeholder="Phase Title (e.g. Tamili Brahmi & Epigraphy)*"
                      className={inputClass(phaseTitleErr, 'w-full py-1 px-2.5 text-xs font-semibold')}
                    />
                  </div>
                </div>

                {/* Row 2: What is covered */}
                <div className="max-w-2xl">
                  <input
                    type="text"
                    value={p.details}
                    maxLength={LIMITS.phaseDetails.max}
                    onChange={(e) => onChangePhase(pIdx, 'details', e.target.value)}
                    placeholder="What is covered (e.g. Decipher Tamil Brahmi scripts, study charters & practise rock scribing)*"
                    className={inputClass(phaseDetailsErr, 'w-full py-0.5 px-2 text-xs leading-normal')}
                  />
                </div>

                {/* Row 3: You'll create + Materials in 2 tight columns */}
                <div className="max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={p.outcome}
                    maxLength={LIMITS.phaseOutcome.max}
                    onChange={(e) => onChangePhase(pIdx, 'outcome', e.target.value)}
                    placeholder="You'll create: e.g. Hand-scribed copper tablet (optional)"
                    className={inputClass(err(`${pKey}.outcome`), 'w-full py-0.5 px-2 text-xs')}
                  />
                  <input
                    type="text"
                    value={p.materials}
                    maxLength={LIMITS.phaseMaterials.max}
                    onChange={(e) => onChangePhase(pIdx, 'materials', e.target.value)}
                    placeholder="Materials: e.g. Copper sheets, Stylus (optional)"
                    className={inputClass(err(`${pKey}.materials`), 'w-full py-0.5 px-2 text-xs')}
                  />
                </div>

                {/* Row 4: Error notification if any */}
                {anyPhaseErr && (
                  <p className="text-[11px] font-medium text-red-600 flex items-center gap-1 pt-0.5">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{anyPhaseErr}</span>
                  </p>
                )}
              </div>
            );
          })}

          <AddButton
            onClick={onAddPhase}
            disabled={!days || lastEnd >= days || phases.length >= MAX_PHASES}
          >
            {lastEnd >= days && days > 0
              ? `All ${days} days planned`
              : `+ Add Phase (${phases.length}/${MAX_PHASES})`}
          </AddButton>
        </div>
      )}
    </div>
  );
}

/**
 * Duration options table: each row is a duration students can pick on the Register page,
 * with its own fee. Row 1 is the main option (sets the type and the price on the website).
 */
function DurationOptions({ options, type, bookedSeats = 0, err, onChange, onAdd, onRemove, onMove }) {
  const range = DAY_RANGE[type];
  const cellErr = (i, key) => err(`durations.${i}.${key}`);
  return (
    <div className="space-y-3">
      <div>
        <p className="text-[13px] font-semibold text-[#241A16]">
          Duration options & fees <span className="text-red-600">*</span>
        </p>
        <p className="text-xs leading-relaxed text-[#6B4030]/80">
          Add each duration students can choose, with its fee. <strong className="text-[#4A2C20]">Days is required</strong>: it must strictly be{' '}
          <strong className="text-[#B89555]">{type === 'workshop' ? '1–9 days (single digit) for Workshops' : '10+ days (double digits starting from 10) for Learning Journeys'}</strong>.
          The first row is the main duration shown on the website.
        </p>
      </div>



      {options.map((o, i) => {
        const days = Number(o.days);
        const fee = Number(o.fee);
        const regular = Number(o.original_price);
        const save = regular > fee && fee > 0 ? Math.round(((regular - fee) / regular) * 100) : 0;

        // Immediate live error validation while typing
        const rawDaysStr = String(o.days ?? '').trim();
        let liveDaysError = '';
        if (rawDaysStr !== '') {
          const d = Number(rawDaysStr);
          if (type === 'workshop') {
            if (d >= 10 || rawDaysStr.length >= 2) {
              liveDaysError = 'Double digits not allowed for Workshop! Workshop duration must strictly be 1–9 days (single digit). For 10+ days, switch offering type to Learning Journey.';
            } else if (d < 1) {
              liveDaysError = 'Workshop days must be between 1 and 9.';
            }
          } else if (type === 'journey') {
            if (d < 10) {
              liveDaysError = 'Single digit not allowed for Learning Journey! Duration must start from 10 days (10+ days). Single digits (1–9 days) are strictly for Workshops.';
            } else if (d > 365) {
              liveDaysError = 'Learning Journey days cannot exceed 365.';
            }
          }
        }

        // Live fee validation while typing
        const rawFeeStr = String(o.fee ?? '').trim();
        let liveFeeError = '';
        if (rawFeeStr !== '') {
          const f = Number(rawFeeStr);
          if (f <= 0) {
            liveFeeError = 'Offer fee must be greater than ₹0.';
          } else if (f > MAX_PRICE) {
            liveFeeError = `Offer fee cannot exceed ₹${MAX_PRICE.toLocaleString('en-IN')}.`;
          }
        }

        const rawRegStr = String(o.original_price ?? '').trim();
        let liveRegError = '';
        if (rawRegStr !== '') {
          const r = Number(rawRegStr);
          const f = Number(rawFeeStr);
          if (r <= 0) {
            liveRegError = 'Regular fee must be greater than ₹0.';
          } else if (r > MAX_PRICE) {
            liveRegError = `Regular fee cannot exceed ₹${MAX_PRICE.toLocaleString('en-IN')}.`;
          } else if (f > 0 && r < f) {
            liveRegError = `Regular fee (₹${r.toLocaleString('en-IN')}) must be equal to or higher than offer fee (₹${f.toLocaleString('en-IN')}).`;
          }
        }

        // Immediate live error validation for seats
        const rawSeatsStr = String(o.seats_total ?? '').trim();
        let liveSeatsError = '';
        if (rawSeatsStr !== '') {
          const st = Number(rawSeatsStr);
          if (st < 1 || st > MAX_SEATS) {
            liveSeatsError = `Seats must be between 1 and ${MAX_SEATS}.`;
          } else if (i === 0 && st < bookedSeats) {
            liveSeatsError = `Cannot be lower than ${bookedSeats} booked seats.`;
          }
        } else {
          liveSeatsError = 'Seats is required.';
        }

        const optBooked = o.booked_seats !== undefined ? Number(o.booked_seats) : (i === 0 ? Number(bookedSeats) || 0 : 0);
        const optLeft = Math.max(0, (Number(o.seats_total) || 0) - optBooked);

        const effectiveDaysError = liveDaysError || cellErr(i, 'days');
        const effectiveSeatsError = liveSeatsError || cellErr(i, 'seats_total');
        const effectiveFeeError = liveFeeError || cellErr(i, 'fee');
        const effectiveRegError = liveRegError || cellErr(i, 'original_price');
        const rowErrors = [effectiveDaysError, effectiveSeatsError, effectiveFeeError, effectiveRegError].filter(Boolean);

        return (
          <div key={i} className={`rounded-2xl border p-4 shadow-2xs ${i === 0 ? 'border-[#B89555]/60 bg-[#FCFAF6]' : 'border-[#6B4030]/12 bg-white'}`}>
            {/* Row 1: Days, Fees & Action buttons with uniform top-aligned labels */}
            <div className="flex flex-wrap items-end gap-2.5 sm:gap-4">
              <div className="flex flex-col gap-1 w-20 sm:w-24 shrink-0">
                <label htmlFor={`dur-${i}-days`} className="text-xs font-semibold text-[#6B4030]">
                  Days <span className="text-red-600">*</span>
                </label>
                <input
                  id={`dur-${i}-days`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  value={o.days ?? ''}
                  onKeyDown={handleOnlyNumericKeyDown}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    onChange(i, 'days', val === '' ? '' : Number(val));
                  }}
                  placeholder={type === 'workshop' ? '1–9' : '10+'}
                  aria-label={`Option ${i + 1} days (Required: ${type === 'workshop' ? '1–9 days' : '10+ days'})`}
                  className={inputClass(effectiveDaysError, 'w-full h-10 text-center tabular-nums font-semibold')}
                />
              </div>
              <div className="flex flex-col gap-1 flex-1 sm:flex-initial sm:w-32 min-w-[100px]">
                <label htmlFor={`dur-${i}-fee`} className="text-xs font-semibold text-[#6B4030]">
                  Offer fee ₹ <span className="text-red-600">*</span>
                </label>
                <input
                  id={`dur-${i}-fee`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={o.fee ?? ''}
                  onKeyDown={handleOnlyNumericKeyDown}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    onChange(i, 'fee', val);
                  }}
                  placeholder="5499"
                  aria-label={`Option ${i + 1} offer fee`}
                  className={inputClass(effectiveFeeError, 'w-full h-10 tabular-nums font-semibold')}
                />
              </div>
              <div className="flex flex-col gap-1 flex-1 sm:flex-initial sm:w-36 min-w-[110px]">
                <label htmlFor={`dur-${i}-reg`} className="text-xs font-semibold text-[#6B4030] whitespace-nowrap">
                  Regular fee ₹ <span className="text-[11px] font-normal text-[#6B4030]/60">(optional)</span>
                </label>
                <input
                  id={`dur-${i}-reg`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={o.original_price ?? ''}
                  onKeyDown={handleOnlyNumericKeyDown}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    onChange(i, 'original_price', val);
                  }}
                  placeholder="optional"
                  aria-label={`Option ${i + 1} regular fee`}
                  className={inputClass(effectiveRegError, 'w-full h-10 tabular-nums')}
                />
              </div>
              <div className="flex items-center gap-1 ml-auto sm:ml-auto pb-0.5">
                <IconButton title="Move up" onClick={() => onMove(i, -1)} disabled={i === 0}>↑</IconButton>
                <IconButton title="Move down" onClick={() => onMove(i, 1)} disabled={i === options.length - 1}>↓</IconButton>
                <IconButton title="Remove option" tone="danger" onClick={() => onRemove(i)} disabled={options.length === 1}>
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              </div>
            </div>

            {/* Row 2: Total seats, Booked, Seats left & Cohort Badges with matching top-aligned labels */}
            <div className="mt-3 flex flex-wrap items-end gap-2 sm:gap-4 rounded-xl border border-[#6B4030]/12 bg-[#FAF7F0] p-2.5 sm:p-3">
              <div className="flex flex-col gap-1 flex-1 sm:flex-initial sm:w-24 min-w-[70px]">
                <label htmlFor={`dur-${i}-seats`} className="text-xs font-semibold text-[#6B4030] whitespace-nowrap">
                  Total seats <span className="text-red-600">*</span>
                </label>
                <input
                  id={`dur-${i}-seats`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  value={o.seats_total ?? ''}
                  onKeyDown={handleOnlyNumericKeyDown}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    onChange(i, 'seats_total', val === '' ? '' : Number(val));
                  }}
                  placeholder="35"
                  aria-label={`Option ${i + 1} total seats (1–${MAX_SEATS})`}
                  className={inputClass(effectiveSeatsError, 'w-full h-10 text-center tabular-nums font-semibold bg-white')}
                />
              </div>
              <div className="flex flex-col gap-1 flex-1 sm:flex-initial sm:w-20 min-w-[55px]">
                <span className="text-xs font-semibold text-[#6B4030]">Booked</span>
                <div
                  className="flex h-10 w-full items-center justify-center rounded-xl border border-[#6B4030]/20 bg-white px-2 text-sm font-bold tabular-nums text-[#4A2C20]"
                  title="Enrolled & confirmed students"
                >
                  {optBooked}
                </div>
              </div>
              <div className="flex flex-col gap-1 flex-1 sm:flex-initial sm:w-20 min-w-[60px]">
                <span className="text-xs font-semibold text-[#6B4030] whitespace-nowrap">Seats left</span>
                <div
                  className={`flex h-10 w-full items-center justify-center rounded-xl border px-2 text-sm font-bold tabular-nums ${
                    optLeft > 0 ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-red-300 bg-red-50 text-red-600'
                  }`}
                  title="Remaining seats for enrollment"
                >
                  {optLeft}
                </div>
              </div>
              <div className="w-full sm:w-auto sm:ml-auto flex flex-wrap items-center gap-2 self-center pt-2 sm:pt-0 text-xs text-[#6B4030]">
                {i === 0 && <span className="rounded bg-[#4A2C20] px-2.5 py-1 text-[11px] font-bold text-[#E5B869] tracking-wide">MAIN COHORT</span>}
                {save > 0 && (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-300">
                    Save {save}% (Discount ₹{(regular - fee).toLocaleString('en-IN')})
                  </span>
                )}
              </div>
            </div>
            {rowErrors.length > 0 && (
              <div className="mt-2 space-y-1 border-t border-red-100 pt-1.5">
                {rowErrors.map((errText, errIdx) => (
                  <div key={errIdx} className="flex items-start gap-1 text-xs font-medium text-red-600">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-red-600" />
                    <span>{errText}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Dedicated Roadmap Phases for this specific duration */}
            {type === 'journey' && Number.isInteger(days) && days >= 10 && (
              <DurationRoadmapEditor
                durationIndex={i}
                days={days}
                phases={o.phases || []}
                err={err}
                onChangePhase={(pIdx, field, val) => {
                  const curPhases = [...(o.phases || [])];
                  curPhases[pIdx] = { ...curPhases[pIdx], [field]: val };
                  onChange(i, 'phases', curPhases);
                }}
                onAddPhase={() => {
                  const curPhases = o.phases || [];
                  let interval = 10;
                  if (curPhases.length > 0) {
                    const lastPhase = curPhases[curPhases.length - 1];
                    const pStart = Number(lastPhase.start);
                    const pEnd = Number(lastPhase.end);
                    if (pStart && pEnd && pEnd >= pStart) {
                      interval = pEnd - pStart + 1;
                    }
                  } else if (days && days > 0) {
                    interval = Math.min(10, days);
                  }
                  const lastEnd = curPhases.reduce((m, p) => Math.max(m, Number(p.end) || 0), 0);
                  const start = lastEnd ? lastEnd + 1 : 1;
                  const calculatedEnd = start + interval - 1;
                  const end = days && days >= start ? Math.min(calculatedEnd, days) : calculatedEnd;
                  onChange(i, 'phases', [...curPhases, { start, end, title: '', details: '', outcome: '', materials: '' }]);
                }}
                onRemovePhase={(pIdx) => {
                  onChange(i, 'phases', (o.phases || []).filter((_, idx) => idx !== pIdx));
                }}
                onMovePhase={(pIdx, dir) => {
                  const cur = [...(o.phases || [])];
                  const target = pIdx + dir;
                  if (target < 0 || target >= cur.length) return;
                  [cur[pIdx], cur[target]] = [cur[target], cur[pIdx]];
                  onChange(i, 'phases', cur);
                }}
                onSpreadDays={() => {
                  const cur = o.phases || [];
                  if (!cur.length || !days) return;
                  const ranges = evenDayRanges(days, cur.length);
                  const next = cur.map((p, idx) => {
                    const nums = String(ranges[idx] || '').match(/\d+/g) || [];
                    return {
                      ...p,
                      start: nums[0] ? Number(nums[0]) : p.start,
                      end: nums[1] ? Number(nums[1]) : (nums[0] ? Number(nums[0]) : p.end),
                    };
                  });
                  onChange(i, 'phases', next);
                }}
              />
            )}
          </div>
        );
      })}

      <AddButton onClick={onAdd} disabled={options.length >= 6}>
        Add duration option ({options.length}/6)
      </AddButton>
    </div>
  );
}

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
        <section className="gni-offering py-10 md:py-14" style={{ '--row-bg': bg }}>
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
  let pillarId = null;
  let pillarTitle = '';
  if (state.pillar_id === 'all' || state.pillar_id === '0' || Number(state.pillar_id) === 0) {
    pillarId = 0;
    pillarTitle = 'All Heritage Pillars';
  } else {
    const pillar = pillars.find((p) => String(p.id) === String(state.pillar_id));
    if (pillar) {
      pillarId = Number(pillar.id);
      pillarTitle = pillar.title;
    }
  }
  const seatsTotal = Number(state.seats_total);
  const mainPhases = state.durations[0]?.phases || [];
  const highlights = (state.type === 'journey')
    ? mainPhases.filter((p) => len(p.title)).map((p) => ({
        period: dayLabel(Number(p.start), Number(p.end)),
        title: p.title.trim(),
        details: p.details.trim(),
        outcome: p.outcome ? p.outcome.trim() : '',
        materials: p.materials
          ? (Array.isArray(p.materials) ? p.materials : p.materials.split(',').map((m) => m.trim()).filter(Boolean))
          : [],
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
    duration: buildDuration(state.durations[0]?.days, state.durations[0]?.label || ''),
    mode: state.mode.trim(),
    description: state.description.trim(),
    original_price: Number(state.durations[0]?.original_price) || Number(state.durations[0]?.fee),
    discount_price: Number(state.durations[0]?.fee),
    durations: state.durations.map((o) => ({
      days: Number(o.days),
      label: String(o.label || '').trim(),
      fee: Number(o.fee),
      original_price: Number(o.original_price) || Number(o.fee),
      seats_total: Number(o.seats_total) || 50,
      phases: (o.phases || []).filter((p) => len(p.title)).map((p) => ({
        period: dayLabel(Number(p.start), Number(p.end)),
        title: p.title.trim(),
        details: p.details.trim(),
        outcome: p.outcome ? p.outcome.trim() : '',
        materials: p.materials
          ? (Array.isArray(p.materials) ? p.materials : p.materials.split(',').map((m) => m.trim()).filter(Boolean))
          : [],
      })),
    })),
    seats_total: seatsTotal,
    seats_available: Math.max(0, seatsTotal - bookedSeats),
    image_url: state.image_url.trim() || ((state.type === 'journey') ? '/artisan/pedagogy-practice.jpg' : '/artisan/workshop.jpg'),
    is_active: state.is_active,
    pillar_id: pillarId,
    pillar_title: pillarTitle,
    highlights: JSON.stringify(highlights),
    details: {
      inclusions: state.inclusions.trim(),
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
  const days = Number(state.durations[0]?.days) || 0;
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
    const newRange = DAY_RANGE[type];
    setState((s) => ({
      ...s,
      type,
      durations: s.durations.map((o, i) => {
        const d = Number(o.days);
        let newDays = o.days;
        if (!Number.isInteger(d) || d < newRange.min || d > newRange.max) {
          newDays = type === 'workshop' ? Math.min(Math.max(d || 1, 1), 9) : Math.max(d || (i === 0 ? 30 : 10), 10);
        }
        return { ...o, days: newDays };
      }),
      modules: s.modules.length ? s.modules : [{ day: '', title: '', desc: '' }],
      phases: s.phases,
    }));
  };

  /* ---- journey phase helpers ---- */
  const addPhase = () => {
    let interval = 10;
    if (state.phases.length > 0) {
      const lastPhase = state.phases[state.phases.length - 1];
      const pStart = Number(lastPhase.start);
      const pEnd = Number(lastPhase.end);
      if (pStart && pEnd && pEnd >= pStart) {
        interval = pEnd - pStart + 1;
      }
    } else if (days && days > 0) {
      interval = Math.min(10, days);
    }
    const curEnd = state.phases.reduce((m, p) => Math.max(m, Number(p.end) || 0), 0);
    const start = curEnd ? curEnd + 1 : 1;
    const calculatedEnd = start + interval - 1;
    const end = days && days >= start ? Math.min(calculatedEnd, days) : calculatedEnd;
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
  const seatsTotal = Number(state.seats_total) || 0;

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
                    required
                    htmlFor="oe-pillar"
                    error={err('pillar_id')}
                    hint="Pick the specific pillar this belongs to, or choose 'All Heritage Pillars' if common across disciplines."
                  >
                    <select
                      id="oe-pillar"
                      value={state.pillar_id}
                      onChange={(e) => set('pillar_id', e.target.value)}
                      className={inputClass(Boolean(err('pillar_id')), 'cursor-pointer')}
                    >
                      <option value="" disabled>— Select Heritage Pillar —</option>
                      <option value="all">All Heritage Pillars (Common to all pillars)</option>
                      {pillars.map((p, pIdx) => (
                        <option key={p.id} value={p.id}>
                          Pillar {pIdx + 1}: {p.title}
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
                title={isJourney ? "Durations, Fees & Roadmaps" : "Fee & seats"}
                description={isJourney ? "Set durations and fees. Each duration has its own dedicated roadmap phases configured directly below it." : "Durations and fees students can choose on the Register page. The first option is shown on the website. Seats left update automatically."}
              >
                <DurationOptions
                  options={state.durations}
                  type={state.type}
                  bookedSeats={bookedSeats}
                  err={err}
                  onChange={(i, key, value) => {
                    setItem('durations', i, key, value);
                    if (i === 0 && key === 'seats_total') {
                      set('seats_total', value);
                    }
                  }}
                  onAdd={() => set('durations', [...state.durations, blankOption('', state.type, 35)])}
                  onRemove={(i) => removeItem('durations', i)}
                  onMove={(i, dir) => moveItem('durations', i, dir)}
                />


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
                  <div className="rounded-2xl border border-[#B89555]/30 bg-[#FAF7F0] p-6 text-center">
                    <Compass className="w-8 h-8 mx-auto text-[#B89555] mb-2.5" />
                    <h3 className="font-['Cormorant_Garamond'] text-xl font-bold text-[#241A16]">
                      Multi-Duration Roadmaps Active
                    </h3>
                    <p className="text-xs text-[#6B4030] mt-1.5 max-w-md mx-auto leading-relaxed">
                      Each duration option (e.g. 60 Days, 30 Days) has its own dedicated roadmap phases configured directly above under each duration card in <strong className="text-[#4A2C20]">Section 2 (Durations, Fees & Roadmaps)</strong>.
                    </p>
                    <button
                      type="button"
                      onClick={() => scrollTo('pricing')}
                      className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#4A2C20] text-xs font-semibold text-[#E5B869] hover:bg-[#603929] cursor-pointer shadow-xs"
                    >
                      <span>Jump to Durations & Roadmaps ↑</span>
                    </button>
                  </div>
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
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span className="truncate max-w-md sm:max-w-xl">
                  {errorCount === 1 ? '1 field needs attention: ' : `${errorCount} fields need attention: `}
                  {Object.values(errors)[0]}
                </span>
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
