import { apiClient } from '@/lib/api-client';
import type { 
  CreateProjectDto, 
  UpdateProjectDto, 
  ProjectDto, 
  PaginatedResponse 
} from '@/types/project';

// API Response wrapper - matches api-client.ts
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[] | Record<string, string[]> | null;
}

// Project service
export const projectService = {
  // Create new project (POST /api/Project)
  async createProject(data: CreateProjectDto): Promise<ApiResponse<number>> {
    return await apiClient.post<number>('/Project', data);
  },

  // Get all projects with pagination (GET /api/Project?pageNumber=1&pageSize=10)
  async getProjects(
    pageNumber: number = 1,
    pageSize: number = 10,
    search?: string
  ): Promise<PaginatedResponse<ProjectDto>> {
    let url = `/Project?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    if (search && search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    const response: any = await apiClient.get<any>(url);
    
    // API trả về: { success, message, data: [...], pageNumber, pageSize, totalPages, totalRecords }
    if (response.success && response.data) {
      return {
        data: response.data,
        pageNumber: response.pageNumber || pageNumber,
        pageSize: response.pageSize || pageSize,
        totalPages: response.totalPages || 1,
        totalCount: response.totalRecords || 0,
        hasPreviousPage: (response.pageNumber || pageNumber) > 1,
        hasNextPage: (response.pageNumber || pageNumber) < (response.totalPages || 1)
      };
    }
    
    throw new Error(response.message || 'Failed to fetch projects');
  },

  // Get single project by ID (GET /api/Project/{id})
  async getProject(projectId: number): Promise<ApiResponse<ProjectDto>> {
    return await apiClient.get<ProjectDto>(`/Project/${projectId}`);
  },

  // Update project (PUT /api/Project/{id})
  async updateProject(projectId: number, data: UpdateProjectDto): Promise<ApiResponse<null>> {
    if (projectId !== data.id) {
      throw new Error('Project ID mismatch');
    }
    return await apiClient.put<null>(`/Project/${projectId}`, data);
  },

  // Delete project (DELETE /api/Project/{id})
  async deleteProject(projectId: number): Promise<ApiResponse<null>> {
    return await apiClient.delete<null>(`/Project/${projectId}`);
  }
};
