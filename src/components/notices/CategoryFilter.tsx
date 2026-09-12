'use client';

import React from 'react';
import { NoticeCategory } from '../../types';
import { useNotices } from '../../context/NoticeContext';
import {
  GraduationCap,
  Calendar,
  Briefcase,
  Trophy,
  Users,
  LayoutGrid,
  Tag,
} from 'lucide-react';

const CATEGORIES: { id: NoticeCategory | 'All'; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'All', label: 'All Notices', icon: LayoutGrid },
  { id: 'Academic', label: 'Academic', icon: GraduationCap },
  { id: 'Events', label: 'Events', icon: Calendar },
  { id: 'Internships', label: 'Internships', icon: Briefcase },
  { id: 'Competitions', label: 'Competitions', icon: Trophy },
  { id: 'Clubs', label: 'Clubs', icon: Users },
  { id: 'General', label: 'General', icon: Tag },
];

export const CategoryFilter: React.FC = () => {
  const { filters, updateFilter } = useNotices();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isSelected = filters.category === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => updateFilter('category', cat.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
              isSelected
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-400' : 'text-slate-400'}`} />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
