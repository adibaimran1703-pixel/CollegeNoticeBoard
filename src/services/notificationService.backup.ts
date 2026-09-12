import { INITIAL_NOTIFICATIONS } from '../data/notifications';
import { NotificationItemType } from '../types';

const NOTIF_STORAGE_KEY = 'college_notice_board_notifications_v1';

function loadNotifications(): NotificationItemType[] {
  if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
  try {
    const saved = localStorage.getItem(NOTIF_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.warn('Failed to load notifications from storage:', err);
  }
  return INITIAL_NOTIFICATIONS;
}

function persistNotifications(notifications: NotificationItemType[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(notifications));
  } catch (err) {
    console.warn('Failed to persist notifications:', err);
  }
}

export const notificationService = {
  async getNotifications(userId?: string): Promise<{ data: NotificationItemType[]; error: string | null }> {
    await new Promise((res) => setTimeout(res, 80));
    try {
      const list = loadNotifications();
      // Filter for this user or generic
      const userNotifs = userId ? list.filter((n) => !n.userId || n.userId === userId) : list;
      return { data: userNotifs, error: null };
    } catch {
      return { data: [], error: 'Failed to fetch notifications' };
    }
  },

  async markAsRead(id: string): Promise<{ data: boolean; error: string | null }> {
    try {
      const list = loadNotifications();
      const item = list.find((n) => n.id === id);
      if (item) {
        item.isRead = true;
        persistNotifications(list);
        return { data: true, error: null };
      }
      return { data: false, error: 'Notification not found' };
    } catch {
      return { data: false, error: 'Failed to mark notification as read' };
    }
  },

  async markAllAsRead(userId?: string): Promise<{ data: boolean; error: string | null }> {
    try {
      const list = loadNotifications();
      list.forEach((n) => {
        if (!userId || n.userId === userId) {
          n.isRead = true;
        }
      });
      persistNotifications(list);
      return { data: true, error: null };
    } catch {
      return { data: false, error: 'Failed to mark all notifications as read' };
    }
  },

  async addNotification(
    payload: Omit<NotificationItemType, 'id' | 'createdAt' | 'isRead'>
  ): Promise<{ data: NotificationItemType | null; error: string | null }> {
    try {
      const list = loadNotifications();
      const newNotif: NotificationItemType = {
        ...payload,
        id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        createdAt: new Date().toISOString(),
        isRead: false,
      };
      const updated = [newNotif, ...list];
      persistNotifications(updated);
      return { data: newNotif, error: null };
    } catch {
      return { data: null, error: 'Failed to record notification' };
    }
  },
};
