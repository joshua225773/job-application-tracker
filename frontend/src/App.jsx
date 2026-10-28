import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { MetricsOverview } from './components/MetricsOverview';
import { FilterBar } from './components/FilterBar';
import { ApplicationCard } from './components/ApplicationCard';
import { ApplicationTable } from './components/ApplicationTable';
import { ApplicationFormModal } from './components/ApplicationFormModal';
import { StatusTransitionModal } from './components/StatusTransitionModal';
import { TimelineModal } from './components/TimelineModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { applicationService } from './services/applicationService';
import { Briefcase, AlertCircle, CheckCircle, Info, Sparkles } from 'lucide-react';

export function App() {
  // Data states
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    accepted: 0,
    declined: 0,
    rejected: 0,
    overdue: 0,
  });

  // UI & Filter states
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  // Toast notification
  const [toast, setToast] = useState(null);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [formApiError, setFormApiError] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusAppTarget, setStatusAppTarget] = useState(null);
  const [statusApiError, setStatusApiError] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [timelineAppTarget, setTimelineAppTarget] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteAppTarget, setDeleteAppTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Fetch applications & stats from backend
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [appsRes, statsRes] = await Promise.all([
        applicationService.getApplications({
          status: statusFilter,
          search: searchQuery,
        }),
        applicationService.getStats(),
      ]);

      if (appsRes?.data) {
        setApplications(appsRes.data);
      }
      if (statsRes?.data) {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error('Fetch data error:', err);
      showToast(err.message || 'Failed to connect to backend server.', 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  // Initial load and filter change trigger
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Handle Form Submission (Add or Edit)
  const handleFormSubmit = async (formData) => {
    setIsSubmittingForm(true);
    setFormApiError(null);

    try {
      if (editingApplication) {
        // Edit flow
        const res = await applicationService.update(editingApplication._id, formData);
        showToast(res.message || 'Application updated successfully.');
      } else {
        // Create flow
        const res = await applicationService.create(formData);
        showToast(
          `Application ${res.data?.applicationId || ''} created successfully with status "Applied".`
        );
      }
      setIsFormModalOpen(false);
      setEditingApplication(null);
      fetchAllData();
    } catch (err) {
      console.error('Form submit error:', err);
      setFormApiError(err.message || 'Failed to save application');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Handle Status Transition
  const handleStatusTransition = async (id, nextStatus, notes) => {
    setIsTransitioning(true);
    setStatusApiError(null);
    try {
      const res = await applicationService.transitionStatus(id, nextStatus, notes);
      showToast(res.message || `Status successfully moved to ${nextStatus}.`);
      setIsStatusModalOpen(false);
      setStatusAppTarget(null);
      fetchAllData();
    } catch (err) {
      console.error('Status transition error:', err);
      setStatusApiError(err.message || 'Failed to update status.');
    } finally {
      setIsTransitioning(false);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async (id) => {
    setIsDeleting(true);
    try {
      const res = await applicationService.delete(id);
      showToast(res.message || 'Application deleted successfully.');
      setIsDeleteModalOpen(false);
      setDeleteAppTarget(null);
      fetchAllData();
    } catch (err) {
      console.error('Delete error:', err);
      showToast(err.message || 'Could not delete application.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade-in max-w-md">
          <div
            className={`p-4 rounded-xl shadow-lg border flex items-start gap-3 ${
              toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-800'
                : 'bg-slate-900 text-white border-slate-800'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <p className="text-xs sm:text-sm font-medium">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <Header
        onOpenNewModal={() => {
          setEditingApplication(null);
          setFormApiError(null);
          setIsFormModalOpen(true);
        }}
        onRefresh={fetchAllData}
        loading={loading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Status Metrics Dashboard */}
        <MetricsOverview
          stats={stats}
          currentFilter={statusFilter}
          onSelectStatus={(st) => setStatusFilter(st)}
        />

        {/* Search, Filter & View Controls */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalResults={applications.length}
        />

        {/* Applications List Display */}
        {loading && applications.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <span className="w-8 h-8 border-3 border-sky-500/20 border-t-sky-600 rounded-full animate-spin mb-3" />
            <p className="text-sm font-medium">Loading applications from MongoDB...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-md mx-auto my-8">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              No Applications Found
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              {searchQuery || (statusFilter && statusFilter !== 'all')
                ? 'Try clearing your search query or filters to see more results.'
                : 'Start tracking your career pipeline by adding your first job application.'}
            </p>
            <button
              onClick={() => {
                setEditingApplication(null);
                setFormApiError(null);
                setIsFormModalOpen(true);
              }}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
            >
              Add Application
            </button>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.map((app) => (
              <ApplicationCard
                key={app._id}
                application={app}
                onEdit={(application) => {
                  setEditingApplication(application);
                  setFormApiError(null);
                  setIsFormModalOpen(true);
                }}
                onStatusTransition={(application) => {
                  setStatusAppTarget(application);
                  setStatusApiError(null);
                  setIsStatusModalOpen(true);
                }}
                onViewTimeline={(application) => {
                  setTimelineAppTarget(application);
                  setIsTimelineModalOpen(true);
                }}
                onDelete={(application) => {
                  setDeleteAppTarget(application);
                  setIsDeleteModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <ApplicationTable
            applications={applications}
            onEdit={(application) => {
              setEditingApplication(application);
              setFormApiError(null);
              setIsFormModalOpen(true);
            }}
            onStatusTransition={(application) => {
              setStatusAppTarget(application);
              setStatusApiError(null);
              setIsStatusModalOpen(true);
            }}
            onViewTimeline={(application) => {
              setTimelineAppTarget(application);
              setIsTimelineModalOpen(true);
            }}
            onDelete={(application) => {
              setDeleteAppTarget(application);
              setIsDeleteModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Modals */}
      <ApplicationFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingApplication(null);
          setFormApiError(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingApplication}
        isSubmitting={isSubmittingForm}
        apiError={formApiError}
        clearError={() => setFormApiError(null)}
      />

      <StatusTransitionModal
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setStatusAppTarget(null);
          setStatusApiError(null);
        }}
        application={statusAppTarget}
        onTransition={handleStatusTransition}
        isSubmitting={isTransitioning}
        error={statusApiError}
      />

      <TimelineModal
        isOpen={isTimelineModalOpen}
        onClose={() => {
          setIsTimelineModalOpen(false);
          setTimelineAppTarget(null);
        }}
        application={timelineAppTarget}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteAppTarget(null);
        }}
        application={deleteAppTarget}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      {/* Clean Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-4 text-center text-xs text-slate-500">
        <p>Job Application Tracker (MERN) • Exit Examination Full Stack Assessment</p>
      </footer>
    </div>
  );
}

export default App;
