'use client';

import { useParams } from 'next/navigation';
import ProjectDetail from '../../components/ProjectDetail';
import { KanbanBoard } from '../../components/KanbanBoard';
import { useTheme } from '@/contexts/ThemeContext';

export default function ProjectDetailPage() {
  const { theme } = useTheme();
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className={theme === 'dark' ? 'bg-black/50' : 'bg-white'}>
      <ProjectDetail />
      <KanbanBoard />
    </div>
  );
}
