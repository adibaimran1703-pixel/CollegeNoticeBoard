'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

import {
  User,
  UserRole,
  Department,
  TargetYear,
} from '../types';

import { supabase } from '../lib/supabase';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  isLoading: boolean;

  login: (
    email: string,
    pass: string
  ) => Promise<{ success: boolean; error?: string }>;

  signup: (payload: {
    name: string;
    email: string;
    password: string;
    department: Department;
    year?: TargetYear;
    role?: UserRole;
  }) => Promise<{ success: boolean; error?: string }>;

  logout: () => void;

  loginAsPreset: (role: 'student' | 'admin') => void;

  switchRole: (role: UserRole) => void;

  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

const mapProfileToUser = (profile: any): User => ({
  id: profile.id,
  name: profile.name || 'Student',
  email: profile.email || '',
  role: profile.role || 'student',
  department: profile.department || 'CSE',
  year: profile.year || '1st Year',
  avatar: profile.avatar || DEFAULT_AVATAR,
  savedNoticeIds: [],
  upvotedNoticeIds: [],
  createdAt: profile.created_at || new Date().toISOString(),
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = async (userId: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.error('Failed to load profile:', error);
      return null;
    }

    const user = mapProfileToUser(data);

    setCurrentUser(user);
    setIsAuthenticated(true);

    return user;
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (mounted && session?.user) {
          await loadProfile(session.user.id);
        }
      } catch (error) {
        console.error('Failed to restore auth session:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (session?.user) {
        await loadProfile(session.user.id);
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: pass,
    });

    if (error) {
      console.error('Login error:', error);
      setIsLoading(false);

      return {
        success: false,
        error: error.message,
      };
    }

    if (!data.user) {
      setIsLoading(false);

      return {
        success: false,
        error: 'Login failed. User account was not found.',
      };
    }

    const profile = await loadProfile(data.user.id);

    if (!profile) {
      setIsLoading(false);

      return {
        success: false,
        error:
          'Login succeeded, but your profile could not be loaded. Please contact the administrator.',
      };
    }

    setIsLoading(false);

    return {
      success: true,
    };
  };

  const signup = async (payload: {
    name: string;
    email: string;
    password: string;
    department: Department;
    year?: TargetYear;
    role?: UserRole;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const email = payload.email.trim().toLowerCase();

      const { data, error } = await supabase.auth.signUp({
        email,
        password: payload.password,
        options: {
          data: {
            name: payload.name.trim(),
            department: payload.department,
            year: payload.year || '1st Year',
            role: payload.role || 'student',
          },
        },
      });

      if (error) {
        console.error('Signup error:', error);

        return {
          success: false,
          error: error.message,
        };
      }

      if (!data.user) {
        return {
          success: false,
          error: 'Supabase did not create the user account.',
        };
      }

      /*
       * If Supabase returns an active session immediately,
       * create the profile from the authenticated client.
       *
       * If email confirmation is enabled, there may be no session yet.
       * In that case the database trigger should create the profile
       * when the Auth user is created.
       */
      if (data.session) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            name: payload.name.trim(),
            email,
            role: payload.role || 'student',
            department: payload.department,
            year: payload.year || '1st Year',
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);

          return {
            success: false,
            error: `Account created, but profile creation failed: ${profileError.message}`,
          };
        }

        await loadProfile(data.user.id);
      }

      return {
        success: true,
      };
    } catch (error: any) {
      console.error('Unexpected signup error:', error);

      return {
        success: false,
        error: error?.message || 'An unexpected error occurred during signup.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    void supabase.auth.signOut();

    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  /*
   * Kept for compatibility with the existing AuthPage.
   * Real authentication should use the Sign In form.
   */
  const loginAsPreset = (_role: 'student' | 'admin') => {
    console.warn(
      'Preset login is disabled. Please use a real Supabase account.'
    );
  };

  const switchRole = async (role: UserRole) => {
    if (!currentUser) return;

    if (currentUser.role !== 'admin') {
      console.warn('Only administrators can switch roles.');
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        role,
      })
      .eq('id', currentUser.id)
      .select()
      .single();

    if (error || !data) {
      console.error('Failed to switch role:', error);
      return;
    }

    setCurrentUser(mapProfileToUser(data));
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!currentUser) return;

    const profileUpdates: Record<string, any> = {};

    if (updates.name !== undefined) {
      profileUpdates.name = updates.name;
    }

    if (updates.email !== undefined) {
      profileUpdates.email = updates.email;
    }

    if (updates.role !== undefined) {
      profileUpdates.role = updates.role;
    }

    if (updates.department !== undefined) {
      profileUpdates.department = updates.department;
    }

    if (updates.year !== undefined) {
      profileUpdates.year = updates.year;
    }

    if (updates.avatar !== undefined) {
      profileUpdates.avatar = updates.avatar;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('id', currentUser.id)
      .select()
      .single();

    if (error || !data) {
      console.error('Failed to update profile:', error);
      return;
    }

    setCurrentUser(mapProfileToUser(data));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        isLoading,
        login,
        signup,
        logout,
        loginAsPreset,
        switchRole,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}