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
  User,
  ShieldAlert,
  FileText,
  Bell,
  X,
  GraduationCap,
} from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { activeTab, setActiveTab, savedNoticeIds } = useNotices();

  const handleSelectTab = (tab: NavigationTab) => {
    setActiveTab(tab);
    onClose();
  };

  const navItems: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'home', label: 'Campus Notices', icon: Home },
    { id: 'events', label: 'Events & Calendar', icon: Calendar },
    { id: 'trending', label: 'Trending This Week', icon: Flame },
    { id: 'saved', label: 'Saved Notices', icon: Bookmark, badge: savedNoticeIds.length },
    { id: 'my-notices', label: 'My Notices & Drafts', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  if (currentUser?.role === 'admin') {
    navItems.push({
      id: 'admin',
      label: 'Admin Dashboard',
      icon: ShieldAlert,
    });
  }

  return (
    <>
      {/* Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Slide-out Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-200 ease-in-out md:hidden flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 block">Campus Board</span>
              <span className="text-[10px] text-teal-700 font-semibold uppercase">Menu</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-teal-400 text-blue-950' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Navigation Bar (Mobile only) */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 py-1.5 px-2 md:hidden flex justify-around items-center">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold ${
            activeTab === 'home' ? 'text-blue-900' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold ${
            activeTab === 'events' ? 'text-blue-900' : 'text-slate-500'
          }`}
        >
          <Calendar className="w-5 h-5 mb-0.5" />
          <span>Events</span>
        </button>

        <button
          onClick={() => setActiveTab('trending')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold ${
            activeTab === 'trending' ? 'text-blue-900' : 'text-slate-500'
          }`}
        >
          <Flame className="w-5 h-5 mb-0.5" />
          <span>Trending</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold relative ${
            activeTab === 'saved' ? 'text-blue-900' : 'text-slate-500'
          }`}
        >
          <Bookmark className="w-5 h-5 mb-0.5" />
          <span>Saved</span>
          {savedNoticeIds.length > 0 && (
            <span className="absolute top-0.5 right-2 w-2 h-2 bg-blue-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold ${
            activeTab === 'profile' ? 'text-blue-900' : 'text-slate-500'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>Profile</span>
        </button>
      </div>
    </>
  );
};
