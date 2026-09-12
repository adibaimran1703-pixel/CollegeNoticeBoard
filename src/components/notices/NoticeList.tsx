'use client';

import React from 'react';
import { Notice } from '../../types';
import { NoticeCard } from './NoticeCard';
import { NoticeListSkeleton } from '../common/Skeletons';
import { EmptyState } from '../common/EmptyState';
import { ErrorState } from '../common/ErrorState';

interface NoticeListProps {
  notices: Notice[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onResetFilters?: () => void;
  emptyType?: 'notices' | 'search' | 'saved' | 'drafts';
  emptyTitle?: string;
  emptyDescription?: string;
}

export const NoticeList: React.FC<NoticeListProps> = ({
  notices,
  isLoading,
  error,
  onRetry,
  onResetFilters,
  emptyType = 'notices',
  emptyTitle,
  emptyDescription,
}) => {
  if (isLoading) {
    return <NoticeListSkeleton count={6} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (notices.length === 0) {
    return (
      <EmptyState
        type={emptyType}
        title={emptyTitle}
        description={emptyDescription}
        onReset={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {notices.map((notice) => (
        <NoticeCard key={notice.id} notice={notice} />
      ))}
    </div>
  );
};
