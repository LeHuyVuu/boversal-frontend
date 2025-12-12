'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import StructuredData from '@/components/StructuredData';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/workspace/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <>
      <StructuredData />
      
      {/* SEO Content - Hidden but crawlable */}
      <div className="sr-only">
        <h1>Boversal - Modern Project Management Platform</h1>
        <p>
          Boversal is a comprehensive project management solution designed for teams
          and individuals. Manage projects, track tasks, schedule meetings, and set
          reminders all in one place. Built with modern technology for maximum
          productivity.
        </p>
        <h2>Features</h2>
        <ul>
          <li>Project Management - Organize and track your projects</li>
          <li>Task Tracking - Kanban boards and task management</li>
          <li>Team Collaboration - Work together seamlessly</li>
          <li>Meeting Scheduler - Schedule and manage meetings</li>
          <li>Calendar & Reminders - Never miss important dates</li>
          <li>Real-time Updates - Stay synchronized with your team</li>
        </ul>
      </div>
      
      {/* Loading UI */}
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          <p className="mt-4 text-gray-400">Đang tải...</p>
        </div>
      </div>
    </>
  );
}
