'use client';

import React from 'react';
import { Search, Bell } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';

export const TopBar: React.FC = () => {
  const { theme } = useTheme();

  return (
    <header className={`border-b px-6 py-4 transition-colors ${
      theme === 'dark'
        ? 'bg-black/50 border-blue-500/20 backdrop-blur-sm'
        : 'bg-sky-50 border-sky-200'
    }`}>
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              theme === 'dark' ? 'text-cyan-400' : 'text-slate-400'
            }`} />
            <input
              type="text"
              placeholder="Search people, projects or tasks"
              className={`w-full rounded-lg pl-10 pr-4 py-2 text-sm transition-all ${
                theme === 'dark'
                  ? 'bg-slate-900/80 border border-blue-500/30 text-cyan-100 placeholder-cyan-400/60 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                  : 'bg-white border border-sky-200 text-slate-700 placeholder-slate-400 focus:border-sky-400 focus:ring-1 focus:ring-sky-400'
              } focus:outline-none`}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          <button className={`relative p-2 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'text-cyan-300 hover:text-cyan-100 hover:bg-blue-900/30'
              : 'text-slate-500 hover:text-slate-700 hover:bg-sky-100'
          }`}>
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-pink-400 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Avatar */}
          <div className="flex items-center space-x-3">
            <img
              src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
              alt="User"
              className={`w-8 h-8 rounded-full ring-2 ${
                theme === 'dark' ? 'ring-blue-500/50' : 'ring-sky-200'
              }`}
            />
            <div className="hidden sm:block">
              <p className={`text-sm font-medium ${
                theme === 'dark' ? 'text-cyan-100' : 'text-slate-700'
              }`}>Sarah Chen</p>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'
              }`}>Product Manager</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
