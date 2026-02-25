// Payment Tranche Templates by Format
// Each format has different payment terms

export interface Tranche {
  number: number;
  name: string;
  percentage: number;
  milestone: string;
}

export interface FormatPaymentTerms {
  format: string;
  label: string;
  tranches: Tranche[];
  totalTranches: number;
}

export const PAYMENT_TERMS: FormatPaymentTerms[] = [
  {
    format: 'film',
    label: 'Feature Film',
    totalTranches: 4,
    tranches: [
      { number: 1, name: 'Signing Amount', percentage: 20, milestone: 'Agreement Signed' },
      { number: 2, name: 'Pre-Production', percentage: 30, milestone: 'Script Lock + Casting Done' },
      { number: 3, name: 'Production Complete', percentage: 30, milestone: 'Shoot Wrapped' },
      { number: 4, name: 'Final Delivery', percentage: 20, milestone: 'Final Master Delivered' },
    ],
  },
  {
    format: 'web_series',
    label: 'Web Series',
    totalTranches: 5,
    tranches: [
      { number: 1, name: 'Signing Amount', percentage: 15, milestone: 'Agreement Signed' },
      { number: 2, name: 'Pre-Production', percentage: 20, milestone: 'Scripts + Casting Done' },
      { number: 3, name: 'Production - Part 1', percentage: 25, milestone: '50% Episodes Shot' },
      { number: 4, name: 'Production Complete', percentage: 25, milestone: 'All Episodes Shot' },
      { number: 5, name: 'Final Delivery', percentage: 15, milestone: 'All Episodes Delivered' },
    ],
  },
  {
    format: 'microdrama',
    label: 'Microdrama',
    totalTranches: 3,
    tranches: [
      { number: 1, name: 'Signing Amount', percentage: 30, milestone: 'Agreement Signed' },
      { number: 2, name: 'Production Complete', percentage: 40, milestone: 'Shoot Wrapped' },
      { number: 3, name: 'Final Delivery', percentage: 30, milestone: 'Final Delivery' },
    ],
  },
  {
    format: 'documentary',
    label: 'Documentary',
    totalTranches: 4,
    tranches: [
      { number: 1, name: 'Signing Amount', percentage: 25, milestone: 'Agreement Signed' },
      { number: 2, name: 'Research & Pre-Production', percentage: 25, milestone: 'Research Complete' },
      { number: 3, name: 'Production Complete', percentage: 25, milestone: 'All Footage Shot' },
      { number: 4, name: 'Final Delivery', percentage: 25, milestone: 'Final Cut Delivered' },
    ],
  },
  {
    format: 'other',
    label: 'Other',
    totalTranches: 3,
    tranches: [
      { number: 1, name: 'Signing Amount', percentage: 30, milestone: 'Agreement Signed' },
      { number: 2, name: 'Production Complete', percentage: 40, milestone: 'Production Done' },
      { number: 3, name: 'Final Delivery', percentage: 30, milestone: 'Delivered' },
    ],
  },
];

export function getPaymentTerms(format: string): FormatPaymentTerms {
  return PAYMENT_TERMS.find(pt => pt.format === format) || PAYMENT_TERMS[4]; // Default to 'other'
}

export function calculateTrancheAmount(totalBudget: number, percentage: number): number {
  return Math.round(totalBudget * (percentage / 100));
}

// Project status flow
export const PROJECT_STATUS_FLOW = {
  draft: { label: 'Draft', next: 'in_review', canEdit: true, canLock: false },
  in_review: { label: 'In Review', next: 'approved', canEdit: true, canLock: false },
  approved: { label: 'Approved', next: 'locked', canEdit: true, canLock: true },
  locked: { label: 'Locked', next: 'in_production', canEdit: false, canLock: false },
  in_production: { label: 'In Production', next: 'post_production', canEdit: false, canLock: false },
  post_production: { label: 'Post Production', next: 'delivered', canEdit: false, canLock: false },
  delivered: { label: 'Delivered', next: 'released', canEdit: false, canLock: false },
  released: { label: 'Released', next: null, canEdit: false, canLock: false },
  on_hold: { label: 'On Hold', next: null, canEdit: false, canLock: false },
  cancelled: { label: 'Cancelled', next: null, canEdit: false, canLock: false },
};
