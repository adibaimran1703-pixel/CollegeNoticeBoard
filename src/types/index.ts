export type NoticeCategory =
  | 'Academic'
  | 'Events'
  | 'Internships'
  | 'Competitions'
  | 'Clubs'
  | 'General';

export type Department =
  | 'All Departments'
  | 'CSE'
  | 'ECE'
  | 'EEE'
  | 'Mechanical'
  | 'Civil'
  | 'Biotechnology'
  | 'Other';

export type TargetYear =
  | 'All Years'
  | '1st Year'
  | '2nd Year'
  | '3rd Year'
  | '4th Year';

export type TargetAudience =
  | 'Everyone'
  | 'Students'
  | 'Faculty'
  | 'Department Only'
  | 'Year Only';

export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  year?: TargetYear;
  avatar: string;
  savedNoticeIds: string[];
  upvotedNoticeIds: string[];
  createdAt: string;
}

export interface NoticeCreator {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  department?: Department;
}

export interface Notice {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  category: NoticeCategory;
  department: Department;
  year: TargetYear;
  audience: TargetAudience;
  creator: NoticeCreator;
  createdAt: string;
  updatedAt: string;
  expiryDate: string;
  isPinned: boolean;
  isPublished: boolean;
  upvoteCount: number;
  viewCount: number;
  imageUrl?: string;
  tags?: string[];
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  venue: string;
  organizer: string;
  category: NoticeCategory;
  imageUrl?: string;
  registeredUserIds: string[];
  createdAt: string;
}

export interface NotificationItemType {
  id: string;
  userId: string;
  type: 'upvote' | 'notice' | 'event' | 'expiry' | 'system';
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  link?: string;
  noticeId?: string;
}

export type SortOption =
  | 'latest'
  | 'oldest'
  | 'most_upvoted'
  | 'most_viewed'
  | 'expiring_soon';

export type NoticeFilterStatus = 'all' | 'active' | 'expired';

export interface NoticeFilters {
  searchQuery: string;
  category: NoticeCategory | 'All';
  department: Department | 'All Departments';
  year: TargetYear | 'All Years';
  audience: TargetAudience | 'Everyone';
  status: NoticeFilterStatus;
  pinnedOnly: boolean;
  sortBy: SortOption;
}

export type NavigationTab =
  | 'home'
  | 'events'
  | 'trending'
  | 'saved'
  | 'my-notices'
  | 'notifications'
  | 'profile'
  | 'admin';
