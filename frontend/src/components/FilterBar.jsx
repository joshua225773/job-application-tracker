import React from 'react';
import { Search, X, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { STATUS_LIST } from '../utils/constants';

export const FilterBar = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  viewMode,
  onViewModeChange,
  totalResults,
}) => {
  const hasActiveFilters = (statusFilter && statusFilter !== 'all') || searchQuery.trim() !== '';

  const clearFilters = () => {
    onSearchChange('');
    onStatusChange('all');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by company name (e.g. Google, Infosys)..."
            className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Dropdown Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-48">
            <select
              value={statusFilter || 'all'}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 pr-8 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition cursor-pointer"
            >
              <option value="all">All Statuses</option>
              {STATUS_LIST.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* View Mode Toggle: Cards / Table */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => onViewModeChange('cards')}
              className={`p-1.5 rounded-md transition ${
                viewMode === 'cards'
                  ? 'bg-white text-sky-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-md transition ${
                viewMode === 'table'
                  ? 'bg-white text-sky-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter indicator & count */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
        <span>
          Showing <strong className="text-slate-700 font-semibold">{totalResults}</strong> application{totalResults === 1 ? '' : 's'}
        </span>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Clear active filters
          </button>
        )}
      </div>
    </div>
  );
};
