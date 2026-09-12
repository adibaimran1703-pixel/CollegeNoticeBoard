'use client';

import React, { useState } from 'react';
import { EventItem } from '../../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface EventCalendarProps {
  events: EventItem[];
  selectedDate: string | null;
  onSelectDate: (dateString: string | null) => void;
}

export const EventCalendar: React.FC<EventCalendarProps> = ({
  events,
  selectedDate,
  onSelectDate,
}) => {
  // Current calendar month view (default Sept 2026 to match mock dataset)
  const [viewDate, setViewDate] = useState(() => new Date(2026, 8, 1)); // September 2026

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Compute days in month and start day
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  // Map events to date strings (YYYY-MM-DD)
  const eventDateMap = new Set(events.map((e) => e.date));

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: firstDayIndex }, (_, i) => i);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-teal-600" />
          <h3 className="text-sm font-bold text-slate-900">{monthName}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
        <span>Su</span>
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
      </div>

      {/* Grid of Days */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {blanksArray.map((_, i) => (
          <div key={`blank_${i}`} className="h-8" />
        ))}

        {daysArray.map((day) => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const hasEvent = eventDateMap.has(dateStr);
          const isSelected = selectedDate === dateStr;

          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelectDate(isSelected ? null : dateStr)}
              className={`h-8 w-8 mx-auto rounded-lg font-semibold flex flex-col items-center justify-center relative transition-all ${
                isSelected
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : hasEvent
                  ? 'bg-blue-50 text-blue-900 font-bold hover:bg-blue-100'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{day}</span>
              {hasEvent && !isSelected && (
                <span className="w-1 h-1 bg-teal-500 rounded-full absolute bottom-1" />
              )}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-600 font-medium">Filtering by {selectedDate}</span>
          <button
            type="button"
            onClick={() => onSelectDate(null)}
            className="text-blue-900 font-semibold hover:underline"
          >
            Clear Date
          </button>
        </div>
      )}
    </div>
  );
};
