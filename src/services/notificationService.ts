import { supabase } from '../lib/supabase';
import { NotificationItemType } from '../types';

function mapNotification(row: any): NotificationItemType {
  return {
    id: row.id,
    userId: row.user_id || undefined,
    type: row.type,
    title: row.title,
    message: row.message,
    createdAt: row.created_at,
    isRead: row.is_read,
    link: row.link || undefined,
    noticeId: row.notice_id || undefined,
  };
}

export const notificationService = {
  async getNotifications(
    userId?: string
  ): Promise<{
    data: NotificationItemType[];
    error: string | null;
  }> {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.or(`user_id.eq.${userId},user_id.is.null`);
      }

      const { data, error } = await query;

      if (error) {
        return {
          data: [],
          error: error.message,
        };
      }

      return {
        data: (data || []).map(mapNotification),
        error: null,
      };
    } catch {
      return {
        data: [],
        error: 'Failed to fetch notifications',
      };
    }
  },

  async markAsRead(
    id: string
  ): Promise<{ data: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) {
        return {
          data: false,
          error: error.message,
        };
      }

      return {
        data: true,
        error: null,
      };
    } catch {
      return {
        data: false,
        error: 'Failed to mark notification as read',
      };
    }
  },

  async markAllAsRead(
    userId?: string
  ): Promise<{ data: boolean; error: string | null }> {
    try {
      let query = supabase
        .from('notifications')
        .update({ is_read: true });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { error } = await query;

      if (error) {
        return {
          data: false,
          error: error.message,
        };
      }

      return {
        data: true,
        error: null,
      };
    } catch {
      return {
        data: false,
        error: 'Failed to mark all notifications as read',
      };
    }
  },

  async addNotification(
    payload: Omit<
      NotificationItemType,
      'id' | 'createdAt' | 'isRead'
    >
  ): Promise<{
    data: NotificationItemType | null;
    error: string | null;
  }> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: payload.userId || null,
          type: payload.type,
          title: payload.title,
          message: payload.message,
          link: payload.link || null,
          notice_id: payload.noticeId || null,
          is_read: false,
        })
        .select()
        .single();

      if (error) {
        return {
          data: null,
          error: error.message,
        };
      }

      return {
        data: mapNotification(data),
        error: null,
      };
    } catch {
      return {
        data: null,
        error: 'Failed to record notification',
      };
    }
  },
};