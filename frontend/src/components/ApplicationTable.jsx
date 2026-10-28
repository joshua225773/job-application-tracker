import React from 'react';
import { StatusBadge } from './StatusBadge';
import { FINAL_STATUSES } from '../utils/constants';
import {
  Clock,
  Edit2,
  Trash2,
  GitBranch,
  Lock,
} from 'lucide-react';

export const ApplicationTable = ({
  applications,
  onEdit,
  onStatusTransition,
  onViewTimeline,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 tracking-wider">
            <tr>
              <th className="px-4 py-3.5">ID</th>
              <th className="px-4 py-3.5">Company & Role</th>
              <th className="px-4 py-3.5">Type</th>
              <th className="px-4 py-3.5">Applied Date</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Salary</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applications.map((app) => {
              const isFinal = FINAL_STATUSES.includes(app.status);
              const isDeleteDisabled = app.status === 'Interview' || app.status === 'Offer';

              const formattedDate = app.appliedDate
                ? new Date(app.appliedDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'N/A';

              const formattedSalary = app.expectedSalary
                ? Number(app.expectedSalary).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0,
                  })
                : '—';

              return (
                <tr
                  key={app._id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Application ID */}
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-700 whitespace-nowrap">
                    {app.applicationId}
                  </td>

                  {/* Company & Role */}
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{app.role}</div>
                    <div className="text-xs text-slate-500 font-medium">{app.company}</div>
                  </td>

                  {/* Job Type */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {app.jobType}
                    </span>
                  </td>

                  {/* Applied Date */}
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-600">
                    {formattedDate}
                  </td>

                  {/* Status & Overdue */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge
                      status={app.status}
                      isOverdue={app.isOverdue}
                      size="sm"
                    />
                  </td>

                  {/* Expected Salary */}
                  <td className="px-4 py-3 whitespace-nowrap text-xs font-medium text-slate-700">
                    {formattedSalary}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      {/* Timeline View */}
                      <button
                        onClick={() => onViewTimeline(app)}
                        className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-md transition"
                        title="View status timeline history"
                      >
                        <Clock className="w-4 h-4" />
                      </button>

                      {/* Advance Status */}
                      <button
                        onClick={() => onStatusTransition(app)}
                        disabled={isFinal}
                        className={`p-1.5 rounded-md transition ${
                          isFinal
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-500 hover:text-sky-600 hover:bg-sky-50'
                        }`}
                        title={
                          isFinal
                            ? `Terminal status "${app.status}" cannot be changed`
                            : 'Progress status'
                        }
                      >
                        <GitBranch className="w-4 h-4" />
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => onEdit(app)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition"
                        title="Edit Application"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => onDelete(app)}
                        disabled={isDeleteDisabled}
                        className={`p-1.5 rounded-md transition ${
                          isDeleteDisabled
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                        }`}
                        title={
                          isDeleteDisabled
                            ? 'Applications in Interview or Offer status cannot be deleted.'
                            : 'Delete Application'
                        }
                      >
                        {isDeleteDisabled ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
