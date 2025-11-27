'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api-client';

// User type from API
export interface User {
  id: number;
  userId?: number; // Keep for backward compatibility
  email: string;
  fullName: string;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
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
    // Only check auth if we're not on login/register pages
    if (typeof window !== 'undefined') {
      const isAuthPage = window.location.pathname === '/login' || 
                        window.location.pathname === '/register';
      if (!isAuthPage) {
        checkAuth();
      } else {
        setLoading(false);
      }
    }
  }, []);

  const checkAuth = async () => {
    try {
      const response = await apiClient.get<User>('/Auth/me');
      
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      // Silently fail - user is not authenticated
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
        (window as any).toast?.show({ severity: 'success', summary: 'Thành công', detail: '🎉 Đăng nhập thành công!', life: 3000 });
        return { success: true };
      }
      
      // Extract errors from response
      const errorMsg = response.errors && Array.isArray(response.errors) && response.errors.length > 0
        ? response.errors.join('\n')
        : response.message || 'Đăng nhập thất bại';
      
      (window as any).toast?.show({ severity: 'error', summary: 'Lỗi', detail: errorMsg, life: 4000 });
      return {
        success: false,
        message: response.message || 'Đăng nhập thất bại'
      };
    } catch (error: any) {
      // Extract errors from error response
      const apiErrors = error?.response?.data?.errors;
      const errorMsg = apiErrors && Array.isArray(apiErrors) && apiErrors.length > 0
        ? apiErrors.join('\n')
        : error?.response?.data?.message || error?.message || 'Lỗi kết nối server';
      
      (window as any).toast?.show({ severity: 'error', summary: 'Lỗi', detail: errorMsg, life: 4000 });
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
        (window as any).toast?.show({ severity: 'success', summary: 'Thành công', detail: '✨ Đăng ký thành công! Vui lòng đăng nhập.', life: 3000 });
        return { success: true };
      }
      
      // Extract errors from response
      const errorMsg = response.errors && Array.isArray(response.errors) && response.errors.length > 0
        ? response.errors.join('\n')
        : response.message || 'Đăng ký thất bại';
      
      (window as any).toast?.show({ severity: 'error', summary: 'Lỗi', detail: errorMsg, life: 4000 });
      return {
        success: false,
        message: response.message || 'Đăng ký thất bại'
      };
    } catch (error: any) {
      // Extract errors from error response
      const apiErrors = error?.response?.data?.errors;
      const errorMsg = apiErrors && Array.isArray(apiErrors) && apiErrors.length > 0
        ? apiErrors.join('\n')
        : error?.response?.data?.message || error?.message || 'Lỗi kết nối server';
      
      (window as any).toast?.show({ severity: 'error', summary: 'Lỗi', detail: errorMsg, life: 4000 });
      return {
        success: false,
        message: error.message || 'Lỗi kết nối server'
      };
    }
  };

  const logout = async () => {
    try {
      await apiClient.post<null>('/Auth/logout', {});
      (window as any).toast?.show({ severity: 'success', summary: 'Thành công', detail: '👋 Đăng xuất thành công!', life: 3000 });
    } catch (error) {
      // Silently fail - will redirect anyway
      (window as any).toast?.show({ severity: 'error', summary: 'Lỗi', detail: 'Có lỗi khi đăng xuất', life: 3000 });
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
