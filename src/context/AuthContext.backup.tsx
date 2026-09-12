'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, Department, TargetYear } from '../types';
import { MOCK_USERS, DEFAULT_CURRENT_USER, DEFAULT_ADMIN_USER } from '../data/users';
import { userService } from '../services/userService';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
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

const AUTH_STATUS_KEY = 'college_notice_board_auth_status_v1';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state
  useEffect(() => {
    async function init() {
      try {
        const storedAuth = localStorage.getItem(AUTH_STATUS_KEY);
        if (storedAuth === 'true') {
          const res = await userService.getCurrentUser();
          if (res.data) {
            setCurrentUser(res.data);
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        console.error('Failed to restore auth session:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 600)); // Simulate auth delay

    // Find in mock users or fallback
    const matched = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (matched) {
      setCurrentUser(matched);
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_STATUS_KEY, 'true');
      await userService.setCurrentUser(matched);
      setIsLoading(false);
      return { success: true };
    }

    // Allow any university email ending with .edu
    if (email.includes('@') && email.includes('.')) {
      const isFaculty = email.includes('prof') || email.includes('dr') || email.includes('faculty');
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        email,
        role: isFaculty ? 'faculty' : 'student',
        department: 'CSE',
        year: '3rd Year',
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        savedNoticeIds: [],
        upvotedNoticeIds: [],
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_STATUS_KEY, 'true');
      await userService.setCurrentUser(newUser);
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return { success: false, error: 'Invalid credentials. Please enter a valid campus email.' };
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
    await new Promise((res) => setTimeout(res, 600));

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      role: payload.role || 'student',
      department: payload.department || 'CSE',
      year: payload.year || '1st Year',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      savedNoticeIds: [],
      upvotedNoticeIds: [],
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_STATUS_KEY, 'true');
    await userService.setCurrentUser(newUser);
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STATUS_KEY);
  };

  const loginAsPreset = (role: 'student' | 'admin') => {
    const user = role === 'admin' ? DEFAULT_ADMIN_USER : DEFAULT_CURRENT_USER;
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_STATUS_KEY, 'true');
    userService.setCurrentUser(user);
  };

  const switchRole = (role: UserRole) => {
    if (!currentUser) return;
    const targetPreset = role === 'admin' ? DEFAULT_ADMIN_USER : DEFAULT_CURRENT_USER;
    const updated: User = {
      ...currentUser,
      role,
      name: role === 'admin' ? DEFAULT_ADMIN_USER.name : currentUser.name,
      avatar: role === 'admin' ? DEFAULT_ADMIN_USER.avatar : currentUser.avatar,
    };
    setCurrentUser(updated);
    userService.setCurrentUser(updated);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    await userService.setCurrentUser(updated);
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
