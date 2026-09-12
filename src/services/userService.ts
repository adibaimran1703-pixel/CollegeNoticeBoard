import { supabase } from '../lib/supabase';
import { User } from '../types';

function mapUser(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    department: row.department,
    year: row.year || undefined,
    avatar: row.avatar || undefined,
    savedNoticeIds: row.saved_notice_ids || [],
    upvotedNoticeIds: row.upvoted_notice_ids || [],
    createdAt: row.created_at,
  };
}

export const userService = {
  async getCurrentUser(): Promise<{
    data: User | null;
    error: string | null;
  }> {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return {
          data: null,
          error: authError?.message || 'No authenticated user',
        };
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        return {
          data: null,
          error: error.message,
        };
      }

      return {
        data: mapUser(data),
        error: null,
      };
    } catch {
      return {
        data: null,
        error: 'Failed to fetch current user',
      };
    }
  },

  async setCurrentUser(
    user: User
  ): Promise<{ data: User; error: string | null }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: user.name,
          department: user.department,
          year: user.year || null,
          avatar: user.avatar || null,
        })
        .eq('id', user.id);

      if (error) {
        return {
          data: user,
          error: error.message,
        };
      }

      return {
        data: user,
        error: null,
      };
    } catch {
      return {
        data: user,
        error: 'Failed to update user',
      };
    }
  },

  async getAllUsers(): Promise<{
    data: User[];
    error: string | null;
  }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return {
          data: [],
          error: error.message,
        };
      }

      return {
        data: (data || []).map(mapUser),
        error: null,
      };
    } catch {
      return {
        data: [],
        error: 'Failed to fetch users',
      };
    }
  },

  async updateProfile(
    updates: Partial<User>
  ): Promise<{
    data: User | null;
    error: string | null;
  }> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return {
          data: null,
          error: 'No authenticated user',
        };
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...(updates.name !== undefined && { name: updates.name }),
          ...(updates.department !== undefined && {
            department: updates.department,
          }),
          ...(updates.year !== undefined && {
            year: updates.year || null,
          }),
          ...(updates.avatar !== undefined && {
            avatar: updates.avatar || null,
          }),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return {
          data: null,
          error: error.message,
        };
      }

      return {
        data: mapUser(data),
        error: null,
      };
    } catch {
      return {
        data: null,
        error: 'Failed to update profile',
      };
    }
  },
};