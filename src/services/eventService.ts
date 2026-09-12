import { supabase } from '../lib/supabase';
import { EventItem } from '../types';

function mapEvent(row: any): EventItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    venue: row.venue,
    organizer: row.organizer,
    category: row.category,
    imageUrl: row.image_url,
    createdAt: row.created_at,
    registeredUserIds: row.registered_user_ids || [],
  };
}

export const eventService = {
  async getEvents(): Promise<{ data: EventItem[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) {
        return { data: [], error: error.message };
      }

      return {
        data: (data || []).map(mapEvent),
        error: null,
      };
    } catch {
      return {
        data: [],
        error: 'Failed to fetch campus events',
      };
    }
  },

  async getEventById(
    id: string
  ): Promise<{ data: EventItem | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return {
        data: mapEvent(data),
        error: null,
      };
    } catch {
      return {
        data: null,
        error: 'Error fetching event',
      };
    }
  },

  async createEvent(
    payload: Omit<EventItem, 'id' | 'createdAt' | 'registeredUserIds'>
  ): Promise<{ data: EventItem | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: payload.title,
          description: payload.description,
          date: payload.date,
          start_time: payload.startTime,
          end_time: payload.endTime,
          venue: payload.venue,
          organizer: payload.organizer,
          category: payload.category,
          image_url: payload.imageUrl || null,
          registered_user_ids: [],
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
        data: mapEvent(data),
        error: null,
      };
    } catch {
      return {
        data: null,
        error: 'Failed to create campus event',
      };
    }
  },

  async toggleRegisterEvent(
    eventId: string,
    userId: string
  ): Promise<{
    data: { registered: boolean; count: number };
    error: string | null;
  }> {
    try {
      const { data: event, error: fetchError } = await supabase
        .from('events')
        .select('registered_user_ids')
        .eq('id', eventId)
        .single();

      if (fetchError || !event) {
        return {
          data: { registered: false, count: 0 },
          error: fetchError?.message || 'Event not found',
        };
      }

      const registeredUsers: string[] =
        event.registered_user_ids || [];

      const isRegistered = registeredUsers.includes(userId);

      const updatedUsers = isRegistered
        ? registeredUsers.filter((id) => id !== userId)
        : [...registeredUsers, userId];

      const { error: updateError } = await supabase
        .from('events')
        .update({
          registered_user_ids: updatedUsers,
        })
        .eq('id', eventId);

      if (updateError) {
        return {
          data: {
            registered: isRegistered,
            count: registeredUsers.length,
          },
          error: updateError.message,
        };
      }

      return {
        data: {
          registered: !isRegistered,
          count: updatedUsers.length,
        },
        error: null,
      };
    } catch {
      return {
        data: { registered: false, count: 0 },
        error: 'Failed to toggle event registration',
      };
    }
  },
};