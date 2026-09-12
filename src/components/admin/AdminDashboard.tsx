'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotices } from '../../context/NoticeContext';
import { formatDate, isNoticeExpired } from '../../utils/formatters';
import {
  ShieldCheck,
  Users,
  FileText,
  Calendar,
  ThumbsUp,
  Eye,
  Pin,
  Trash2,
  Edit2,
  TrendingUp,
  BarChart3,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    notices,
    togglePin,
    setNoticeToDelete,
    openEditModal,
    openNoticeDetails,
  } = useNotices();

  const [adminNoticeFilter, setAdminNoticeFilter] = useState<'all' | 'pinned' | 'expired'>('all');

  // Guard: Admin-only
  if (currentUser?.role !== 'admin') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-lg mx-auto my-8">
        <ShieldCheck className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-red-900 mb-1">Administrator Access Only</h3>
        <p className="text-xs text-red-700 leading-relaxed">
          You do not have administrative credentials to view this moderation dashboard. Please switch to an Administrator account.
        </p>
      </div>
    );
  }

  // Calculate statistics
  const totalNotices = notices.length;
  const activeNotices = notices.filter((n) => !isNoticeExpired(n.expiryDate)).length;
  const expiredNotices = notices.filter((n) => isNoticeExpired(n.expiryDate)).length;
  const totalUpvotes = notices.reduce((acc, n) => acc + n.upvoteCount, 0);
  const totalViews = notices.reduce((acc, n) => acc + n.viewCount, 0);
  const totalPinned = notices.filter((n) => n.isPinned).length;

  // Category counts
  const categoryCounts: Record<string, number> = {};
  notices.forEach((n) => {
    categoryCounts[n.category] = (categoryCounts[n.category] || 0) + 1;
  });

  // Top 4 Most Viewed notices
  const topViewed = [...notices].sort((a, b) => b.viewCount - a.viewCount).slice(0, 4);

  // Filter notices for moderation table
  const moderatedNotices = notices.filter((n) => {
    if (adminNoticeFilter === 'pinned') return n.isPinned;
    if (adminNoticeFilter === 'expired') return isNoticeExpired(n.expiryDate);
    return true;
  });

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Dashboard Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Campus Administration & Moderation
            </h2>
            <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              Admin Mode
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time campus communications overview, notice board statistics, and announcement governance.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Notices</span>
            <FileText className="w-4 h-4 text-blue-900" />
          </div>
          <span className="text-2xl font-black text-slate-900 block">{totalNotices}</span>
          <span className="text-[10px] text-slate-500">Across 7 categories</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Notices</span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <span className="text-2xl font-black text-emerald-700 block">{activeNotices}</span>
          <span className="text-[10px] text-slate-500">{expiredNotices} expired</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pinned Bulletins</span>
            <Pin className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-black text-amber-700 block">{totalPinned}</span>
          <span className="text-[10px] text-slate-500">Highlighted on top</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Upvotes</span>
            <ThumbsUp className="w-4 h-4 text-teal-600" />
          </div>
          <span className="text-2xl font-black text-teal-700 block">{totalUpvotes}</span>
          <span className="text-[10px] text-slate-500">Student endorsements</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Views</span>
            <Eye className="w-4 h-4 text-blue-700" />
          </div>
          <span className="text-2xl font-black text-blue-900 block">{totalViews}</span>
          <span className="text-[10px] text-slate-500">Detailed impressions</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Campus Users</span>
            <Users className="w-4 h-4 text-purple-700" />
          </div>
          <span className="text-2xl font-black text-purple-900 block">4,280+</span>
          <span className="text-[10px] text-slate-500">Students & Faculty</span>
        </div>
      </div>

      {/* Analytics Breakdown Row: Categories Distribution & Most Viewed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-blue-900" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Notices by Category
            </h3>
          </div>

          <div className="space-y-3">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const percentage = Math.round((count / totalNotices) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{cat}</span>
                    <span>
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-900 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Viewed Notices */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Most Viewed Announcements
            </h3>
          </div>

          <div className="divide-y divide-slate-100">
            {topViewed.map((n) => (
              <div
                key={n.id}
                onClick={() => openNoticeDetails(n)}
                className="py-2.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 rounded-lg px-2 transition-colors"
              >
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{n.title}</h4>
                  <span className="text-[10px] text-slate-400">
                    {n.department} • {n.category}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold shrink-0">
                  <span className="text-blue-900 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {n.viewCount}
                  </span>
                  <span className="text-teal-700 flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    {n.upvoteCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Moderation Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Notice Board Governance & Moderation
            </h3>
            <p className="text-xs text-slate-500">
              Pin announcements to the top of the campus feed, review expired notices, or take moderation actions.
            </p>
          </div>

          <div className="flex rounded-xl bg-white p-1 border border-slate-200 shrink-0">
            <button
              onClick={() => setAdminNoticeFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                adminNoticeFilter === 'all' ? 'bg-blue-900 text-white' : 'text-slate-600'
              }`}
            >
              All ({notices.length})
            </button>
            <button
              onClick={() => setAdminNoticeFilter('pinned')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                adminNoticeFilter === 'pinned' ? 'bg-blue-900 text-white' : 'text-slate-600'
              }`}
            >
              Pinned ({totalPinned})
            </button>
            <button
              onClick={() => setAdminNoticeFilter('expired')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                adminNoticeFilter === 'expired' ? 'bg-blue-900 text-white' : 'text-slate-600'
              }`}
            >
              Expired ({expiredNotices})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
              <tr>
                <th className="px-6 py-3">Notice Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Expiry</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {moderatedNotices.map((n) => {
                const expired = isNoticeExpired(n.expiryDate);
                return (
                  <tr key={n.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-3.5 max-w-xs">
                      <span
                        onClick={() => openNoticeDetails(n)}
                        className="font-bold text-slate-900 hover:text-blue-900 cursor-pointer block truncate"
                      >
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {n.viewCount} views • {n.upvoteCount} upvotes
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">
                        {n.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-medium text-slate-700">
                      {n.department}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">
                      {n.creator.name}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-500">
                      {formatDate(n.expiryDate)}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-center">
                      {expired ? (
                        <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-700 font-bold text-[10px]">
                          Expired
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold text-[10px]">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => togglePin(n.id)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors inline-flex items-center gap-1 ${
                          n.isPinned
                            ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                        title={n.isPinned ? 'Unpin notice' : 'Pin notice to top'}
                      >
                        <Pin className={`w-3 h-3 ${n.isPinned ? 'fill-amber-600 text-amber-600' : ''}`} />
                        <span>{n.isPinned ? 'Pinned' : 'Pin'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openEditModal(n)}
                        className="p-1.5 text-slate-500 hover:text-blue-900 hover:bg-slate-100 rounded-lg inline-block"
                        title="Edit notice"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setNoticeToDelete(n)}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg inline-block"
                        title="Delete notice"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
