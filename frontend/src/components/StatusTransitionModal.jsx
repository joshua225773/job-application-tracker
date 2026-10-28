import React, { useState, useEffect } from 'react';
import { X, GitBranch, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ALLOWED_TRANSITIONS, FINAL_STATUSES, STATUS_CONFIG } from '../utils/constants';

export const StatusTransitionModal = ({
  isOpen,
  onClose,
  application,
  onTransition,
  isSubmitting = false,
  error = null,
}) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [transitionNotes, setTransitionNotes] = useState('');

  const currentStatus = application?.status || 'Applied';
  const allowedNext = ALLOWED_TRANSITIONS[currentStatus] || [];
  const isFinal = FINAL_STATUSES.includes(currentStatus);

  useEffect(() => {
    if (allowedNext.length > 0) {
      setSelectedStatus(allowedNext[0]);
    } else {
      setSelectedStatus('');
    }
    setTransitionNotes('');
  }, [application, isOpen]);

  if (!isOpen || !application) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedStatus) return;
    onTransition(application._id, selectedStatus, transitionNotes);
  };

  const currentConfig = STATUS_CONFIG[currentStatus] || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md my-8 overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
              <GitBranch className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Update Application Status
              </h2>
              <p className="text-xs text-slate-500">
                {application.role} • {application.company} ({application.applicationId})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Current Status Display */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Current Stage
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${currentConfig.badgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${currentConfig.dotClass}`} />
              {currentStatus}
            </span>
          </div>

          {/* State Machine Transition Options */}
          {isFinal ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
              <p className="font-semibold mb-1">Terminal Status Reached</p>
              <p>
                This application is marked as <strong>{currentStatus}</strong>. Terminal statuses
                are final and cannot be transitioned further per the workflow specification.
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Next Stage <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2">
                  {allowedNext.map((nextOption) => {
                    const isSelected = selectedStatus === nextOption;
                    const nextConfig = STATUS_CONFIG[nextOption] || {};

                    return (
                      <label
                        key={nextOption}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                          isSelected
                            ? 'border-sky-500 bg-sky-50/50 ring-2 ring-sky-500/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="nextStatus"
                            value={nextOption}
                            checked={isSelected}
                            onChange={() => setSelectedStatus(nextOption)}
                            className="text-sky-600 focus:ring-sky-500 h-4 w-4"
                          />
                          <span className="text-sm font-semibold text-slate-900">
                            {nextOption}
                          </span>
                        </div>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full border ${nextConfig.badgeClass}`}
                        >
                          Allowed Transition
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Transition Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Milestone Notes <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <textarea
                  value={transitionNotes}
                  onChange={(e) => setTransitionNotes(e.target.value)}
                  placeholder="e.g. Cleared round 1 technical interview, received offer letter with signing bonus..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition resize-none"
                />
              </div>
            </>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>

            {!isFinal && (
              <button
                type="submit"
                disabled={isSubmitting || !selectedStatus}
                className="px-5 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 rounded-xl shadow-sm shadow-sky-600/30 transition flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Transition</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
