'use client';

import React from 'react';
import { Issues } from '../components/Issues';
import { useTheme } from '@/contexts/ThemeContext';

export default function IssuesPage() {
  const { theme } = useTheme();
  
  return (
    <div className={theme === 'dark' ? 'bg-black/50' : 'bg-white'}>
      <Issues />
    </div>
  );
}
