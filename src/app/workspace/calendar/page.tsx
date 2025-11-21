'use client';

import React from 'react';
import { Calendar } from '../components/Calendar';
import { useTheme } from '@/contexts/ThemeContext';

export default function CalendarPage() {
  const { theme } = useTheme();
  
  return (
    <div className={theme === 'dark' ? 'bg-black/50' : 'bg-white'}>
      <Calendar />
    </div>
  );
}
