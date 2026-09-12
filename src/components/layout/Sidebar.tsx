'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotices } from '../../context/NoticeContext';
import { NavigationTab } from '../../types';
import {
  Home,
  Calendar,
  Flame,
  Bookmark,
  FileText,
  Bell,
  User,
  ShieldAlert,
  Info,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentUser } = useAuth();
  const { activeTab, setActiveTab, savedNoticeIds } = useNotices();

  const navItems: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }>; badge?: number | string }[] = [
    { id: 'home', label: 'Campus Notices', icon: Home },
    { id: 'events', label: 'Events & Calendar', icon: Calendar },
    { id: 'trending', label: 'Trending This Week', icon: Flame },
    {
      id: 'saved',
      label: 'Saved Notices',
      icon: Bookmark,
      badge: savedNoticeIds.length > 0 ? savedNoticeIds.length : undefined,
    },
    { id: 'my-notices', label: 'My Notices & Drafts', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  // Admin dashboard item if admin
  if (currentUser?.role === 'admin') {
    navItems.push({
      id: 'admin',
      label: 'Admin Dashboard',
      icon: ShieldAlert,
    });
  }

  return (
    <aside className="w-64 shrink-0 hidden md:block">
      <div className="sticky top-20 flex flex-col gap-6">
        <nav className="bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-teal-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-teal-500 text-blue-950'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Campus Information Card */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl p-4 text-white shadow-sm border border-slate-800">
          <div className="flex items-center gap-2 mb-2 text-teal-300">
            <Info className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Campus Tip</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            All department notices are timestamped and synchronized. Bookmark announcements to access them offline.
          </p>
        </div>
      </div>
    </aside>
  );
};
