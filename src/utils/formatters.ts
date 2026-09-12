import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    }
    const days = Math.floor(diffInSeconds / 86400);
    if (days < 30) return `${days}d ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

export function isNoticeExpired(expiryDateString: string): boolean {
  try {
    const expiry = new Date(expiryDateString);
    // Expiry occurs at end of the given day
    expiry.setHours(23, 59, 59, 999);
    return expiry.getTime() < Date.now();
  } catch {
    return false;
  }
}

export function getDaysRemaining(expiryDateString: string): number {
  try {
    const expiry = new Date(expiryDateString);
    expiry.setHours(23, 59, 59, 999);
    const diffTime = expiry.getTime() - Date.now();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}
