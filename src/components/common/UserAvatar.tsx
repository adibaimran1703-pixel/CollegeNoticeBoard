'use client';

import React, { useState } from 'react';
import { UserRole } from '../../types';

interface UserAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  role?: UserRole;
  showRoleBadge?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  avatarUrl,
  size = 'md',
  role,
  showRoleBadge = false,
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  const getInitials = (n: string) => {
    if (!n) return '?';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-20 h-20 text-2xl',
  }[size];

  const badgeClasses = {
    student: 'bg-blue-600 text-white',
    faculty: 'bg-emerald-600 text-white',
    admin: 'bg-amber-600 text-white',
  };

  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      {avatarUrl && !imgFailed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt={name}
          onError={() => setImgFailed(true)}
          className={`${sizeClasses} rounded-full object-cover border border-slate-200 shadow-sm`}
        />
      ) : (
        <div
          className={`${sizeClasses} rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 text-white font-semibold flex items-center justify-center shadow-sm border border-slate-200`}
        >
          {getInitials(name)}
        </div>
      )}

      {showRoleBadge && role && (
        <span
          className={`absolute -bottom-1 -right-1 text-[10px] uppercase font-bold tracking-wider px-1 py-0.5 rounded shadow-sm border border-white ${
            badgeClasses[role] || 'bg-slate-700 text-white'
          }`}
        >
          {role}
        </span>
      )}
    </div>
  );
};
