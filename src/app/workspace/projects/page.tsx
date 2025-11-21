'use client';

import React from 'react';
import { Projects } from '../components/Projects';
import { useTheme } from '@/contexts/ThemeContext';

export default function ProjectsPage() {
  const { theme } = useTheme();
  
  return (
    <div className={theme === 'dark' ? 'bg-black/50' : 'bg-white'}>
      <Projects />
    </div>
  );
}
