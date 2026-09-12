import { Notice, NoticeFilters } from '../types';
import { isNoticeExpired } from '../utils/formatters';
import { supabase } from '../lib/supabase';

const mapNotice = (row: any): Notice => {
  const creator = row.creator || {};

  return {
    id: row.id,
    title: row.title,
    shortDescription: row.short_description,
    content: row.content,
    category: row.category,
    department: row.department,
    year: row.year,
    audience: row.audience,
    creator: {
      id: creator.id || row.creator_id,
      name: creator.name || 'Unknown User',
      role: creator.role || 'student',
      department: creator.department || 'CSE',
      avatar:
        creator.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    expiryDate: row.expiry_date,
    isPinned: row.is_pinned,
    isPublished: row.is_published,
    upvoteCount: row.upvote_count || 0,
    viewCount: row.view_count || 0,
    imageUrl: row.image_url || undefined,
    tags: row.tags || [],
  };
};

const toDbPayload = (payload: any) => ({
  title: payload.title,
  short_description: payload.shortDescription,
  content: payload.content,
  category: payload.category,
  department: payload.department,
  year: payload.year,
  audience: payload.audience,
  creator_id: payload.creator?.id,
  expiry_date: payload.expiryDate,
  is_pinned: payload.isPinned ?? false,
  is_published: payload.isPublished ?? true,
  image_url: payload.imageUrl || null,
  tags: payload.tags || [],
});

const applyFilters = (
  list: Notice[],
  filters?: Partial<NoticeFilters>
): Notice[] => {
  if (!filters) return list;

  let result = [...list];

  if (filters.searchQuery?.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();

    result = result.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.shortDescription.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q) ||
        n.department.toLowerCase().includes(q) ||
        n.creator.name.toLowerCase().includes(q) ||
        (n.tags || []).some((tag) => tag.toLowerCase().includes(q))
    );
  }

  if (filters.category && filters.category !== 'All') {
    result = result.filter((n) => n.category === filters.category);
  }

  if (
    filters.department &&
    filters.department !== 'All Departments'
  ) {
    result = result.filter(
      (n) =>
        n.department === 'All Departments' ||
        n.department === filters.department
    );
  }

  if (filters.year && filters.year !== 'All Years') {
    result = result.filter(
      (n) => n.year === 'All Years' || n.year === filters.year
    );
  }

  if (filters.audience && filters.audience !== 'Everyone') {
    result = result.filter(
      (n) => n.audience === 'Everyone' || n.audience === filters.audience
    );
  }

  if (filters.status === 'active') {
    result = result.filter((n) => !isNoticeExpired(n.expiryDate));
  } else if (filters.status === 'expired') {
    result = result.filter((n) => isNoticeExpired(n.expiryDate));
  }

  if (filters.pinnedOnly) {
    result = result.filter((n) => n.isPinned);
  }

  const sortBy = filters.sortBy || 'latest';

  result.sort((a, b) => {
    if (sortBy === 'latest' || sortBy === 'expiring_soon') {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
    }

    if (sortBy === 'latest') {
      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    }

    if (sortBy === 'oldest') {
      return (
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
      );
    }

    if (sortBy === 'most_upvoted') {
      return b.upvoteCount - a.upvoteCount;
    }

    if (sortBy === 'most_viewed') {
      return b.viewCount - a.viewCount;
    }

    if (sortBy === 'expiring_soon') {
      return (
        new Date(a.expiryDate).getTime() -
        new Date(b.expiryDate).getTime()
      );
    }

    return 0;
  });

  return result;
};

