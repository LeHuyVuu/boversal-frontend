'use client';

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { GalaxyBackground } from '@/components/GalaxyBackground';

type Section = 'dashboard' | 'projects' | 'issues' | 'calendar' | 'meetings' | 'storage' | 'documents';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
  };

  return (
    <>
      <GalaxyBackground />
      <div className="flex h-screen relative z-10">
        <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />

        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </>
  );
}
