export const FINE_PAISE_PER_DAY = 1000; // ₹10 per started 24-hour period after the deadline.
const DAY_MS = 24 * 60 * 60 * 1000;

/** Entire days or fractions thereof after due time are charged at ₹10/day.
 * No fine before a valid issue and due date. A returned loan's fine is frozen. */
export function overdueFinePaise(loan, now = new Date()) {
  if (!loan?.issuedAt || !loan.dueAt) return 0;
  if (loan.returnedAt && Number.isInteger(loan.fineAssessedPaise)) return loan.fineAssessedPaise;
  const deadline = new Date(loan.dueAt).getTime();
  const ended = loan.returnedAt ? new Date(loan.returnedAt).getTime() : new Date(now).getTime();
  if (!Number.isFinite(deadline) || !Number.isFinite(ended)) return 0;
  return Math.max(0, Math.ceil((ended - deadline) / DAY_MS)) * FINE_PAISE_PER_DAY;
}

export function fineSummary(loan, now = new Date()) {
  const amountPaise = overdueFinePaise(loan, now);
  const paidPaise = Math.max(0, Number(loan.finePaidPaise) || 0);
  return { fineAmountPaise: amountPaise, fineOutstandingPaise: Math.max(0, amountPaise - paidPaise),
    fineRatePaisePerDay: FINE_PAISE_PER_DAY };
}
