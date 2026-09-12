'use client';

import React from 'react';
import { Notice } from '../../types';
import { NoticeCard } from './NoticeCard';
import { Pin } from 'lucide-react';

interface PinnedNoticesProps {
  notices: Notice[];
}

export const PinnedNotices: React.FC<PinnedNoticesProps> = ({ notices }) => {
  const pinnedList = notices.filter((n) => n.isPinned);

  if (pinnedList.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3 text-slate-800">
        <div className="p-1 bg-blue-100 text-blue-900 rounded-md">
          <Pin className="w-4 h-4 fill-blue-900" />
        </div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
          Official Pinned Bulletins ({pinnedList.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pinnedList.map((notice) => (
          <NoticeCard key={notice.id} notice={notice} />
        ))}
      </div>
    </div>
  );
};
