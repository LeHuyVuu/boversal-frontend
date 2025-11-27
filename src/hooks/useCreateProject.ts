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

      (window as any).toast?.show({ severity: 'success', summary: 'Thành công', detail: '✨ Project created successfully!', life: 3000 });
      return response.data;
    } catch (err: any) {
      // Extract errors from error response
      const apiErrors = err?.response?.data?.errors;
      const errorMsg = apiErrors && Array.isArray(apiErrors) && apiErrors.length > 0
        ? apiErrors.join('\n')
        : err?.response?.data?.message || (err instanceof Error ? err.message : 'Failed to create project');
      
      setError(errorMsg);
      (window as any).toast?.show({ severity: 'error', summary: 'Lỗi', detail: errorMsg, life: 4000 });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createProject, loading, error };
}
