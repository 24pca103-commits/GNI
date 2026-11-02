/**
 * Application status lifecycle. Admins move an application one step forward at a
 * time and can cancel it at any active step:
 *
 *   Pending ──► Approved ──► Confirmed ──► Completed
 *      │           │            │
 *      ├─► Rejected (only while pending)
 *      └───────────┴────────────┴─► Cancelled
 *
 * Completed, Cancelled and Rejected are final. Once an application is final the
 * student's email can be used to apply for another course (see registrationController).
 * Keep in sync with frontend/src/components/admin/adminFormat.js.
 */

export const PENDING_STATUSES = ['Pending Offline Payment at Campus', 'Pending Verification', 'Pending'];
export const FINAL_STATUSES = ['Completed', 'Cancelled', 'Rejected'];

const NEXT = {
  pending: ['Approved', 'Rejected', 'Cancelled'],
  Approved: ['Confirmed', 'Cancelled'],
  Confirmed: ['Completed', 'Cancelled'],
};

/**
 * Seats: an application takes a seat when it is Approved and keeps it while
 * Confirmed and Completed. Pending applications do not hold a seat, and moving to
 * Cancelled / Rejected releases it, so seat counts are always derived from this list.
 */
export const SEAT_HOLDING_STATUSES = ['Approved', 'Confirmed', 'Completed'];
export const SEAT_HOLDING_SQL = `payment_status IN (${SEAT_HOLDING_STATUSES.map((s) => `'${s}'`).join(', ')})`;

/** Statuses an application in `current` may move to next. */
export function allowedNextStatuses(current) {
  const status = current || PENDING_STATUSES[0];
  if (FINAL_STATUSES.includes(status)) return [];
  if (PENDING_STATUSES.includes(status)) return NEXT.pending;
  return NEXT[status] || [];
}
