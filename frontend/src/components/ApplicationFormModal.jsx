import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Building2, Briefcase, Calendar, DollarSign, FileText } from 'lucide-react';
import { JOB_TYPES } from '../utils/constants';

export const ApplicationFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
  apiError = null,
  clearError,
}) => {
  const isEditing = Boolean(initialData && initialData._id);

  // Form states
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    jobType: 'Full-time',
    appliedDate: '',
    expectedSalary: '',
    notes: '',
  });

  const [formValidationErrors, setFormValidationErrors] = useState({});

  // Maximum allowed date is today's local date (YYYY-MM-DD)
  const todayString = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company || '',
        role: initialData.role || '',
        jobType: initialData.jobType || 'Full-time',
        appliedDate: initialData.appliedDate
          ? new Date(initialData.appliedDate).toISOString().split('T')[0]
          : todayString,
        expectedSalary:
          initialData.expectedSalary !== undefined && initialData.expectedSalary !== null
            ? initialData.expectedSalary
            : '',
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        company: '',
        role: '',
        jobType: 'Full-time',
        appliedDate: todayString,
        expectedSalary: '',
        notes: '',
      });
    }
    setFormValidationErrors({});
    if (clearError) clearError();
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific field validation error when edited
    if (formValidationErrors[name]) {
      setFormValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (clearError) clearError();
  };

  const validate = () => {
    const errors = {};

    if (!formData.company.trim()) {
      errors.company = 'Company name is required';
    }

    if (!formData.role.trim()) {
      errors.role = 'Job role is required';
    }

    if (!formData.jobType) {
      errors.jobType = 'Job type is required';
    }

    if (!isEditing) {
      if (!formData.appliedDate) {
        errors.appliedDate = 'Applied date is required';
      } else {
        const selected = new Date(formData.appliedDate);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (selected > today) {
          errors.appliedDate = 'Applied date cannot be a future date';
        }
      }
    }

    if (formData.expectedSalary && Number(formData.expectedSalary) < 0) {
      errors.expectedSalary = 'Salary must be a positive number';
    }

    setFormValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg my-8 overflow-hidden animate-fade-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isEditing ? 'Edit Job Application' : 'Add New Application'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? `Updating ${initialData?.applicationId} • Application ID and Applied Date are fixed`
                : 'Auto-generates company-scoped ID and calculates 7-day follow-up target'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* API Error / Duplicate Warning Banner (HTTP 409 or 400) */}
          {apiError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Unable to Save Application</p>
                <p className="text-xs text-rose-700 mt-0.5">{apiError}</p>
              </div>
            </div>
          )}

          {/* Readonly Application ID & Status for Edit Mode */}
          {isEditing && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Application ID:</span>
              <span className="font-mono font-bold text-slate-800 px-2 py-0.5 rounded bg-white border border-slate-200">
                {initialData?.applicationId} (Immutable)
              </span>
            </div>
          )}

          {/* Company Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Company Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Google, Infosys, Microsoft"
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition ${
                  formValidationErrors.company ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
            </div>
            {formValidationErrors.company && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{formValidationErrors.company}</p>
            )}
          </div>

          {/* Job Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Job Role <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Full Stack Developer, SDE 1"
                className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition ${
                  formValidationErrors.role ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
            </div>
            {formValidationErrors.role && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{formValidationErrors.role}</p>
            )}
          </div>

          {/* Job Type & Applied Date (Two Column Row) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Job Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Job Type <span className="text-rose-500">*</span>
              </label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              >
                {JOB_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Applied Date (Immutable when editing) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Applied Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  name="appliedDate"
                  value={formData.appliedDate}
                  onChange={handleChange}
                  max={todayString}
                  disabled={isEditing}
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition ${
                    isEditing ? 'cursor-not-allowed bg-slate-100 text-slate-500' : ''
                  } ${
                    formValidationErrors.appliedDate ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  }`}
                />
              </div>
              {formValidationErrors.appliedDate && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{formValidationErrors.appliedDate}</p>
              )}
              {isEditing && (
                <p className="text-[11px] text-slate-400 mt-1">Applied date cannot be changed.</p>
              )}
            </div>
          </div>

          {/* Expected Salary (optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Expected Annual Salary <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                name="expectedSalary"
                value={formData.expectedSalary}
                onChange={handleChange}
                placeholder="e.g. 85000"
                min="0"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              />
            </div>
            {formValidationErrors.expectedSalary && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{formValidationErrors.expectedSalary}</p>
            )}
          </div>

          {/* Notes (optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Notes & Highlights <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="e.g. Referred by Jane, applied on LinkedIn, prepared system design notes..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 disabled:bg-sky-400 rounded-xl shadow-sm shadow-sky-600/30 transition flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? 'Save Changes' : 'Create Application'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
