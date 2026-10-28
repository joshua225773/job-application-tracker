import React from 'react';
import { X, Clock, Calendar, Building2, Briefcase, Bell, CheckCircle } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { STATUS_CONFIG } from '../utils/constants';

export const TimelineModal = ({ isOpen, onClose, application }) => {
  if (!isOpen || !application) return null;

  const appliedDate = application.appliedDate ? new Date(application.appliedDate) : null;
  const followUpDate = application.followUpDate ? new Date(application.followUpDate) : null;
  const isOverdue = application.isOverdue;

  // Format date helper
  const formatDateTime = (dateVal) => {
    if (!dateVal) return 'N/A';
    const date = new Date(dateVal);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const history = application.statusHistory || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl my-8 overflow-hidden animate-fade-in">
        {/* Modal Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200/70 text-slate-800">
                {application.applicationId}
              </span>
              <StatusBadge
                status={application.status}
                isOverdue={isOverdue}
                size="sm"
              />
            </div>
            <h2 className="text-xl font-bold text-slate-900">{application.role}</h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5 font-medium">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{application.company}</span>
              <span className="text-slate-300">•</span>
              <span>{application.jobType}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Follow-up & Key Dates Info Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-slate-500 font-medium">Application Submitted</p>
                <p className="font-semibold text-slate-900">
                  {appliedDate
                    ? appliedDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Bell
                className={`w-4 h-4 mt-0.5 shrink-0 ${
                  isOverdue ? 'text-rose-600' : 'text-slate-400'
                }`}
              />
              <div>
                <p className="text-slate-500 font-medium">Follow-up Target (+7 Days)</p>
                <p
                  className={`font-semibold ${
                    isOverdue ? 'text-rose-600 font-bold' : 'text-slate-900'
                  }`}
                >
                  {followUpDate
                    ? followUpDate.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'N/A'}
                  {isOverdue && ' (Overdue)'}
                </p>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Application Progression History
              </h3>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {history.map((item, index) => {
                const config = STATUS_CONFIG[item.status] || {
                  dotClass: 'bg-slate-400',
                  badgeClass: 'bg-slate-100 text-slate-700',
                };
                const isLatest = index === history.length - 1;

                return (
                  <div key={item._id || index} className="relative group">
                    {/* Timeline Node Icon */}
                    <div
                      className={`absolute -left-[1.85rem] top-0.5 w-4 h-4 rounded-full border-2 border-white ring-2 ring-slate-200 ${
                        config.dotClass
                      } ${isLatest ? 'scale-110 ring-sky-300' : ''}`}
                    />

                    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs hover:border-slate-300 transition">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${config.badgeClass}`}
                        >
                          {item.status}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {formatDateTime(item.changedAt)}
                        </span>
                      </div>

                      {item.notes ? (
                        <p className="text-xs text-slate-600 mt-1">{item.notes}</p>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No remarks recorded</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
