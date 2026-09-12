'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Notice,
  NoticeCategory,
  Department,
  TargetYear,
  TargetAudience,
  NoticeFilters,
  SortOption,
  NavigationTab,
} from '../types';
import { noticeService } from '../services/noticeService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface NoticeContextType {
  notices: Notice[];
  isLoading: boolean;
  error: string | null;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  filters: NoticeFilters;
  setFilters: React.Dispatch<React.SetStateAction<NoticeFilters>>;
  updateFilter: <K extends keyof NoticeFilters>(key: K, value: NoticeFilters[K]) => void;
  resetFilters: () => void;
  savedNoticeIds: string[];
  upvotedNoticeIds: string[];
  // Notice detail & modals
  selectedNotice: Notice | null;
  openNoticeDetails: (notice: Notice) => void;
  closeNoticeDetails: () => void;
  noticeToEdit: Notice | null;
  openEditModal: (notice: Notice) => void;
  closeEditModal: () => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  noticeToDelete: Notice | null;
  setNoticeToDelete: (notice: Notice | null) => void;
  // Operations
  createNotice: (
    payload: Omit<Notice, 'id' | 'createdAt' | 'updatedAt' | 'upvoteCount' | 'viewCount'>
  ) => Promise<boolean>;
  updateNotice: (id: string, updates: Partial<Notice>) => Promise<boolean>;
  deleteNotice: (id: string) => Promise<boolean>;
  toggleUpvote: (id: string) => Promise<void>;
  toggleSave: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  refetchNotices: () => Promise<void>;
}

const DEFAULT_FILTERS: NoticeFilters = {
  searchQuery: '',
  category: 'All',
  department: 'All Departments',
  year: 'All Years',
  audience: 'Everyone',
  status: 'active',
  pinnedOnly: false,
  sortBy: 'latest',
};

const NoticeContext = createContext<NoticeContextType | undefined>(undefined);

