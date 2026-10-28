import React from 'react';
import {
  FileText,
  Clock,
  Video,
  Gift,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FolderMinus,
} from 'lucide-react';

export const MetricsOverview = ({ stats, currentFilter, onSelectStatus }) => {
  const cards = [
    {
      key: 'all',
      status: 'all',
      label: 'Total Tracked',
      count: stats?.total ?? 0,
      icon: FileText,
      border: 'border-slate-200',
      bg: 'bg-white',
      accent: 'text-slate-700',
      badgeColor: 'bg-slate-100 text-slate-800',
    },
    {
      key: 'applied',
      status: 'Applied',
      label: 'Applied',
      count: stats?.applied ?? 0,
      icon: Clock,
      border: 'border-blue-200',
      bg: 'bg-white',
      accent: 'text-blue-600',
      badgeColor: 'bg-blue-50 text-blue-700',
    },
    {
      key: 'interview',
      status: 'Interview',
      label: 'Interviewing',
      count: stats?.interview ?? 0,
      icon: Video,
      border: 'border-purple-200',
      bg: 'bg-white',
      accent: 'text-purple-600',
      badgeColor: 'bg-purple-50 text-purple-700',
    },
    {
      key: 'offer',
      status: 'Offer',
      label: 'Job Offers',
      count: stats?.offer ?? 0,
      icon: Gift,
      border: 'border-amber-200',
      bg: 'bg-white',
      accent: 'text-amber-600',
      badgeColor: 'bg-amber-50 text-amber-700',
    },
    {
      key: 'accepted',
      status: 'Accepted',
      label: 'Accepted',
      count: stats?.accepted ?? 0,
      icon: CheckCircle2,
      border: 'border-emerald-200',
      bg: 'bg-white',
      accent: 'text-emerald-600',
      badgeColor: 'bg-emerald-50 text-emerald-700',
    },
    {
      key: 'declined',
      status: 'Declined',
      label: 'Declined',
      count: stats?.declined ?? 0,
      icon: FolderMinus,
      border: 'border-slate-200',
      bg: 'bg-white',
      accent: 'text-slate-600',
      badgeColor: 'bg-slate-100 text-slate-700',
    },
    {
      key: 'rejected',
      status: 'Rejected',
      label: 'Rejected',
      count: stats?.rejected ?? 0,
      icon: XCircle,
      border: 'border-rose-200',
      bg: 'bg-white',
      accent: 'text-rose-600',
      badgeColor: 'bg-rose-50 text-rose-700',
    },
  ];

  return (
    <div className="space-y-3">
      {/* Follow-up Overdue Banner if overdue count > 0 */}
      {stats?.overdue > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3 text-rose-800">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-rose-100 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">
                {stats.overdue} Application{stats.overdue > 1 ? 's' : ''} Require Immediate Follow-up
              </p>
              <p className="text-xs text-rose-600 hidden sm:block">
                More than 7 days have elapsed since initial submission with no progress.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectStatus('Applied')}
            className="text-xs font-semibold px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition shrink-0"
          >
            Review Overdue
          </button>
        </div>
      )}

      {/* Grid of status counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3.5">
        {cards.map((card) => {
          const Icon = card.icon;
          const isSelected =
            (card.status === 'all' && (!currentFilter || currentFilter === 'all')) ||
            currentFilter === card.status;

          return (
            <button
              key={card.key}
              onClick={() => onSelectStatus(card.status)}
              className={`text-left p-3 sm:p-3.5 rounded-xl border transition-all relative overflow-hidden group ${
                isSelected
                  ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50/40 shadow-xs'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium text-slate-500 group-hover:text-slate-700 truncate`}>
                  {card.label}
                </span>
                <Icon className={`w-4 h-4 ${card.accent}`} />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {card.count}
                </span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
