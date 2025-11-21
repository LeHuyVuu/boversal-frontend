'use client';

import React from 'react';
import { Storage } from '../components/Storage';
import { useTheme } from '@/contexts/ThemeContext';

export default function StoragePage() {
  const { theme } = useTheme();
  
  return (
    <div className={theme === 'dark' ? 'bg-black/50' : 'bg-white'}>
      <Storage />
    </div>
  );
}
