'use client';

import React, { useState } from 'react';
import { Department, TargetYear, TargetAudience, NoticeFilterStatus } from '../../types';
import { useNotices } from '../../context/NoticeContext';
import { SlidersHorizontal, RotateCcw, ChevronDown, ChevronUp, Pin } from 'lucide-react';

export const AdvancedFilters: React.FC = () => {
  const { filters, updateFilter, resetFilters } = useNotices();
  const [isOpen, setIsOpen] = useState(false);

  const activeCount =
    (filters.department !== 'All Departments' ? 1 : 0) +
    (filters.year !== 'All Years' ? 1 : 0) +
    (filters.audience !== 'Everyone' ? 1 : 0) +
    (filters.status !== 'active' ? 1 : 0) +
    (filters.pinnedOnly ? 1 : 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden mb-4">
      {/* Accordion Toggle Bar */}
      <div className="px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-blue-900 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4 text-teal-600" />
          <span>Filter Announcements</span>
          {activeCount > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-900 rounded-full text-[10px] font-extrabold">
              {activeCount} active
            </span>
          )}
          {isOpen ? (
            <ChevronUp className="w-3.5 h-3.5 ml-1 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 ml-1 text-slate-400" />
          )}
        </button>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Filter Body */}
      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Department Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
              Department
            </label>
            <select
              value={filters.department}
              onChange={(e) => updateFilter('department', e.target.value as Department)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-blue-900 focus:outline-none"
            >
              <option value="All Departments">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Biotechnology">Biotechnology</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
              Target Year
            </label>
            <select
              value={filters.year}
              onChange={(e) => updateFilter('year', e.target.value as TargetYear)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-blue-900 focus:outline-none"
            >
              <option value="All Years">All Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          {/* Audience Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
              Target Audience
            </label>
            <select
              value={filters.audience}
              onChange={(e) => updateFilter('audience', e.target.value as TargetAudience)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-blue-900 focus:outline-none"
            >
              <option value="Everyone">Everyone</option>
              <option value="Students">Students Only</option>
              <option value="Faculty">Faculty Only</option>
            </select>
          </div>

          {/* Lifecycle Status (Active / Expired) */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
              Notice Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value as NoticeFilterStatus)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-blue-900 focus:outline-none"
            >
              <option value="active">Active Only</option>
              <option value="expired">Expired Notices</option>
              <option value="all">All (Active & Expired)</option>
            </select>
          </div>

          {/* Pinned Only Toggle */}
          <div className="flex flex-col justify-end">
            <button
              type="button"
              onClick={() => updateFilter('pinnedOnly', !filters.pinnedOnly)}
              className={`w-full px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                filters.pinnedOnly
                  ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Pin className={`w-3.5 h-3.5 ${filters.pinnedOnly ? 'text-amber-600 fill-amber-600' : 'text-slate-400'}`} />
              <span>Pinned Only</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
