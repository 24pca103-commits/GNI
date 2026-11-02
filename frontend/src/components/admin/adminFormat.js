/** Formatting and status helpers shared by the admin views. */

export const formatINR = (n) => `₹${(Number(n) || 0).toLocaleString('en-IN')}`;

export const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const DEFAULT_STATUS = 'Pending Offline Payment at Campus';

/*
 * Application status lifecycle (mirrors backend/models/registrationStatus.js):
 *   Pending → Approved → Confirmed → Completed, one step at a time.
 *   Rejected only while pending; Cancelled from any active step.
 *   Completed / Cancelled / Rejected are final.
 */
export const PENDING_STATUSES = ['Pending Offline Payment at Campus', 'Pending Verification', 'Pending'];
export const FINAL_STATUSES = ['Completed', 'Cancelled', 'Rejected'];

const NEXT = {
  pending: ['Approved', 'Rejected', 'Cancelled'],
  Approved: ['Confirmed', 'Cancelled'],
  Confirmed: ['Completed', 'Cancelled'],
};

export function allowedNextStatuses(current) {
  const status = current || DEFAULT_STATUS;
  if (FINAL_STATUSES.includes(status)) return [];
  if (PENDING_STATUSES.includes(status)) return NEXT.pending;
  return NEXT[status] || [];
}

export const isFinalStatus = (status) => FINAL_STATUSES.includes(status);

/** Approved, Confirmed and Completed applications hold a seat (mirrors SEAT_HOLDING_STATUSES on the server). */
export const SEAT_HOLDING_STATUSES = ['Approved', 'Confirmed', 'Completed'];
export const holdsSeat = (status) => SEAT_HOLDING_STATUSES.includes(status);

/** How each status reads in the admin. */
export const STATUS_LABEL = {
  'Pending Offline Payment at Campus': 'Pending payment',
  'Pending Verification': 'Pending verification',
  Pending: 'Pending',
  Approved: 'Approved',
  Confirmed: 'Confirmed',
  Completed: 'Completed course',
  Cancelled: 'Cancelled',
  Rejected: 'Rejected',
};

/** The action an admin picks to move an application into each status. */
export const STATUS_ACTION = {
  Approved: 'Approve application',
  Confirmed: 'Confirm payment',
  Completed: 'Mark course completed',
  Rejected: 'Reject application',
  Cancelled: 'Cancel application',
};

export const statusLabel = (status) => STATUS_LABEL[status || DEFAULT_STATUS] || status;

/** 'pending' | 'confirmed' | 'closed' */
export function statusGroup(status) {
  const s = status || DEFAULT_STATUS;
  if (s === 'Confirmed' || s === 'Approved' || s === 'Completed') return 'confirmed';
  if (s === 'Cancelled' || s === 'Rejected') return 'closed';
  return 'pending';
}

/** Tailwind classes for admin text inputs (red when the field has an error). */
const inputBase =
  'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#241A16] placeholder:text-[#6B4030]/40 transition-colors focus:outline-none focus:ring-2 cursor-text select-text';
const inputOk = 'border-[#6B4030]/20 focus:border-[#B89555] focus:ring-[#B89555]/20';
const inputBad = 'border-red-500 bg-red-50 focus:border-red-600 focus:ring-red-200';

export function inputClass(error, extra = '') {
  return `${inputBase} ${error ? inputBad : inputOk} ${extra}`;
}
