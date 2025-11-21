'use client';

import { useParams } from 'next/navigation';
import ProjectDetail from '../../components/ProjectDetail';
import { KanbanBoard } from '../../components/KanbanBoard';

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div>
      <ProjectDetail />
      <KanbanBoard />
    </div>
  );
}
