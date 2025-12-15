'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { GalaxyBackground } from '@/components/GalaxyBackground';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/lara-dark-cyan/theme.css';
import 'primeicons/primeicons.css';

type Section = 'dashboard' | 'projects' | 'issues' | 'calendar' | 'meetings' | 'pomodoro' | 'notes' | 'storage' | 'documents';

export default function Layout({ children }: { children: React.ReactNode }) {
  const toast = useRef<any>(null);
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Make toast available globally
    if (typeof window !== 'undefined') {
      (window as any).toast = toast.current;
    }
  }, []);

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false); // Close mobile menu after selection
  };

  return (
    <ProtectedRoute>
      <GalaxyBackground />
      <Toast ref={toast} position="top-right" />
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