export const NoticeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [filters, setFilters] = useState<NoticeFilters>(DEFAULT_FILTERS);

  // User interactions
  const [savedNoticeIds, setSavedNoticeIds] = useState<string[]>([]);
  const [upvotedNoticeIds, setUpvotedNoticeIds] = useState<string[]>([]);

  // Modals state
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [noticeToEdit, setNoticeToEdit] = useState<Notice | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [noticeToDelete, setNoticeToDelete] = useState<Notice | null>(null);

  // Sync user saved & upvoted ids
  useEffect(() => {
    if (currentUser) {
      noticeService.getUserSavedIds(currentUser.id).then(setSavedNoticeIds);
      noticeService.getUserUpvotedIds(currentUser.id).then(setUpvotedNoticeIds);
    }
  }, [currentUser]);

  const fetchNotices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await noticeService.getNotices(filters);
      if (res.error) {
        setError(res.error);
      } else {
        setNotices(res.data);
      }
    } catch {
      setError('Unable to connect to campus notice service.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const updateFilter = <K extends keyof NoticeFilters>(key: K, value: NoticeFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const openNoticeDetails = async (notice: Notice) => {
    setSelectedNotice(notice);
    // Increment view count explicitly when user views details
    const res = await noticeService.incrementViewCount(notice.id);
    if (!res.error && res.data) {
      setSelectedNotice((prev) => (prev && prev.id === notice.id ? { ...prev, viewCount: res.data } : prev));
      setNotices((prev) =>
        prev.map((n) => (n.id === notice.id ? { ...n, viewCount: res.data } : n))
      );
    }
  };

  const closeNoticeDetails = () => {
    setSelectedNotice(null);
  };

  const openEditModal = (notice: Notice) => {
    setNoticeToEdit(notice);
  };

  const closeEditModal = () => {
    setNoticeToEdit(null);
  };

  const handleCreateNotice = async (
    payload: Omit<Notice, 'id' | 'createdAt' | 'updatedAt' | 'upvoteCount' | 'viewCount'>
  ): Promise<boolean> => {
    try {
      const res = await noticeService.createNotice(payload);
      if (res.data) {
        setNotices((prev) => [res.data!, ...prev]);
        showToast(
          payload.isPublished ? 'Notice published successfully!' : 'Draft notice saved!',
          'success'
        );
        setIsCreateModalOpen(false);
        return true;
      }
      showToast(res.error || 'Failed to create notice', 'error');
      return false;
    } catch {
      showToast('An unexpected error occurred', 'error');
      return false;
    }
  };

  const handleUpdateNotice = async (id: string, updates: Partial<Notice>): Promise<boolean> => {
    try {
      const res = await noticeService.updateNotice(id, updates);
      if (res.data) {
        setNotices((prev) => prev.map((n) => (n.id === id ? res.data! : n)));
        if (selectedNotice && selectedNotice.id === id) {
          setSelectedNotice(res.data);
        }
        showToast('Notice updated successfully!', 'success');
        closeEditModal();
        return true;
      }
      showToast(res.error || 'Failed to update notice', 'error');
      return false;
    } catch {
      showToast('An unexpected error occurred', 'error');
      return false;
    }
  };

  const handleDeleteNotice = async (id: string): Promise<boolean> => {
    try {
      const res = await noticeService.deleteNotice(id);
      if (res.data) {
        setNotices((prev) => prev.filter((n) => n.id !== id));
        if (selectedNotice && selectedNotice.id === id) {
          setSelectedNotice(null);
        }
        showToast('Notice removed from board', 'success');
        setNoticeToDelete(null);
        return true;
      }
      showToast(res.error || 'Failed to delete notice', 'error');
      return false;
    } catch {
      showToast('An unexpected error occurred', 'error');
      return false;
    }
  };

  const handleToggleUpvote = async (noticeId: string) => {
    if (!currentUser) return;
    try {
      const res = await noticeService.toggleUpvote(noticeId, currentUser.id);
      if (!res.error) {
        const { upvoted, count } = res.data;
        setUpvotedNoticeIds((prev) =>
          upvoted ? [...prev, noticeId] : prev.filter((id) => id !== noticeId)
        );
        setNotices((prev) =>
          prev.map((n) => (n.id === noticeId ? { ...n, upvoteCount: count } : n))
        );
        if (selectedNotice && selectedNotice.id === noticeId) {
          setSelectedNotice((prev) => (prev ? { ...prev, upvoteCount: count } : null));
        }
        showToast(upvoted ? 'Notice upvoted!' : 'Upvote removed', 'info', 1800);
      }
    } catch {
      showToast('Failed to update vote', 'error');
    }
  };

  const handleToggleSave = async (noticeId: string) => {
    if (!currentUser) return;
    try {
      const res = await noticeService.toggleSaveNotice(noticeId, currentUser.id);
      if (!res.error) {
        const { saved } = res.data;
        setSavedNoticeIds((prev) =>
          saved ? [...prev, noticeId] : prev.filter((id) => id !== noticeId)
        );
        showToast(saved ? 'Saved to bookmarks' : 'Removed from bookmarks', 'info', 1800);
      }
    } catch {
      showToast('Failed to bookmark notice', 'error');
    }
  };

  const handleTogglePin = async (noticeId: string) => {
    try {
      const res = await noticeService.togglePinNotice(noticeId);
      if (!res.error) {
        setNotices((prev) =>
          prev.map((n) => (n.id === noticeId ? { ...n, isPinned: res.data } : n))
        );
        if (selectedNotice && selectedNotice.id === noticeId) {
          setSelectedNotice((prev) => (prev ? { ...prev, isPinned: res.data } : null));
        }
        showToast(res.data ? 'Notice pinned to top' : 'Notice unpinned', 'success');
      }
    } catch {
      showToast('Failed to pin notice', 'error');
    }
  };

  return (
    <NoticeContext.Provider
      value={{
        notices,
        isLoading,
        error,
        activeTab,
        setActiveTab,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        savedNoticeIds,
        upvotedNoticeIds,
        selectedNotice,
        openNoticeDetails,
        closeNoticeDetails,
        noticeToEdit,
        openEditModal,
        closeEditModal,
        isCreateModalOpen,
        setIsCreateModalOpen,
        noticeToDelete,
        setNoticeToDelete,
        createNotice: handleCreateNotice,
        updateNotice: handleUpdateNotice,
        deleteNotice: handleDeleteNotice,
        toggleUpvote: handleToggleUpvote,
        toggleSave: handleToggleSave,
        togglePin: handleTogglePin,
        refetchNotices: fetchNotices,
      }}
    >
      {children}
    </NoticeContext.Provider>
  );
};

export function useNotices() {
  const context = useContext(NoticeContext);
  if (!context) {
    throw new Error('useNotices must be used within a NoticeProvider');
  }
  return context;
}
