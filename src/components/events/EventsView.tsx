'use client';

import React, { useState, useEffect } from 'react';
import { EventItem } from '../../types';
import { eventService } from '../../services/eventService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { EventCalendar } from './EventCalendar';
import { EventCard } from './EventCard';
import { EventDetailsModal } from './EventDetailsModal';
import { EventCardSkeleton } from '../common/Skeletons';
import { EmptyState } from '../common/EmptyState';
import { Calendar, Plus } from 'lucide-react';

export const EventsView: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const res = await eventService.getEvents();
      if (res.data) setEvents(res.data);
      setIsLoading(false);
    }
    load();
  }, []);

  const handleToggleRSVP = async (eventId: string) => {
    if (!currentUser) return;
    const res = await eventService.toggleRegisterEvent(eventId, currentUser.id);
    if (!res.error && res.data) {
      setEvents((prev) =>
        prev.map((e) => {
          if (e.id === eventId) {
            const registered = res.data.registered;
            return {
              ...e,
              registeredUserIds: registered
                ? [...e.registeredUserIds, currentUser.id]
                : e.registeredUserIds.filter((id) => id !== currentUser.id),
            };
          }
          return e;
        })
      );
      if (selectedEvent && selectedEvent.id === eventId) {
        setSelectedEvent((prev) =>
          prev
            ? {
                ...prev,
                registeredUserIds: res.data.registered
                  ? [...prev.registeredUserIds, currentUser.id]
                  : prev.registeredUserIds.filter((id) => id !== currentUser.id),
              }
            : null
        );
      }
      showToast(
        res.data.registered ? 'Registered for event!' : 'Registration cancelled',
        'info'
      );
    }
  };

  const filteredEvents = selectedDate
    ? events.filter((e) => e.date === selectedDate)
    : events;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-900" />
            <span>Campus Events & Calendar</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover workshops, hackathons, seminars, and club activities happening across campus.
          </p>
        </div>
      </div>

      {/* Grid: Calendar Sidebar + Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Calendar Widget */}
        <div className="lg:col-span-1">
          <EventCalendar
            events={events}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>

        {/* Events List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              {selectedDate ? `Events for ${selectedDate}` : 'Upcoming Campus Events'} (
              {filteredEvents.length})
            </h3>
            {selectedDate && (
              <button
                onClick={() => setSelectedDate(null)}
                className="text-xs font-semibold text-blue-900 hover:underline"
              >
                View all upcoming
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
            </div>
          ) : filteredEvents.length === 0 ? (
            <EmptyState
              type="events"
              title="No events found for this date"
              description="There are no campus activities scheduled on this day. Select another day on the calendar or view all upcoming events."
              onReset={() => setSelectedDate(null)}
            />
          ) : (
            <div className="space-y-3">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onSelect={setSelectedEvent}
                  onToggleRSVP={handleToggleRSVP}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onToggleRSVP={handleToggleRSVP}
        />
      )}
    </div>
  );
};
