'use client';

import React from 'react';
import { SortOption } from '../../types';
import { useNotices } from '../../context/NoticeContext';
import { ArrowUpDown } from 'lucide-react';

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'latest', label: 'Latest First' },
  { id: 'oldest', label: 'Oldest First' },
  { id: 'most_upvoted', label: 'Most Upvoted' },
  { id: 'most_viewed', label: 'Most Viewed' },
  { id: 'expiring_soon', label: 'Expiring Soon' },
];

export const SortDropdown: React.FC = () => {
  const { filters, updateFilter } = useNotices();

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-slate-500 hidden sm:inline flex items-center gap-1">
        <ArrowUpDown className="w-3.5 h-3.5" />
        Sort:
      </span>
      <select
        value={filters.sortBy}
        onChange={(e) => updateFilter('sortBy', e.target.value as SortOption)}
        className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900 cursor-pointer shadow-2xs"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
