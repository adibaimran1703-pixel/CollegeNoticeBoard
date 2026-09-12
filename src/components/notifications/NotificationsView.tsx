'use client';

import React, { useState, useEffect } from 'react';
import { NotificationItemType } from '../../types';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';
import { useNotices } from '../../context/NoticeContext';
import { NotificationItem } from './NotificationItem';
import { EmptyState } from '../common/EmptyState';
import { Bell, CheckCheck } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { currentUser } = useAuth();
  const { notices, openNoticeDetails } = useNotices();

  const [notifications, setNotifications] = useState<NotificationItemType[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const res = await notificationService.getNotifications(currentUser?.id);
      if (res.data) setNotifications(res.data);
      setIsLoading(false);
    }
    load();
  }, [currentUser]);

  const handleMarkRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead(currentUser?.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleSelectNotification = (item: NotificationItemType) => {
    handleMarkRead(item.id);
    if (item.noticeId) {
      const match = notices.find((n) => n.id === item.noticeId);
      if (match) openNoticeDetails(match);
    }
  };

  const displayedNotifs = filter === 'unread'
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-900" />
            <span>Campus Notification Center</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Stay updated with upvotes on your notices, new placement postings, and event reminders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                filter === 'unread' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Unread ({notifications.filter((n) => !n.isRead).length})
            </button>
          </div>

          <button
            type="button"
            onClick={handleMarkAllRead}
            className="px-3 py-1.5 text-xs font-semibold text-blue-900 hover:text-blue-950 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <CheckCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Mark All as Read</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading notifications...</div>
      ) : displayedNotifs.length === 0 ? (
        <EmptyState
          type="notifications"
          title={filter === 'unread' ? 'No unread notifications' : 'No notifications'}
          description="You are completely up to date with all campus announcements."
        />
      ) : (
        <div className="space-y-3">
          {displayedNotifs.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkRead={handleMarkRead}
              onSelect={handleSelectNotification}
            />
          ))}
        </div>
      )}
    </div>
  );
};
