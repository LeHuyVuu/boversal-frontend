import { apiClient } from '@/lib/api-client';

// API Response wrapper
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pageNumber?: number;
  pageSize?: number;
  totalPages?: number;
  totalRecords?: number;
}

// Project types
export interface Project {
  id: number;
  projectId?: number;
  name: string;
  projectName?: string;
  ownerId: number;
  description: string;
  shortIntro?: string;
  highlight?: string;
  demoUrl?: string;
  startDate: string;
  endDate?: string;
  status: string;
  statusId?: number;
  statusName?: string;
  createdBy?: number;
  createdAt: string;
  updatedAt?: string;
  memberCount?: number;
  taskCount?: number;
  progress?: number;
  managerId?: {
    fullName: string;
    email?: string;
    phone?: string;
  };
}

export interface CreateProjectRequest {
  projectName: string;
  description: string;
  startDate: string;
  endDate?: string;
  statusId?: number;
}

export interface UpdateProjectRequest {
  projectName?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  statusId?: number;
}

// Project service
export const projectService = {
  // Get all projects with pagination
  async getProjects(
    pageNumber: number = 1,
    pageSize: number = 10,
    search?: string
  ): Promise<ApiResponse<Project[]>> {
    let url = `/Project?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    
    return await apiClient.get<Project[]>(url);
  },

  // Get single project by ID
  async getProject(projectId: number): Promise<ApiResponse<Project>> {
    return await apiClient.get<Project>(`/Project/${projectId}`);
  },

  // Create new project
  async createProject(data: CreateProjectRequest): Promise<ApiResponse<Project>> {
    return await apiClient.post<Project>('/Project', data);
  },

  // Update project
  async updateProject(projectId: number, data: UpdateProjectRequest): Promise<ApiResponse<Project>> {
    return await apiClient.put<Project>(`/Project/${projectId}`, data);
  },

  // Delete project
  async deleteProject(projectId: number): Promise<ApiResponse<null>> {
    return await apiClient.delete<null>(`/Project/${projectId}`);
  }
};
