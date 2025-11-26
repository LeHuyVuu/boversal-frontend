export type ProjectStatus = 'active' | 'archived' | 'completed' | 'inactive';

// Create Project DTO
export interface CreateProjectDto {
  ownerId: number;
  name: string;
  demoUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  shortIntro?: string | null;
  highlight?: string | null;
  description?: string | null;
}

// Update Project DTO
export interface UpdateProjectDto {
  id: number;
  ownerId: number;
  name: string;
  demoUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  shortIntro?: string | null;
  highlight?: string | null;
  description?: string | null;
}

// Project Detail
export interface ProjectDto {
  id: number;
  name: string;
  demoUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  shortIntro?: string | null;
  highlight?: string | null;
  description?: string | null;
  status: string;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}

// Paginated Response
export interface PaginatedResponse<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// Legacy types (for backward compatibility)
export type Project = {
  id: number;
  ownerId: number;
  name: string;
  demoUrl: string | null;
  startDate: string;
  endDate: string | null;
  shortIntro: string;
  highlight: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
};

export type ProjectListResponse = Project[];
