'use client';

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative p-2 rounded-lg transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-purple-900/50 to-blue-900/50 text-purple-200 hover:from-purple-800/60 hover:to-blue-800/60 animate-glow'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur-md opacity-50" />
          <Moon className="w-5 h-5 relative z-10 transition-transform duration-300 hover:rotate-12" />
        </div>
      ) : (
        <Sun className="w-5 h-5 transition-transform duration-300 hover:rotate-90" />
      )}
    </button>
  );
};
