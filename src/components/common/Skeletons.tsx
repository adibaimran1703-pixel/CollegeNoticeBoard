'use client';

import React from 'react';

export const NoticeCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm animate-pulse flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200" />
            <div>
              <div className="w-24 h-3.5 bg-slate-200 rounded mb-1.5" />
              <div className="w-16 h-2.5 bg-slate-100 rounded" />
            </div>
          </div>
          <div className="w-16 h-6 bg-slate-100 rounded-full" />
        </div>

        <div className="w-3/4 h-5 bg-slate-200 rounded mb-2.5" />
        <div className="w-full h-3.5 bg-slate-100 rounded mb-2" />
        <div className="w-5/6 h-3.5 bg-slate-100 rounded mb-4" />

        <div className="flex flex-wrap gap-2 mb-4">
          <div className="w-14 h-5 bg-slate-100 rounded" />
          <div className="w-16 h-5 bg-slate-100 rounded" />
          <div className="w-12 h-5 bg-slate-100 rounded" />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-16 h-8 bg-slate-100 rounded-lg" />
          <div className="w-10 h-4 bg-slate-100 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-100 rounded-lg" />
          <div className="w-8 h-8 bg-slate-100 rounded-lg" />
          <div className="w-24 h-8 bg-slate-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const NoticeListSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <NoticeCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const EventCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm animate-pulse flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-slate-200 rounded-xl shrink-0" />
        <div>
          <div className="w-48 h-5 bg-slate-200 rounded mb-2" />
          <div className="w-72 h-3.5 bg-slate-100 rounded mb-2" />
          <div className="flex gap-4">
            <div className="w-20 h-3 bg-slate-100 rounded" />
            <div className="w-24 h-3 bg-slate-100 rounded" />
          </div>
        </div>
      </div>
      <div className="w-28 h-9 bg-slate-200 rounded-lg shrink-0" />
    </div>
  );
};

export const StatsCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="w-24 h-3.5 bg-slate-100 rounded" />
        <div className="w-8 h-8 bg-slate-200 rounded-lg" />
      </div>
      <div className="w-16 h-7 bg-slate-200 rounded mb-2" />
      <div className="w-32 h-3 bg-slate-100 rounded" />
    </div>
  );
};
