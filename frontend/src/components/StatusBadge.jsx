import React from 'react';
import { STATUS_CONFIG } from '../utils/constants';
import { AlertCircle } from 'lucide-react';

export const StatusBadge = ({ status, isOverdue = false, size = 'md' }) => {
  const config = STATUS_CONFIG[status] || {
    label: status || 'Unknown',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/10',
    dotClass: 'bg-slate-400',
  };

  const sizeClasses = size === 'sm'
    ? 'text-xs px-2 py-0.5'
    : 'text-xs md:text-sm px-2.5 py-1';

  return (
    <div className="inline-flex items-center gap-1.5 flex-wrap">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-medium border ring-1 ${config.badgeClass} ${sizeClasses}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
        {config.label}
      </span>

      {isOverdue && status === 'Applied' && (
        <span
          className="inline-flex items-center gap-1 rounded-full bg-rose-500 text-white text-[11px] font-semibold px-2 py-0.5 shadow-sm shadow-rose-200 animate-pulse"
          title="7+ days have elapsed since applied date without a status update"
        >
          <AlertCircle className="w-3 h-3" />
          Follow-up Overdue
        </span>
      )}
    </div>
  );
};
