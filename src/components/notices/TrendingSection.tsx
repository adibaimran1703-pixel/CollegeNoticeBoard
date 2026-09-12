'use client';

import React from 'react';
import { useNotices } from '../../context/NoticeContext';
import { NoticeCard } from './NoticeCard';
import { Flame, Sparkles } from 'lucide-react';

export const TrendingSection: React.FC = () => {
  const { notices } = useNotices();

  // Score algorithm: upvotes * 2 + views * 0.1
  const trendingNotices = [...notices]
    .filter((n) => n.isPublished)
    .sort((a, b) => {
      const scoreA = a.upvoteCount * 2 + a.viewCount * 0.1;
      const scoreB = b.upvoteCount * 2 + b.viewCount * 0.1;
      return scoreB - scoreA;
    })
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-200/80 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2.5 text-amber-700 font-bold text-lg mb-1">
          <Flame className="w-6 h-6 fill-amber-500 text-amber-600" />
          <h2>🔥 Trending This Week</h2>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          Most active campus discussions, high-priority deadlines, and widely upvoted notices across all university departments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {trendingNotices.map((notice, index) => (
          <div key={notice.id} className="relative">
            <div className="absolute -top-2.5 -left-2.5 z-10 w-7 h-7 rounded-full bg-blue-900 text-teal-300 font-extrabold text-xs flex items-center justify-center shadow-md border-2 border-white">
              #{index + 1}
            </div>
            <NoticeCard notice={notice} />
          </div>
        ))}
      </div>
    </div>
  );
};
