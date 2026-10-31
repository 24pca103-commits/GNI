/** Formatting and status helpers shared by the admin views. */

export const formatINR = (n) => `₹${(Number(n) || 0).toLocaleString('en-IN')}`;

export const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const DEFAULT_STATUS = 'Pending Offline Payment at Campus';

// Statuses accepted by the backend (adminController validStatuses)
export const STATUS_OPTIONS = [
  { value: 'Pending Offline Payment at Campus', label: 'Pending payment' },
  { value: 'Pending Verification', label: 'Pending verification' },
  { value: 'Confirmed', label: 'Confirmed' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Completed', label: 'Completed course' },
  { value: 'Cancelled', label: 'Cancelled' },
  { value: 'Rejected', label: 'Rejected' },
];

/** 'pending' | 'confirmed' | 'closed' */
export function statusGroup(status) {
  const s = status || DEFAULT_STATUS;
  if (s === 'Confirmed' || s === 'Approved' || s === 'Completed') return 'confirmed';
  if (s === 'Cancelled' || s === 'Rejected') return 'closed';
  return 'pending';
}
