'use client';

import React, { useState } from 'react';
import { Notice } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useNotices } from '../../context/NoticeContext';
import { useToast } from '../../context/ToastContext';
import { UserAvatar } from '../common/UserAvatar';
import { formatDate, formatRelativeTime, isNoticeExpired, getDaysRemaining } from '../../utils/formatters';
import {
  X,
  ThumbsUp,
  Bookmark,
  Share2,
  Eye,
  Calendar,
  Building2,
  Users,
  Pin,
  Edit2,
  Trash2,
  AlertCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface NoticeDetailsModalProps {
  notice: Notice | null;
  onClose: () => void;
}

export const NoticeDetailsModal: React.FC<NoticeDetailsModalProps> = ({ notice, onClose }) => {
  const { currentUser } = useAuth();
  const {
    openEditModal,
    setNoticeToDelete,
    toggleUpvote,
    toggleSave,
    upvotedNoticeIds,
    savedNoticeIds,
    togglePin,
  } = useNotices();
  const { showToast } = useToast();

  if (!notice) return null;

  const isUpvoted = upvotedNoticeIds.includes(notice.id);
  const isSaved = savedNoticeIds.includes(notice.id);
  const expired = isNoticeExpired(notice.expiryDate);
  const daysLeft = getDaysRemaining(notice.expiryDate);

  const isOwner = currentUser?.id === notice.creator.id;
  const canModerate = isOwner || currentUser?.role === 'admin';

  const handleShare = async () => {
    try {
      const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}?notice=${notice.id}`;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        showToast('Notice link copied to clipboard!', 'success');
      } else {
        showToast('Link copied: ' + shareUrl, 'info');
      }
    } catch {
      showToast('Unable to copy link to clipboard', 'error');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notice-modal-title"
    >
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-100 text-blue-900 border border-blue-200">
              {notice.category}
            </span>

            {notice.isPinned && (
              <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1">
                <Pin className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                Pinned
              </span>
            )}

            {expired ? (
              <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-md bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Expired
              </span>
            ) : (
              <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                Active • {daysLeft} days left
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Title */}
          <h2 id="notice-modal-title" className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
            {notice.title}
          </h2>

          {/* Author info & timestamps */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3">
              <UserAvatar
                name={notice.creator.name}
                avatarUrl={notice.creator.avatar}
                role={notice.creator.role}
                size="md"
              />
              <div>
                <span className="text-sm font-bold text-slate-900 block">
                  {notice.creator.name}
                </span>
                <span className="text-xs text-slate-500">
                  {notice.creator.department || 'Campus Department'} • {notice.creator.role}
                </span>
              </div>
            </div>

            <div className="flex flex-col text-right text-xs text-slate-500">
              <span>Published: {formatDate(notice.createdAt)}</span>
              <span>Expires: {formatDate(notice.expiryDate)}</span>
            </div>
          </div>

          {/* Banner Image (if exists) */}
          {notice.imageUrl && (
            <div className="rounded-xl overflow-hidden border border-slate-200 max-h-72 bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={notice.imageUrl}
                alt={notice.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Target Audience / Dept / Year attributes */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Department</span>
              <span className="font-bold text-slate-800">{notice.department}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Year</span>
              <span className="font-bold text-slate-800">{notice.year}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Target Audience</span>
              <span className="font-bold text-slate-800">{notice.audience}</span>
            </div>
          </div>

          {/* Main Content Body */}
          <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700 whitespace-pre-line">
            {notice.content || notice.shortDescription}
          </div>

          {/* Tags */}
          {notice.tags && notice.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {notice.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          {/* Left Actions: Upvote, Save, Share */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => toggleUpvote(notice.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isUpvoted
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${isUpvoted ? 'text-teal-300 fill-teal-300' : 'text-slate-400'}`} />
              <span>{notice.upvoteCount} Upvotes</span>
            </button>

            <button
              type="button"
              onClick={() => toggleSave(notice.id)}
              className={`p-2 rounded-xl border transition-all ${
                isSaved
                  ? 'bg-teal-50 border-teal-300 text-teal-800'
                  : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100'
              }`}
              title={isSaved ? 'Remove bookmark' : 'Bookmark notice'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-teal-700 text-teal-700' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl border bg-white border-slate-300 text-slate-600 hover:bg-slate-100 transition-all"
              title="Copy share link"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium ml-2">
              <Eye className="w-4 h-4" />
              <span>{notice.viewCount} views</span>
            </div>
          </div>

          {/* Right Actions: Moderation / Close */}
          <div className="flex items-center gap-2">
            {canModerate && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openEditModal(notice);
                  }}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setNoticeToDelete(notice);
                  }}
                  className="px-3 py-2 text-xs font-semibold text-red-600 bg-white hover:bg-red-50 border border-red-200 rounded-xl flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
