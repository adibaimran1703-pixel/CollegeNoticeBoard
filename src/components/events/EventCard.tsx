'use client';

import React from 'react';
import { EventItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatters';
import { Calendar, Clock, MapPin, Users, Check } from 'lucide-react';

interface EventCardProps {
  event: EventItem;
  onSelect: (event: EventItem) => void;
  onToggleRSVP: (eventId: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onSelect,
  onToggleRSVP,
}) => {
  const { currentUser } = useAuth();
  const isRegistered = currentUser ? event.registeredUserIds.includes(currentUser.id) : false;

  const eventDate = new Date(event.date);
  const monthName = eventDate.toLocaleDateString('en-US', { month: 'short' });
  const dayNumber = eventDate.getDate();

  return (
    <div
      onClick={() => onSelect(event)}
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between group"
    >
      <div className="flex items-start gap-4">
        {/* Date Calendar Badge */}
        <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-blue-50 border border-blue-100 text-blue-900 shrink-0 text-center shadow-2xs group-hover:bg-blue-900 group-hover:text-white transition-colors">
          <span className="text-[11px] font-bold uppercase tracking-wider block">
            {monthName}
          </span>
          <span className="text-xl font-extrabold leading-none block">
            {dayNumber}
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
              {event.category}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              By {event.organizer}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors leading-snug mb-1.5">
            {event.title}
          </h3>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {event.startTime} - {event.endTime}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {event.venue}
            </span>
            <span className="flex items-center gap-1 text-slate-600 font-semibold">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              {event.registeredUserIds.length} attending
            </span>
          </div>
        </div>
      </div>

      <div className="sm:self-center shrink-0 w-full sm:w-auto">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleRSVP(event.id);
          }}
          className={`w-full sm:w-auto px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            isRegistered
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
              : 'bg-blue-900 text-white hover:bg-blue-800 shadow-2xs'
          }`}
        >
          {isRegistered ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              <span>Registered</span>
            </>
          ) : (
            <span>RSVP / Register</span>
          )}
        </button>
      </div>
    </div>
  );
};
