import { useState } from 'react';
import { projectService } from '@/services/projectService';
import type { CreateProjectDto } from '@/types/project';

export function useCreateProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = async (data: CreateProjectDto): Promise<number | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await projectService.createProject(data);

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createProject, loading, error };
}
