'use client';

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { GalaxyBackground } from '@/components/GalaxyBackground';
import ProtectedRoute from '@/components/ProtectedRoute';

type Section = 'dashboard' | 'projects' | 'issues' | 'calendar' | 'meetings' | 'storage' | 'documents';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false); // Close mobile menu after selection
  };

  return (
    <ProtectedRoute>
      <GalaxyBackground />
      <div className="flex h-screen relative z-10">
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={handleSectionChange}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <TopBar 
            onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