export const noticeService = {
  async getNotices(
    filters?: Partial<NoticeFilters>
  ): Promise<{ data: Notice[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select(`
          *,
          creator:profiles!notices_creator_id_fkey(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load notices:', error);
        return { data: [], error: error.message };
      }

      const notices = (data || []).map(mapNotice);

      return {
        data: applyFilters(notices, filters),
        error: null,
      };
    } catch (error) {
      console.error('Failed to retrieve notices:', error);
      return {
        data: [],
        error: 'Failed to retrieve notices',
      };
    }
  },

  async getNoticeById(
    id: string
  ): Promise<{ data: Notice | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select(`
          *,
          creator:profiles!notices_creator_id_fkey(*)
        `)
        .eq('id', id)
        .single();

      if (error || !data) {
        return {
          data: null,
          error: error?.message || 'Notice not found',
        };
      }

      return {
        data: mapNotice(data),
        error: null,
      };
    } catch (error) {
      console.error('Error fetching notice:', error);

      return {
        data: null,
        error: 'Error fetching notice details',
      };
    }
  },

  async createNotice(
    payload: Omit<
      Notice,
      'id' |
      'createdAt' |
      'updatedAt' |
      'upvoteCount' |
      'viewCount'
    >
  ): Promise<{ data: Notice | null; error: string | null }> {
    try {
      const dbPayload = toDbPayload(payload);

      const { data, error } = await supabase
        .from('notices')
        .insert(dbPayload)
        .select(`
          *,
          creator:profiles!notices_creator_id_fkey(*)
        `)
        .single();

      if (error || !data) {
        console.error('Failed to create notice:', error);

        return {
          data: null,
          error: error?.message || 'Failed to create notice',
        };
      }

      return {
        data: mapNotice(data),
        error: null,
      };
    } catch (error) {
      console.error('Create notice error:', error);

      return {
        data: null,
        error: 'Failed to create notice',
      };
    }
  },

  async updateNotice(
    id: string,
    updates: Partial<Notice>
  ): Promise<{ data: Notice | null; error: string | null }> {
    try {
      const dbUpdates: Record<string, any> = {};

      if (updates.title !== undefined) {
        dbUpdates.title = updates.title;
      }

      if (updates.shortDescription !== undefined) {
        dbUpdates.short_description = updates.shortDescription;
      }

      if (updates.content !== undefined) {
        dbUpdates.content = updates.content;
      }

      if (updates.category !== undefined) {
        dbUpdates.category = updates.category;
      }

      if (updates.department !== undefined) {
        dbUpdates.department = updates.department;
      }

      if (updates.year !== undefined) {
        dbUpdates.year = updates.year;
      }

      if (updates.audience !== undefined) {
        dbUpdates.audience = updates.audience;
      }

      if (updates.expiryDate !== undefined) {
        dbUpdates.expiry_date = updates.expiryDate;
      }

      if (updates.isPinned !== undefined) {
        dbUpdates.is_pinned = updates.isPinned;
      }

      if (updates.isPublished !== undefined) {
        dbUpdates.is_published = updates.isPublished;
      }

      if (updates.imageUrl !== undefined) {
        dbUpdates.image_url = updates.imageUrl || null;
      }

      if (updates.tags !== undefined) {
        dbUpdates.tags = updates.tags;
      }

      const { data, error } = await supabase
        .from('notices')
        .update(dbUpdates)
        .eq('id', id)
        .select(`
          *,
          creator:profiles!notices_creator_id_fkey(*)
        `)
        .single();

      if (error || !data) {
        return {
          data: null,
          error: error?.message || 'Failed to update notice',
        };
      }

      return {
        data: mapNotice(data),
        error: null,
      };
    } catch (error) {
      console.error('Update notice error:', error);

      return {
        data: null,
        error: 'Failed to update notice',
      };
    }
  },

  async deleteNotice(
    id: string
  ): Promise<{ data: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('notices')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete notice error:', error);

        return {
          data: false,
          error: error.message,
        };
      }

      return {
        data: true,
        error: null,
      };
    } catch (error) {
      console.error('Delete notice error:', error);

      return {
        data: false,
        error: 'Failed to delete notice',
      };
    }
  },

  async toggleUpvote(
    noticeId: string,
    userId: string
  ): Promise<{
    data: { upvoted: boolean; count: number };
    error: string | null;
  }> {
    try {
      const { data: existing } = await supabase
        .from('notice_upvotes')
        .select('notice_id')
        .eq('notice_id', noticeId)
        .eq('user_id', userId)
        .maybeSingle();

      let upvoted: boolean;

      if (existing) {
        const { error } = await supabase
          .from('notice_upvotes')
          .delete()
          .eq('notice_id', noticeId)
          .eq('user_id', userId);

        if (error) {
          return {
            data: { upvoted: true, count: 0 },
            error: error.message,
          };
        }

        upvoted = false;
      } else {
        const { error } = await supabase
          .from('notice_upvotes')
          .insert({
            notice_id: noticeId,
            user_id: userId,
          });

        if (error) {
          return {
            data: { upvoted: false, count: 0 },
            error: error.message,
          };
        }

        upvoted = true;
      }

      const { count, error: countError } = await supabase
        .from('notice_upvotes')
        .select('*', { count: 'exact', head: true })
        .eq('notice_id', noticeId);

      return {
        data: {
          upvoted,
          count: count || 0,
        },
        error: countError?.message || null,
      };
    } catch (error) {
      console.error('Toggle upvote error:', error);

      return {
        data: { upvoted: false, count: 0 },
        error: 'Failed to toggle vote',
      };
    }
  },

  async toggleSaveNotice(
    noticeId: string,
    userId: string
  ): Promise<{
    data: { saved: boolean };
    error: string | null;
  }> {
    try {
      const { data: existing } = await supabase
        .from('saved_notices')
        .select('notice_id')
        .eq('notice_id', noticeId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('saved_notices')
          .delete()
          .eq('notice_id', noticeId)
          .eq('user_id', userId);

        if (error) {
          return {
            data: { saved: true },
            error: error.message,
          };
        }

        return {
          data: { saved: false },
          error: null,
        };
      }

      const { error } = await supabase
        .from('saved_notices')
        .insert({
          notice_id: noticeId,
          user_id: userId,
        });

      if (error) {
        return {
          data: { saved: false },
          error: error.message,
        };
      }

      return {
        data: { saved: true },
        error: null,
      };
    } catch (error) {
      console.error('Toggle save error:', error);

      return {
        data: { saved: false },
        error: 'Failed to toggle bookmark',
      };
    }
  },

  async getUserSavedIds(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('saved_notices')
        .select('notice_id')
        .eq('user_id', userId);

      if (error) {
        console.error('Failed to load saved notices:', error);
        return [];
      }

      return (data || []).map((item) => item.notice_id);
    } catch (error) {
      console.error('Failed to load saved notices:', error);
      return [];
    }
  },

  async getUserUpvotedIds(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('notice_upvotes')
        .select('notice_id')
        .eq('user_id', userId);

      if (error) {
        console.error('Failed to load upvoted notices:', error);
        return [];
      }

      return (data || []).map((item) => item.notice_id);
    } catch (error) {
      console.error('Failed to load upvoted notices:', error);
      return [];
    }
  },

  async incrementViewCount(
    noticeId: string
  ): Promise<{ data: number; error: string | null }> {
    try {
      const { data: notice, error: fetchError } = await supabase
        .from('notices')
        .select('view_count')
        .eq('id', noticeId)
        .single();

      if (fetchError || !notice) {
        return {
          data: 0,
          error: fetchError?.message || 'Notice not found',
        };
      }

      const newCount = (notice.view_count || 0) + 1;

      const { error: updateError } = await supabase
        .from('notices')
        .update({ view_count: newCount })
        .eq('id', noticeId);

      if (updateError) {
        return {
          data: notice.view_count || 0,
          error: updateError.message,
        };
      }

      return {
        data: newCount,
        error: null,
      };
    } catch (error) {
      console.error('Increment view count error:', error);

      return {
        data: 0,
        error: 'Failed to increment view count',
      };
    }
  },

  async togglePinNotice(
    noticeId: string
  ): Promise<{ data: boolean; error: string | null }> {
    try {
      const { data: notice, error: fetchError } = await supabase
        .from('notices')
        .select('is_pinned')
        .eq('id', noticeId)
        .single();

      if (fetchError || !notice) {
        return {
          data: false,
          error: fetchError?.message || 'Notice not found',
        };
      }

      const newPinnedState = !notice.is_pinned;

      const { error: updateError } = await supabase
        .from('notices')
        .update({ is_pinned: newPinnedState })
        .eq('id', noticeId);

      if (updateError) {
        return {
          data: notice.is_pinned,
          error: updateError.message,
        };
      }

      return {
        data: newPinnedState,
        error: null,
      };
    } catch (error) {
      console.error('Toggle pin error:', error);

      return {
        data: false,
        error: 'Failed to toggle pin',
      };
    }
  },
};