'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, LogOut, User } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

interface TopBarProps {
  onMobileMenuToggle: () => void;
}

export const TopBar = React.memo<TopBarProps>(({ onMobileMenuToggle }) => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className={`border-b px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 backdrop-blur-md ${
      theme === 'dark'
        ? 'bg-black/50 border-blue-500/20'
        : 'bg-sky-50/80 border-sky-200'
    }`}>
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMobileMenuToggle}
          className={`lg:hidden p-2.5 rounded-xl transition-all duration-200 ${
            theme === 'dark'
              ? 'text-cyan-300 hover:text-cyan-100 hover:bg-blue-900/30 active:scale-95'
              : 'text-slate-500 hover:text-slate-700 hover:bg-sky-100 active:scale-95'
          }`}
        >
          <Menu className="w-5 h-5" />
        </button>
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative group">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors ${
              theme === 'dark' ? 'text-cyan-400 group-focus-within:text-cyan-300' : 'text-slate-400 group-focus-within:text-sky-500'
            }`} />
            <input
              type="text"
              placeholder="Search..."
              className={`w-full rounded-xl pl-10 pr-4 py-2 text-sm transition-all duration-300 focus-ring ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border border-blue-500/30 text-cyan-100 placeholder-cyan-400/60 focus:border-cyan-400 focus:bg-slate-900'
                  : 'bg-white border border-sky-200 text-slate-700 placeholder-slate-400 focus:border-sky-400 focus:bg-white focus:shadow-lg'
              } focus:outline-none`}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          <button className={`relative p-2.5 rounded-xl transition-all duration-200 group ${
            theme === 'dark'
              ? 'text-cyan-300 hover:text-cyan-100 hover:bg-blue-900/30 active:scale-95'
              : 'text-slate-500 hover:text-slate-700 hover:bg-sky-100 active:scale-95'
          }`}>
            <Bell className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:rotate-12" />
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse-glow font-bold shadow-lg">
              3
            </span>
          </button>

          {/* User Avatar & Menu */}
          <div className={`relative flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-4 border-l transition-colors ${
            theme === 'dark' ? 'border-blue-500/20' : 'border-sky-200'
          }`} ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 sm:space-x-3 focus:outline-none"
            >
              <div className={`w-9 h-9 rounded-full ring-2 flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer ${
                theme === 'dark' 
                  ? 'ring-blue-500/50 hover:ring-cyan-400 bg-gradient-to-br from-cyan-500 to-blue-500' 
                  : 'ring-sky-200 hover:ring-sky-400 bg-gradient-to-br from-sky-400 to-blue-500'
              }`}>
                <span className="text-white font-bold text-sm">
                  {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className={`text-sm font-semibold ${
                  theme === 'dark' ? 'text-cyan-100' : 'text-slate-700'
                }`}>{user?.fullName || 'User'}</p>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'
                }`}>{user?.email || ''}</p>
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className={`absolute right-0 top-full mt-2 w-48 rounded-xl shadow-2xl overflow-hidden z-50 ${
                theme === 'dark'
                  ? 'bg-gray-900 border border-cyan-500/20'
                  : 'bg-white border border-sky-200'
              }`}>
                <div className={`px-4 py-3 border-b ${
                  theme === 'dark' ? 'border-cyan-500/20' : 'border-sky-200'
                }`}>
                  <p className={`text-sm font-semibold ${
                    theme === 'dark' ? 'text-cyan-100' : 'text-slate-700'
                  }`}>{user?.fullName}</p>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'
                  }`}>{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className={`w-full px-4 py-2.5 text-left flex items-center gap-2 transition-colors ${
                    theme === 'dark'
                      ? 'text-red-400 hover:bg-red-500/10'
                      : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
});

TopBar.displayName = 'TopBar';
