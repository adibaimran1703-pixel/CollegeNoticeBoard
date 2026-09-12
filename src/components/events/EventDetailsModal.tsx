'use client';

import React from 'react';
import { EventItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatters';
import { X, Calendar, Clock, MapPin, Users, Check, Building2 } from 'lucide-react';

interface EventDetailsModalProps {
  event: EventItem | null;
  onClose: () => void;
  onToggleRSVP: (eventId: string) => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  onClose,
  onToggleRSVP,
}) => {
  const { currentUser } = useAuth();

  if (!event) return null;

  const isRegistered = currentUser ? event.registeredUserIds.includes(currentUser.id) : false;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-purple-50 text-purple-800 border border-purple-200">
            {event.category}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {event.imageUrl && (
            <div className="rounded-xl overflow-hidden max-h-56 bg-slate-100 border border-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <h2 className="text-xl font-bold text-slate-900 leading-tight">
            {event.title}
          </h2>

          <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{event.startTime} - {event.endTime}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{event.venue}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>{event.organizer}</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Event Description
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 font-medium">
            <Users className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              <strong>{event.registeredUserIds.length} members</strong> currently registered for this campus event.
            </span>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => onToggleRSVP(event.id)}
            className={`px-5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              isRegistered
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                : 'bg-blue-900 text-white hover:bg-blue-800 shadow-xs'
            }`}
          >
            {isRegistered ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>Registered for Event</span>
              </>
            ) : (
              <span>Register Now</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
