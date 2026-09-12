'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotices } from '../../context/NoticeContext';
import { UserAvatar } from '../common/UserAvatar';
import {
  GraduationCap,
  Search,
  Plus,
  Bell,
  LogOut,
  User,
  Shield,
  ChevronDown,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { NotificationDropdown } from '../notifications/NotificationDropdown';

interface NavbarProps {
  onOpenMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const { currentUser, logout, switchRole } = useAuth();
  const { filters, updateFilter, setIsCreateModalOpen, setActiveTab } = useNotices();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Mobile Menu & Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="md:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-900 text-white flex items-center justify-center shadow-xs group-hover:bg-blue-800 transition-colors">
                <GraduationCap className="w-5 h-5 text-teal-400" />
              </div>
              <div className="hidden sm:block">
                <span className="text-base font-bold text-slate-900 tracking-tight block leading-tight">
                  Campus Board
                </span>
                <span className="text-[11px] font-medium text-teal-700 uppercase tracking-wider block">
                  Official Notices
                </span>
              </div>
            </button>
          </div>

          {/* Center: Global Search Bar */}
          <div className="flex-1 max-w-md mx-2 sm:mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => {
                  updateFilter('searchQuery', e.target.value);
                  // Auto redirect to home/feed if searching from another tab
                  setActiveTab('home');
                }}
                placeholder="Search notices, departments, hackathons..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 transition-colors"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => updateFilter('searchQuery', '')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right: Actions & User Info */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Create Notice CTA */}
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 active:bg-blue-950 rounded-xl shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Notice</span>
              <span className="sm:hidden">Post</span>
            </button>

            {/* Notification Dropdown Trigger */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-900"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {/* Visual unread dot */}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <NotificationDropdown onClose={() => setIsNotifOpen(false)} />
                </div>
              )}
            </div>

            {/* User Profile Avatar & Menu */}
            {currentUser && (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-900"
                  aria-expanded={isUserMenuOpen}
                >
                  <UserAvatar
                    name={currentUser.name}
                    avatarUrl={currentUser.avatar}
                    size="sm"
                  />
                  <div className="hidden lg:block text-left">
                    <span className="text-xs font-bold text-slate-800 block truncate max-w-[110px] leading-tight">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                      {currentUser.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3.5 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-100 uppercase">
                          {currentUser.role}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {currentUser.department}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setActiveTab('profile');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        My Profile & Notices
                      </button>

                      {/* Mock role switcher for testing convenience */}
                      <div className="px-3.5 py-1.5 my-1 bg-slate-50/80 border-y border-slate-100">
                        <span className="text-[10px] font-semibold uppercase text-slate-400 block mb-1">
                          Test Role Switcher
                        </span>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              switchRole('student');
                              setIsUserMenuOpen(false);
                            }}
                            className={`px-2 py-1 text-[11px] font-medium rounded ${
                              currentUser.role === 'student'
                                ? 'bg-blue-900 text-white'
                                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            Student
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              switchRole('admin');
                              setIsUserMenuOpen(false);
                            }}
                            className={`px-2 py-1 text-[11px] font-medium rounded ${
                              currentUser.role === 'admin'
                                ? 'bg-blue-900 text-white'
                                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            Admin
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
