'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api-client';

// User type from API
export interface User {
  userId: number;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role?: string;
}

// Auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (email: string, password: string, fullName: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await apiClient.get<User>('/Auth/me');
      
      if (response.success) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('[Auth] Check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post<User>('/Auth/login', { email, password });
      
      if (response.success) {
        await checkAuth(); // Fetch user data after successful login
        return { success: true };
      }
      
      return {
        success: false,
        message: response.message || 'Đăng nhập thất bại'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Lỗi kết nối server'
      };
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    try {
      const response = await apiClient.post<User>('/Auth/register', {
        email,
        password,
        fullName
      });
      
      if (response.success) {
        return { success: true };
      }
      
      return {
        success: false,
        message: response.message || 'Đăng ký thất bại'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Lỗi kết nối server'
      };
    }
  };

  const logout = async () => {
    try {
      await apiClient.post<null>('/Auth/logout', {});
    } catch (error) {
      console.error('[Auth] Logout failed:', error);
    } finally {
      setUser(null);
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
