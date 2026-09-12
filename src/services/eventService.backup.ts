import { INITIAL_EVENTS } from '../data/events';
import { EventItem } from '../types';

const EVENTS_STORAGE_KEY = 'college_notice_board_events_v1';

function loadEvents(): EventItem[] {
  if (typeof window === 'undefined') return INITIAL_EVENTS;
  try {
    const saved = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.warn('Failed to load events from storage:', err);
  }
  return INITIAL_EVENTS;
}

function persistEvents(events: EventItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  } catch (err) {
    console.warn('Failed to persist events to storage:', err);
  }
}

export const eventService = {
  async getEvents(): Promise<{ data: EventItem[]; error: string | null }> {
    await new Promise((res) => setTimeout(res, 100));
    try {
      const list = loadEvents();
      // Sort upcoming events chronologically
      const sorted = [...list].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      return { data: sorted, error: null };
    } catch {
      return { data: [], error: 'Failed to fetch campus events' };
    }
  },

  async getEventById(id: string): Promise<{ data: EventItem | null; error: string | null }> {
    await new Promise((res) => setTimeout(res, 80));
    try {
      const list = loadEvents();
      const item = list.find((e) => e.id === id) || null;
      return { data: item, error: item ? null : 'Event not found' };
    } catch {
      return { data: null, error: 'Error fetching event' };
    }
  },

  async createEvent(
    payload: Omit<EventItem, 'id' | 'createdAt' | 'registeredUserIds'>
  ): Promise<{ data: EventItem | null; error: string | null }> {
    await new Promise((res) => setTimeout(res, 180));
    try {
      const list = loadEvents();
      const newEvent: EventItem = {
        ...payload,
        id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
        registeredUserIds: [],
      };
      const updated = [newEvent, ...list];
      persistEvents(updated);
      return { data: newEvent, error: null };
    } catch {
      return { data: null, error: 'Failed to create campus event' };
    }
  },

  async toggleRegisterEvent(
    eventId: string,
    userId: string
  ): Promise<{ data: { registered: boolean; count: number }; error: string | null }> {
    await new Promise((res) => setTimeout(res, 100));
    try {
      const list = loadEvents();
      const event = list.find((e) => e.id === eventId);
      if (!event) return { data: { registered: false, count: 0 }, error: 'Event not found' };

      const isRegistered = event.registeredUserIds.includes(userId);
      if (isRegistered) {
        event.registeredUserIds = event.registeredUserIds.filter((id) => id !== userId);
      } else {
        event.registeredUserIds.push(userId);
      }

      persistEvents(list);
      return {
        data: {
          registered: !isRegistered,
          count: event.registeredUserIds.length,
        },
        error: null,
      };
    } catch {
      return { data: { registered: false, count: 0 }, error: 'Failed to toggle event registration' };
    }
  },
};
