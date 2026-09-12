'use client';

import React, { useState, useEffect } from 'react';
import { NotificationItemType } from '../../types';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';
import { useNotices } from '../../context/NoticeContext';
import { NotificationItem } from './NotificationItem';
import { Bell, CheckCheck, X } from 'lucide-react';

interface NotificationDropdownProps {
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { currentUser } = useAuth();
  const { setActiveTab, notices, openNoticeDetails } = useNotices();

  const [notifications, setNotifications] = useState<NotificationItemType[]>([]);
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
      if (match) {
        openNoticeDetails(match);
      }
    }
    onClose();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[460px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-900" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </h3>
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-[11px] font-semibold text-blue-900 hover:text-blue-950 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="p-3 overflow-y-auto space-y-2 flex-1">
        {isLoading ? (
          <div className="p-6 text-center text-xs text-slate-400">Loading alerts...</div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No notifications at the moment.
          </div>
        ) : (
          notifications.slice(0, 5).map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkRead={handleMarkRead}
              onSelect={handleSelectNotification}
            />
          ))
        )}
      </div>

      {/* Footer link to full view */}
      <div className="p-2.5 border-t border-slate-100 bg-slate-50 text-center">
        <button
          type="button"
          onClick={() => {
            setActiveTab('notifications');
            onClose();
          }}
          className="text-xs font-bold text-blue-900 hover:underline"
        >
          View all notifications & history
        </button>
      </div>
    </div>
  );
};
