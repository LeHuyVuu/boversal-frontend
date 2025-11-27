'use client';

import { useParams } from 'next/navigation';
import ProjectDetail from '../../components/ProjectDetail';
import { KanbanBoard } from '../../components/KanbanBoard';
import { useTheme } from '@/contexts/ThemeContext';

export default function ProjectDetailPage() {
  const { theme } = useTheme();
  const params = useParams();
  const projectId = params?.id ? Number(params.id) : undefined;

  return (
    <div className={theme === 'dark' ? 'bg-black/50' : 'bg-white'}>
      {/* <ProjectDetail projectId={projectId} /> */}
      <KanbanBoard projectId={projectId} />
    </div>
  );
}
