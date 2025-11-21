'use client';

import React from 'react';
import { Dashboard } from './components/Dashboard';
import { useTheme } from '@/contexts/ThemeContext';

export default function WorkspacePage() {
  const { theme } = useTheme();
  
  return (
    <div className={theme === 'dark' ? 'bg-black/50' : 'bg-white'}>
      <Dashboard />
    </div>
  );
}
