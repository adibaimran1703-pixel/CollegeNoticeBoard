'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotices } from '../context/NoticeContext';
import { AuthPage } from '../components/auth/AuthPage';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { MobileNav } from '../components/layout/MobileNav';
import { CategoryFilter } from '../components/notices/CategoryFilter';
import { AdvancedFilters } from '../components/notices/AdvancedFilters';
import { SortDropdown } from '../components/notices/SortDropdown';
import { PinnedNotices } from '../components/notices/PinnedNotices';
import { NoticeList } from '../components/notices/NoticeList';
import { NoticeDetailsModal } from '../components/notices/NoticeDetailsModal';
import { NoticeFormModal } from '../components/notices/NoticeFormModal';
import { DeleteConfirmation } from '../components/common/DeleteConfirmation';
import { EventsView } from '../components/events/EventsView';
import { TrendingSection } from '../components/notices/TrendingSection';
import { NotificationsView } from '../components/notifications/NotificationsView';
import { ProfileView } from '../components/profile/ProfileView';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { Plus, Bell, Bookmark, Flame, Calendar, Sparkles } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const {
    notices,
    isLoading: isNoticesLoading,
    error,
    activeTab,
    filters,
    savedNoticeIds,
    selectedNotice,
    closeNoticeDetails,
    noticeToEdit,
    closeEditModal,
    isCreateModalOpen,
    setIsCreateModalOpen,
    noticeToDelete,
    setNoticeToDelete,
    deleteNotice,
    resetFilters,
    refetchNotices,
  } = useNotices();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Critical Rule: Auth Page Isolation
  // When not authenticated, show ONLY the isolated Auth page
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-900 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Loading Campus Notice Board...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const handleDeleteConfirm = async () => {
    if (!noticeToDelete) return;
    setIsDeleting(true);
    await deleteNotice(noticeToDelete.id);
    setIsDeleting(false);
  };

  // Filter saved notices for the Saved tab
  const savedNotices = notices.filter((n) => savedNoticeIds.includes(n.id));

  // Only display published notices in public home feed
  const publicNotices = notices.filter((n) => n.isPublished);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Authenticated Top Navigation Bar */}
      <Navbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

      {/* Mobile Drawer & Bottom Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Authenticated Layout Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-8">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <main className="flex-1 min-w-0 pb-16 md:pb-8">
          {/* TAB 1: CAMPUS NOTICES FEED */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              {/* Heading & Primary Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Campus Notices
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Stay updated with what&apos;s happening around campus.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-all shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Create Notice</span>
                </button>
              </div>

              {/* Category Pills Bar */}
              <CategoryFilter />

              {/* Collapsible Advanced Filters Drawer */}
              <AdvancedFilters />

              {/* Feed Meta Bar: Active Count & Sorting */}
              <div className="flex items-center justify-between gap-2 pt-1 border-b border-slate-200 pb-3">
                <span className="text-xs font-bold text-slate-700">
                  {publicNotices.length}{' '}
                  {publicNotices.length === 1 ? 'Notice' : 'Notices'} Available
                  {filters.searchQuery && (
                    <span className="font-normal text-slate-500">
                      {' '}
                      for &ldquo;{filters.searchQuery}&rdquo;
                    </span>
                  )}
                </span>

                <SortDropdown />
              </div>

              {/* Pinned Administrative Bulletins */}
              {filters.category === 'All' &&
                !filters.searchQuery &&
                filters.department === 'All Departments' &&
                filters.status === 'active' && (
                  <PinnedNotices notices={publicNotices} />
                )}

              {/* Notice Cards Grid */}
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4">
                  {filters.category === 'All'
                    ? 'All Announcements'
                    : `${filters.category} Announcements`}
                </h2>
                <NoticeList
                  notices={publicNotices}
                  isLoading={isNoticesLoading}
                  error={error}
                  onRetry={refetchNotices}
                  onResetFilters={resetFilters}
                  emptyType={filters.searchQuery ? 'search' : 'notices'}
                  emptyTitle={
                    filters.searchQuery
                      ? 'No notices match your search'
                      : 'No announcements found'
                  }
                  emptyDescription={
                    filters.searchQuery
                      ? 'Try different keywords or reset your department and year filters.'
                      : 'There are no announcements currently published in this category.'
                  }
                />
              </div>
            </div>
          )}

          {/* TAB 2: EVENTS & CALENDAR */}
          {activeTab === 'events' && <EventsView />}

          {/* TAB 3: TRENDING THIS WEEK */}
          {activeTab === 'trending' && <TrendingSection />}

          {/* TAB 4: SAVED NOTICES */}
          {activeTab === 'saved' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Bookmark className="w-7 h-7 text-blue-900" />
                  <span>My Saved Notices</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Bookmarked campus announcements saved locally to your profile for quick offline reference.
                </p>
              </div>

              <NoticeList
                notices={savedNotices}
                isLoading={false}
                error={null}
                onRetry={refetchNotices}
                emptyType="saved"
                emptyTitle="No saved notices yet"
                emptyDescription="You can bookmark any notice on the campus board by clicking the bookmark icon on its card."
              />
            </div>
          )}

          {/* TAB 5: MY NOTICES & DRAFTS */}
          {activeTab === 'my-notices' && <ProfileView />}

          {/* TAB 6: NOTIFICATIONS */}
          {activeTab === 'notifications' && <NotificationsView />}

          {/* TAB 7: MY PROFILE */}
          {activeTab === 'profile' && <ProfileView />}

          {/* TAB 8: ADMIN DASHBOARD */}
          {activeTab === 'admin' && <AdminDashboard />}
        </main>
      </div>

      {/* Global Notice Details Modal */}
      {selectedNotice && (
        <NoticeDetailsModal
          notice={selectedNotice}
          onClose={closeNoticeDetails}
        />
      )}

      {/* Global Create / Edit Notice Modal */}
      <NoticeFormModal
        isOpen={isCreateModalOpen || !!noticeToEdit}
        onClose={() => {
          setIsCreateModalOpen(false);
          closeEditModal();
        }}
        editNotice={noticeToEdit}
      />

      {/* Global Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={!!noticeToDelete}
        title={noticeToDelete?.title || ''}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setNoticeToDelete(null)}
      />
    </div>
  );
}
