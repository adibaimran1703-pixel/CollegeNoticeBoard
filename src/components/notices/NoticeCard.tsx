'use client';

import React, { useState } from 'react';
import { Notice } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useNotices } from '../../context/NoticeContext';
import { useToast } from '../../context/ToastContext';
import { UserAvatar } from '../common/UserAvatar';
import { formatDate, formatRelativeTime, isNoticeExpired, getDaysRemaining } from '../../utils/formatters';
import {
  Pin,
  ThumbsUp,
  Bookmark,
  Share2,
  Eye,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  Building2,
  Users,
  AlertCircle,
} from 'lucide-react';

interface NoticeCardProps {
  notice: Notice;
  compact?: boolean;
}

export const NoticeCard: React.FC<NoticeCardProps> = ({ notice, compact = false }) => {
  const { currentUser } = useAuth();
  const {
    openNoticeDetails,
    openEditModal,
    setNoticeToDelete,
    toggleUpvote,
    toggleSave,
    upvotedNoticeIds,
    savedNoticeIds,
    togglePin,
  } = useNotices();
  const { showToast } = useToast();

  const [copied, setCopied] = useState(false);

  const isUpvoted = upvotedNoticeIds.includes(notice.id);
  const isSaved = savedNoticeIds.includes(notice.id);
  const expired = isNoticeExpired(notice.expiryDate);
  const daysLeft = getDaysRemaining(notice.expiryDate);

  // Ownership check: creator or admin
  const isOwner = currentUser?.id === notice.creator.id;
  const canModerate = isOwner || currentUser?.role === 'admin';

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}?notice=${notice.id}`;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        showToast('Notice link copied to clipboard!', 'success');
        setTimeout(() => setCopied(false), 2000);
      } else {
        showToast('Link copied: ' + shareUrl, 'info');
      }
    } catch {
      showToast('Unable to copy link to clipboard', 'error');
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Academic':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Events':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Internships':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Competitions':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Clubs':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  return (
    <article
      onClick={() => openNoticeDetails(notice)}
      className={`bg-white rounded-2xl border transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
        notice.isPinned
          ? 'border-blue-300 ring-1 ring-blue-200 shadow-2xs'
          : 'border-slate-200 shadow-2xs hover:border-slate-300'
      } ${expired ? 'opacity-85 bg-slate-50/40' : ''}`}
    >
      {/* Top Banner Accent for Pinned notices */}
      {notice.isPinned && (
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white text-[11px] font-bold px-3 py-1 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Pin className="w-3.5 h-3.5 text-teal-300 fill-teal-300" />
            <span>PINNED ANNOUNCEMENT</span>
          </div>
          {currentUser?.role === 'admin' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                togglePin(notice.id);
              }}
              className="text-[10px] text-slate-300 hover:text-white underline"
            >
              Unpin
            </button>
          )}
        </div>
      )}

      <div className="p-5">
        {/* Card Header: Creator Info & Status Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <UserAvatar
              name={notice.creator.name}
              avatarUrl={notice.creator.avatar}
              role={notice.creator.role}
              size="sm"
            />
            <div>
              <span className="text-xs font-bold text-slate-800 block leading-tight">
                {notice.creator.name}
              </span>
              <span className="text-[10px] text-slate-400 block">
                {notice.creator.department || 'Campus'} • {formatRelativeTime(notice.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getCategoryColor(
                notice.category
              )}`}
            >
              {notice.category}
            </span>

            {expired ? (
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Expired
              </span>
            ) : daysLeft <= 3 ? (
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                {daysLeft <= 0 ? 'Expires today' : `${daysLeft}d left`}
              </span>
            ) : null}

            {!notice.isPublished && (
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-200 text-slate-800">
                Draft
              </span>
            )}
          </div>
        </div>

        {/* Notice Title */}
        <h3 className="text-base font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-900 transition-colors">
          {notice.title}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
          {notice.shortDescription}
        </p>

        {/* Notice Image Thumbnail (if present) */}
        {notice.imageUrl && (
          <div className="mb-4 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 h-36 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={notice.imageUrl}
              alt={notice.title}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            />
          </div>
        )}

        {/* Metadata Badges: Department, Year, Audience */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 mb-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-md font-medium text-slate-700">
            <Building2 className="w-3 h-3 text-slate-400" />
            {notice.department}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-md font-medium text-slate-700">
            <Calendar className="w-3 h-3 text-slate-400" />
            {notice.year}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-md font-medium text-slate-700">
            <Users className="w-3 h-3 text-slate-400" />
            {notice.audience}
          </span>
        </div>
      </div>

      {/* Card Footer: Upvote, Save, Share, Views, and Owner Actions */}
      <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
        {/* Left Actions: Upvote & Bookmark */}
        <div className="flex items-center gap-2">
          {/* Upvote Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleUpvote(notice.id);
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              isUpvoted
                ? 'bg-blue-900 text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
            }`}
            title="Upvote this notice"
          >
            <ThumbsUp
              className={`w-3.5 h-3.5 ${isUpvoted ? 'text-teal-300 fill-teal-300' : 'text-slate-400'}`}
            />
            <span>{notice.upvoteCount}</span>
          </button>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSave(notice.id);
            }}
            className={`p-1.5 rounded-lg border transition-all ${
              isSaved
                ? 'bg-teal-50 border-teal-200 text-teal-800'
                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title={isSaved ? 'Remove bookmark' : 'Bookmark notice'}
            aria-label={isSaved ? 'Saved' : 'Save'}
          >
            <Bookmark
              className={`w-3.5 h-3.5 ${isSaved ? 'fill-teal-700 text-teal-700' : ''}`}
            />
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="p-1.5 rounded-lg border bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
            title="Share notice link"
            aria-label="Share"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Actions: View Count, View Details & Owner Moderation */}
        <div className="flex items-center gap-2">
          <div
            className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-slate-400"
            title={`${notice.viewCount} views`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{notice.viewCount}</span>
          </div>

          {/* Owner / Admin Controls */}
          {canModerate && (
            <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(notice);
                }}
                className="p-1.5 text-slate-400 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit notice (Owner/Admin)"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setNoticeToDelete(notice);
                }}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete notice (Owner/Admin)"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => openNoticeDetails(notice)}
            className="px-2.5 py-1 text-xs font-semibold text-blue-900 hover:text-blue-950 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            Details
          </button>
        </div>
      </div>
    </article>
  );
};
