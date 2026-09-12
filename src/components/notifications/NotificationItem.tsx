'use client';

import React from 'react';
import { NotificationItemType } from '../../types';
import { formatRelativeTime } from '../../utils/formatters';
import { ThumbsUp, Bell, Calendar, AlertTriangle, Info, Check } from 'lucide-react';

interface NotificationItemProps {
  notification: NotificationItemType;
  onMarkRead: (id: string) => void;
  onSelect?: (notification: NotificationItemType) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkRead,
  onSelect,
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'upvote':
        return <ThumbsUp className="w-4 h-4 text-teal-600" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'expiry':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'notice':
        return <Bell className="w-4 h-4 text-blue-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  const getBg = () => {
    switch (notification.type) {
      case 'upvote':
        return 'bg-teal-50 border-teal-100';
      case 'event':
        return 'bg-purple-50 border-purple-100';
      case 'expiry':
        return 'bg-amber-50 border-amber-100';
      case 'notice':
        return 'bg-blue-50 border-blue-100';
      default:
        return 'bg-slate-50 border-slate-100';
    }
  };

  return (
    <div
      onClick={() => onSelect?.(notification)}
      className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
        notification.isRead
          ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          : 'bg-blue-50/40 border-blue-200 shadow-2xs'
      }`}
    >
      <div className={`p-2 rounded-xl border shrink-0 ${getBg()}`}>
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={`text-xs font-bold leading-tight ${
              notification.isRead ? 'text-slate-800' : 'text-slate-900'
            }`}
          >
            {notification.title}
          </h4>
          <span className="text-[10px] text-slate-400 shrink-0">
            {formatRelativeTime(notification.createdAt)}
          </span>
        </div>

        <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
          {notification.message}
        </p>
      </div>

      {!notification.isRead && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMarkRead(notification.id);
          }}
          className="p-1 text-slate-400 hover:text-blue-900 hover:bg-white rounded-lg transition-colors shrink-0"
          title="Mark as read"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
