'use client';

import React from 'react';
import { Meetings } from '../components/Meetings';
import { useTheme } from '@/contexts/ThemeContext';

export default function MeetingsPage() {
  const { theme } = useTheme();
  
  return (
    <div className={theme === 'dark' ? 'bg-black/50' : 'bg-white'}>
      <Meetings />
    </div>
  );
}
