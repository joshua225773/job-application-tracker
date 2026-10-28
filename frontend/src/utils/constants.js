export const STATUS_LIST = [
  'Applied',
  'Interview',
  'Offer',
  'Accepted',
  'Declined',
  'Rejected',
];

export const FINAL_STATUSES = ['Accepted', 'Declined', 'Rejected'];

export const ALLOWED_TRANSITIONS = {
  Applied: ['Interview', 'Rejected'],
  Interview: ['Offer', 'Rejected'],
  Offer: ['Accepted', 'Declined'],
  Accepted: [],
  Declined: [],
  Rejected: [],
};

export const JOB_TYPES = ['Full-time', 'Internship', 'Contract'];

export const STATUS_CONFIG = {
  Applied: {
    label: 'Applied',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/10',
    dotClass: 'bg-blue-500',
    bgSoft: 'bg-blue-50',
    borderSoft: 'border-blue-100',
  },
  Interview: {
    label: 'Interview',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/10',
    dotClass: 'bg-purple-500',
    bgSoft: 'bg-purple-50',
    borderSoft: 'border-purple-100',
  },
  Offer: {
    label: 'Offer',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/10',
    dotClass: 'bg-amber-500',
    bgSoft: 'bg-amber-50',
    borderSoft: 'border-amber-100',
  },
  Accepted: {
    label: 'Accepted',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10',
    dotClass: 'bg-emerald-500',
    bgSoft: 'bg-emerald-50',
    borderSoft: 'border-emerald-100',
  },
  Declined: {
    label: 'Declined',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300 ring-slate-500/10',
    dotClass: 'bg-slate-500',
    bgSoft: 'bg-slate-50',
    borderSoft: 'border-slate-200',
  },
  Rejected: {
    label: 'Rejected',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/10',
    dotClass: 'bg-rose-500',
    bgSoft: 'bg-rose-50',
    borderSoft: 'border-rose-100',
  },
};
