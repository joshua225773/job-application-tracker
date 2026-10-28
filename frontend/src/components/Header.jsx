import React from 'react';
import { Briefcase, Plus, RefreshCw } from 'lucide-react';

export const Header = ({ onOpenNewModal, onRefresh, loading }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  TrackApply
                </h1>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200">
                  MERN Pro
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Full-Stack Job Application Tracker & Pipeline Engine
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 sm:px-3 sm:py-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition flex items-center gap-1.5"
              title="Refresh applications"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-600' : ''}`} />
              <span className="hidden md:inline">Refresh</span>
            </button>

            <button
              onClick={onOpenNewModal}
              className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-medium rounded-lg text-sm shadow-sm shadow-sky-600/30 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Application</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
