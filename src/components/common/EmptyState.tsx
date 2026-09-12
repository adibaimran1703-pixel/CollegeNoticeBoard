'use client';

import React, { ReactNode } from 'react';
import { SearchX, Inbox, BookmarkCheck, Calendar, BellOff } from 'lucide-react';

interface EmptyStateProps {
  type?: 'search' | 'notices' | 'saved' | 'events' | 'notifications' | 'drafts';
  title?: string;
  description?: string;
  action?: ReactNode;
  onReset?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'notices',
  title,
  description,
  action,
  onReset,
}) => {
  const getDefaultContent = () => {
    switch (type) {
      case 'search':
        return {
          icon: <SearchX className="w-12 h-12 text-slate-400" />,
          title: title || 'No notices found',
          desc: description || 'Try changing your search keywords or clearing active filters.',
        };
      case 'saved':
        return {
          icon: <BookmarkCheck className="w-12 h-12 text-slate-400" />,
          title: title || 'No bookmarked notices',
          desc: description || 'Save important notices by clicking the bookmark icon on any notice card.',
        };
      case 'events':
        return {
          icon: <Calendar className="w-12 h-12 text-slate-400" />,
          title: title || 'No campus events scheduled',
          desc: description || 'There are no upcoming events scheduled for this timeframe.',
        };
      case 'notifications':
        return {
          icon: <BellOff className="w-12 h-12 text-slate-400" />,
          title: title || 'No notifications',
          desc: description || 'You are all caught up! Updates about notices and events will appear here.',
        };
      case 'drafts':
        return {
          icon: <Inbox className="w-12 h-12 text-slate-400" />,
          title: title || 'No drafts in progress',
          desc: description || 'You do not have any unpublished draft announcements right now.',
        };
      case 'notices':
      default:
        return {
          icon: <Inbox className="w-12 h-12 text-slate-400" />,
          title: title || 'No announcements posted yet',
          desc: description || 'Be the first to publish a verified notice for your department or campus club.',
        };
    }
  };

  const content = getDefaultContent();

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-xl border border-slate-200 shadow-sm max-w-lg mx-auto my-8">
      <div className="p-4 bg-slate-50 rounded-2xl mb-4 border border-slate-100">
        {content.icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1.5">{content.title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        {content.desc}
      </p>

      {onReset && (
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors focus:ring-2 focus:ring-slate-300"
        >
          Reset Filters
        </button>
      )}

      {action && !onReset && <div>{action}</div>}
    </div>
  );
};
