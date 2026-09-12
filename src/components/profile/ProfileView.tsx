'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotices } from '../../context/NoticeContext';
import { UserAvatar } from '../common/UserAvatar';
import { NoticeCard } from '../notices/NoticeCard';
import { formatDate, isNoticeExpired } from '../../utils/formatters';
import {
  User,
  FileText,
  Bookmark,
  Inbox,
  ThumbsUp,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  Building2,
  GraduationCap,
  Send,
  Plus,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    notices,
    savedNoticeIds,
    openEditModal,
    setNoticeToDelete,
    openNoticeDetails,
    updateNotice,
    setIsCreateModalOpen,
  } = useNotices();

  const [activeSubTab, setActiveSubTab] = useState<'my-notices' | 'saved' | 'drafts'>('my-notices');

  if (!currentUser) return null;

  // Filter notices created by current user
  const myAllNotices = notices.filter((n) => n.creator.id === currentUser.id);
  const myPublishedNotices = myAllNotices.filter((n) => n.isPublished);
  const myDrafts = myAllNotices.filter((n) => !n.isPublished);
  const mySavedNotices = notices.filter((n) => savedNoticeIds.includes(n.id));

  // Compute total upvotes received across user's published notices
  const totalUpvotesReceived = myPublishedNotices.reduce((acc, n) => acc + n.upvoteCount, 0);

  const handlePublishDraft = async (noticeId: string) => {
    await updateNotice(noticeId, { isPublished: true });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <UserAvatar
              name={currentUser.name}
              avatarUrl={currentUser.avatar}
              size="lg"
              role={currentUser.role}
              showRoleBadge
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
                <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-md bg-blue-100 text-blue-900">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{currentUser.email}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {currentUser.department}
                </span>
                {currentUser.year && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    {currentUser.year}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Announcement</span>
          </button>
        </div>

        {/* Aggregate Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
            <span className="text-xl sm:text-2xl font-black text-slate-900 block">
              {myPublishedNotices.length}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Notices Created
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
            <span className="text-xl sm:text-2xl font-black text-teal-700 block">
              {mySavedNotices.length}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Saved Notices
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
            <span className="text-xl sm:text-2xl font-black text-blue-900 block">
              {totalUpvotesReceived}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Upvotes Received
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab('my-notices')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeSubTab === 'my-notices'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Notices ({myAllNotices.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('saved')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeSubTab === 'saved'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Notices ({mySavedNotices.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('drafts')}
          className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeSubTab === 'drafts'
              ? 'border-blue-900 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>My Drafts ({myDrafts.length})</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeSubTab === 'my-notices' && (
        <div className="space-y-3">
          {myAllNotices.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">You haven&apos;t posted any notices yet.</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-blue-900 rounded-lg"
              >
                Create your first notice
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="divide-y divide-slate-100">
                {myAllNotices.map((notice) => {
                  const expired = isNoticeExpired(notice.expiryDate);
                  const status = !notice.isPublished
                    ? 'Draft'
                    : expired
                    ? 'Expired'
                    : 'Published';

                  return (
                    <div
                      key={notice.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                              status === 'Published'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : status === 'Draft'
                                ? 'bg-slate-100 text-slate-700 border border-slate-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {status}
                          </span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-800">
                            {notice.category}
                          </span>
                          <span className="text-xs text-slate-400">
                            Posted {formatDate(notice.createdAt)}
                          </span>
                        </div>

                        <h4
                          onClick={() => openNoticeDetails(notice)}
                          className="text-sm sm:text-base font-bold text-slate-900 hover:text-blue-900 cursor-pointer"
                        >
                          {notice.title}
                        </h4>

                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
                            {notice.upvoteCount} upvotes
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            {notice.viewCount} views
                          </span>
                          <span>Expires: {formatDate(notice.expiryDate)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {!notice.isPublished && (
                          <button
                            type="button"
                            onClick={() => handlePublishDraft(notice.id)}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg flex items-center gap-1 shadow-2xs"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Publish</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => openEditModal(notice)}
                          className="p-2 text-slate-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit notice"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setNoticeToDelete(notice)}
                          className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete notice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'saved' && (
        <div>
          {mySavedNotices.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
              <Bookmark className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No notices bookmarked yet.</p>
              <p className="text-xs text-slate-500 mt-1">
                Save announcements to access them quickly from your profile.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mySavedNotices.map((notice) => (
                <NoticeCard key={notice.id} notice={notice} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'drafts' && (
        <div className="space-y-3">
          {myDrafts.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
              <Inbox className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No draft notices found.</p>
              <p className="text-xs text-slate-500 mt-1">
                When composing a notice, use &ldquo;Save Draft&rdquo; to hold it privately.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-2xs">
              {myDrafts.map((draft) => (
                <div
                  key={draft.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 mb-1.5 inline-block">
                      Draft • {draft.category}
                    </span>
                    <h4
                      onClick={() => openEditModal(draft)}
                      className="text-base font-bold text-slate-900 hover:text-blue-900 cursor-pointer"
                    >
                      {draft.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {draft.shortDescription}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handlePublishDraft(draft.id)}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publish Live</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(draft)}
                      className="p-2 text-slate-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg"
                      title="Edit draft"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setNoticeToDelete(draft)}
                      className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete draft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
