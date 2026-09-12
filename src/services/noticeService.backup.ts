import { INITIAL_NOTICES } from '../data/notices';
import { Notice, NoticeFilters } from '../types';
import { isNoticeExpired } from '../utils/formatters';

const STORAGE_KEY = 'college_notice_board_notices_v1';
const VOTES_KEY = 'college_notice_board_user_votes_v1';
const SAVED_KEY = 'college_notice_board_user_saved_v1';

// Helper to get notices from localStorage or fallback to mock data
function loadNotices(): Notice[] {
  if (typeof window === 'undefined') return INITIAL_NOTICES;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.warn('Failed to load notices from storage:', err);
  }
  return INITIAL_NOTICES;
}

function persistNotices(notices: Notice[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notices));
  } catch (err) {
    console.warn('Failed to persist notices to storage:', err);
  }
}

// Service Interface returning Supabase-like Promise<{ data, error }>
export const noticeService = {
  async getNotices(filters?: Partial<NoticeFilters>): Promise<{ data: Notice[]; error: string | null }> {
    await new Promise((res) => setTimeout(res, 120)); // Simulate async network
    try {
      let list = loadNotices();

      if (filters) {
        // Search
        if (filters.searchQuery && filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase().trim();
          list = list.filter((n) =>
            n.title.toLowerCase().includes(q) ||
            n.shortDescription.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q) ||
            n.category.toLowerCase().includes(q) ||
            n.department.toLowerCase().includes(q) ||
            n.creator.name.toLowerCase().includes(q) ||
            (n.tags && n.tags.some((t) => t.toLowerCase().includes(q)))
          );
        }

        // Category filter
        if (filters.category && filters.category !== 'All') {
          list = list.filter((n) => n.category === filters.category);
        }

        // Department filter
        if (filters.department && filters.department !== 'All Departments') {
          list = list.filter((n) => n.department === 'All Departments' || n.department === filters.department);
        }

        // Year filter
        if (filters.year && filters.year !== 'All Years') {
          list = list.filter((n) => n.year === 'All Years' || n.year === filters.year);
        }

        // Audience filter
        if (filters.audience && filters.audience !== 'Everyone') {
          list = list.filter((n) => n.audience === 'Everyone' || n.audience === filters.audience);
        }

        // Expiry status filter
        if (filters.status === 'active') {
          list = list.filter((n) => !isNoticeExpired(n.expiryDate));
        } else if (filters.status === 'expired') {
          list = list.filter((n) => isNoticeExpired(n.expiryDate));
        }

        // Pinned only
        if (filters.pinnedOnly) {
          list = list.filter((n) => n.isPinned);
        }

        // Sorting
        const sortBy = filters.sortBy || 'latest';
        list = [...list].sort((a, b) => {
          // Keep pinned items on top unless specifically sorting differently
          if (sortBy === 'latest' || sortBy === 'expiring_soon') {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
          }

          if (sortBy === 'latest') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          if (sortBy === 'oldest') {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          }
          if (sortBy === 'most_upvoted') {
            return b.upvoteCount - a.upvoteCount;
          }
          if (sortBy === 'most_viewed') {
            return b.viewCount - a.viewCount;
          }
          if (sortBy === 'expiring_soon') {
            return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
          }
          return 0;
        });
      }

      return { data: list, error: null };
    } catch (err) {
      return { data: [], error: 'Failed to retrieve notices' };
    }
  },

  async getNoticeById(id: string): Promise<{ data: Notice | null; error: string | null }> {
    await new Promise((res) => setTimeout(res, 80));
    try {
      const list = loadNotices();
      const notice = list.find((n) => n.id === id) || null;
      return { data: notice, error: notice ? null : 'Notice not found' };
    } catch (err) {
      return { data: null, error: 'Error fetching notice details' };
    }
  },

  async createNotice(
    payload: Omit<Notice, 'id' | 'createdAt' | 'updatedAt' | 'upvoteCount' | 'viewCount'>
  ): Promise<{ data: Notice | null; error: string | null }> {
    await new Promise((res) => setTimeout(res, 200));
    try {
      const list = loadNotices();
      const newNotice: Notice = {
        ...payload,
        id: `not_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        upvoteCount: 0,
        viewCount: 0,
      };

      const updatedList = [newNotice, ...list];
      persistNotices(updatedList);
      return { data: newNotice, error: null };
    } catch (err) {
      return { data: null, error: 'Failed to create notice' };
    }
  },

  async updateNotice(id: string, updates: Partial<Notice>): Promise<{ data: Notice | null; error: string | null }> {
    await new Promise((res) => setTimeout(res, 180));
    try {
      const list = loadNotices();
      const index = list.findIndex((n) => n.id === id);
      if (index === -1) {
        return { data: null, error: 'Notice not found for update' };
      }

      const updatedNotice: Notice = {
        ...list[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      list[index] = updatedNotice;
      persistNotices(list);
      return { data: updatedNotice, error: null };
    } catch (err) {
      return { data: null, error: 'Failed to update notice' };
    }
  },

  async deleteNotice(id: string): Promise<{ data: boolean; error: string | null }> {
    await new Promise((res) => setTimeout(res, 150));
    try {
      const list = loadNotices();
      const filtered = list.filter((n) => n.id !== id);
      persistNotices(filtered);
      return { data: true, error: null };
    } catch (err) {
      return { data: false, error: 'Failed to delete notice' };
    }
  },

  async toggleUpvote(noticeId: string, userId: string): Promise<{ data: { upvoted: boolean; count: number }; error: string | null }> {
    await new Promise((res) => setTimeout(res, 90));
    try {
      const list = loadNotices();
      const notice = list.find((n) => n.id === noticeId);
      if (!notice) return { data: { upvoted: false, count: 0 }, error: 'Notice not found' };

      // Load user votes from localStorage
      let votesMap: Record<string, string[]> = {};
      try {
        const stored = localStorage.getItem(VOTES_KEY);
        if (stored) votesMap = JSON.parse(stored);
      } catch {}

      const userVotes = new Set(votesMap[userId] || []);
      let isUpvoted = false;

      if (userVotes.has(noticeId)) {
        userVotes.delete(noticeId);
        notice.upvoteCount = Math.max(0, notice.upvoteCount - 1);
        isUpvoted = false;
      } else {
        userVotes.add(noticeId);
        notice.upvoteCount += 1;
        isUpvoted = true;
      }

      votesMap[userId] = Array.from(userVotes);
      if (typeof window !== 'undefined') {
        localStorage.setItem(VOTES_KEY, JSON.stringify(votesMap));
      }
      persistNotices(list);

      return { data: { upvoted: isUpvoted, count: notice.upvoteCount }, error: null };
    } catch (err) {
      return { data: { upvoted: false, count: 0 }, error: 'Failed to toggle vote' };
    }
  },

  async toggleSaveNotice(noticeId: string, userId: string): Promise<{ data: { saved: boolean }; error: string | null }> {
    await new Promise((res) => setTimeout(res, 90));
    try {
      let savedMap: Record<string, string[]> = {};
      try {
        const stored = localStorage.getItem(SAVED_KEY);
        if (stored) savedMap = JSON.parse(stored);
      } catch {}

      const userSaved = new Set(savedMap[userId] || ['not_hackathon_2026', 'not_google_internship']);
      let isSaved = false;

      if (userSaved.has(noticeId)) {
        userSaved.delete(noticeId);
        isSaved = false;
      } else {
        userSaved.add(noticeId);
        isSaved = true;
      }

      savedMap[userId] = Array.from(userSaved);
      if (typeof window !== 'undefined') {
        localStorage.setItem(SAVED_KEY, JSON.stringify(savedMap));
      }

      return { data: { saved: isSaved }, error: null };
    } catch (err) {
      return { data: { saved: false }, error: 'Failed to toggle bookmark' };
    }
  },

  async getUserSavedIds(userId: string): Promise<string[]> {
    if (typeof window === 'undefined') return ['not_hackathon_2026', 'not_google_internship'];
    try {
      const stored = localStorage.getItem(SAVED_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed[userId]) return parsed[userId];
      }
    } catch {}
    return ['not_hackathon_2026', 'not_google_internship'];
  },

  async getUserUpvotedIds(userId: string): Promise<string[]> {
    if (typeof window === 'undefined') return ['not_ai_ml_workshop', 'not_hackathon_2026'];
    try {
      const stored = localStorage.getItem(VOTES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed[userId]) return parsed[userId];
      }
    } catch {}
    return ['not_ai_ml_workshop', 'not_hackathon_2026'];
  },

  // View count increment triggered explicitly when viewing notice details
  async incrementViewCount(noticeId: string): Promise<{ data: number; error: string | null }> {
    try {
      const list = loadNotices();
      const notice = list.find((n) => n.id === noticeId);
      if (notice) {
        notice.viewCount += 1;
        persistNotices(list);
        return { data: notice.viewCount, error: null };
      }
      return { data: 0, error: 'Notice not found' };
    } catch (err) {
      return { data: 0, error: 'Failed to increment view count' };
    }
  },

  async togglePinNotice(noticeId: string): Promise<{ data: boolean; error: string | null }> {
    await new Promise((res) => setTimeout(res, 120));
    try {
      const list = loadNotices();
      const notice = list.find((n) => n.id === noticeId);
      if (notice) {
        notice.isPinned = !notice.isPinned;
        persistNotices(list);
        return { data: notice.isPinned, error: null };
      }
      return { data: false, error: 'Notice not found' };
    } catch (err) {
      return { data: false, error: 'Failed to toggle pin' };
    }
  },
};
