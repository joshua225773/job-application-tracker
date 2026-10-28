import React from 'react';
import { StatusBadge } from './StatusBadge';
import { FINAL_STATUSES } from '../utils/constants';
import {
  Calendar,
  Building2,
  DollarSign,
  FileText,
  Clock,
  Edit2,
  Trash2,
  GitBranch,
  Lock,
} from 'lucide-react';

export const ApplicationCard = ({
  application,
  onEdit,
  onStatusTransition,
  onViewTimeline,
  onDelete,
}) => {
  const isFinal = FINAL_STATUSES.includes(application.status);
  const isDeleteDisabled = application.status === 'Interview' || application.status === 'Offer';

  const formattedDate = application.appliedDate
    ? new Date(application.appliedDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A';

  const formattedSalary = application.expectedSalary
    ? Number(application.expectedSalary).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      })
    : null;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Top Header Strip */}
      <div className="p-4 sm:p-5 space-y-3.5">
        <div className="flex items-start justify-between gap-2">
          {/* Application ID Tag */}
          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 tracking-wide">
            {application.applicationId}
          </span>

          {/* Status Badge + Overdue Alert */}
          <StatusBadge
            status={application.status}
            isOverdue={application.isOverdue}
            size="sm"
          />
        </div>

        {/* Company & Role */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-sky-700 transition tracking-tight">
            {application.role}
          </h3>
          <div className="flex items-center gap-1.5 text-slate-600 font-medium text-sm mt-0.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{application.company}</span>
          </div>
        </div>

        {/* Badges / Meta row */}
        <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
          {/* Job Type */}
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200">
            {application.jobType}
          </span>

          {/* Applied Date */}
          <span className="inline-flex items-center gap-1 text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Applied: {formattedDate}
          </span>

          {/* Expected Salary if available */}
          {formattedSalary && (
            <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
              {formattedSalary}
            </span>
          )}
        </div>

        {/* Notes preview if present */}
        {application.notes && (
          <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 line-clamp-2">
            {application.notes}
          </p>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
        {/* Timeline trigger */}
        <button
          onClick={() => onViewTimeline(application)}
          className="text-slate-600 hover:text-sky-700 font-medium px-2 py-1.5 rounded-md hover:bg-slate-100 transition flex items-center gap-1"
          title="View status timeline history"
        >
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Timeline</span>
        </button>

        <div className="flex items-center gap-1">
          {/* Status Change Button */}
          <button
            onClick={() => onStatusTransition(application)}
            disabled={isFinal}
            className={`px-2 py-1.5 rounded-md font-medium transition flex items-center gap-1 ${
              isFinal
                ? 'text-slate-400 cursor-not-allowed bg-slate-100/50'
                : 'text-sky-700 hover:bg-sky-50'
            }`}
            title={
              isFinal
                ? `Terminal status "${application.status}" cannot be changed`
                : 'Progress application status'
            }
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Advance</span>
          </button>

          {/* Edit Button */}
          <button
            onClick={() => onEdit(application)}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition"
            title="Edit Application"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {/* Delete Button (disabled for Interview / Offer) */}
          <button
            onClick={() => onDelete(application)}
            disabled={isDeleteDisabled}
            className={`p-1.5 rounded-md transition relative group/del ${
              isDeleteDisabled
                ? 'text-slate-300 cursor-not-allowed bg-slate-100/50'
                : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
            }`}
            title={
              isDeleteDisabled
                ? 'Applications in Interview or Offer status cannot be deleted.'
                : 'Delete Application'
            }
          >
            {isDeleteDisabled ? (
              <Lock className="w-3.5 h-3.5" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
