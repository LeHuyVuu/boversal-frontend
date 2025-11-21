'use client';

import React from 'react';
import { Documents } from '../components/Documents';
import { useTheme } from '@/contexts/ThemeContext';

export default function DocumentsPage() {
  const { theme } = useTheme();
  
  return (
    <div className={theme === 'dark' ? 'bg-black/50' : 'bg-white'}>
      <Documents />
    </div>
  );
}
