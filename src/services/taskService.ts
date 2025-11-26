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

// Task types
export interface Task {
  id: number;
  taskId?: number;
  title: string;
  taskName?: string;
  description?: string;
  projectId: number;
  projectName?: string;
  statusId: number;
  statusName?: string;
  statusColor?: string;
  priority: string;
  priorityId?: number;
  priorityName?: string;
  orderIndex: number;
  dueDate?: string;
  createdBy: number;
  createdByName?: string;
  createdAt: string;
  updatedAt?: string;
  assignees?: Array<{
    userId: number;
    fullName: string;
    email: string;
    avatarUrl?: string;
  }>;
  assignedTo?: {
    userId: number;
    fullName: string;
    email: string;
  };
}

export interface CreateTaskRequest {
  projectId: number;
  statusId?: number;
  title: string;
  description?: string;
  priority: string;
  dueDate?: string;
  orderIndex: number;
  assigneeIds: number[];
}

// Full update DTO for PUT /api/Task/{id}
export interface UpdateTaskDto {
  id: number;
  projectId: number;
  statusId: number | null;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string | null;
  orderIndex: number;
  assigneeIds: number[];
}

export interface UpdateTaskRequest {
  taskName?: string;
  description?: string;
  assigneeId?: number;
  statusId?: number;
  priorityId?: number;
  dueDate?: string;
}

export interface PatchTaskRequest {
  statusId?: number;
  orderIndex?: number;
}

// Task service
export const taskService = {
  // Get all tasks with filters
  async getTasks(
    pageNumber: number = 1,
    pageSize: number = 50,
    projectId?: number,
    statusId?: number,
    assigneeId?: number
  ): Promise<ApiResponse<Task[]>> {
    // If projectId is provided, use project-specific endpoint
    if (projectId) {
      let url = `/Task/project/${projectId}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
      if (statusId) url += `&statusId=${statusId}`;
      if (assigneeId) url += `&assigneeId=${assigneeId}`;
      return await apiClient.get<Task[]>(url);
    }
    
    // Otherwise use general endpoint
    let url = `/Task?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    if (statusId) url += `&statusId=${statusId}`;
    if (assigneeId) url += `&assigneeId=${assigneeId}`;
    
    return await apiClient.get<Task[]>(url);
  },

  // Get my tasks
  async getMyTasks(
    pageNumber: number = 1,
    pageSize: number = 50
  ): Promise<ApiResponse<Task[]>> {
    return await apiClient.get<Task[]>(`/Task/my-tasks?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  },

  // Get single task by ID
  async getTask(taskId: number): Promise<ApiResponse<Task>> {
    return await apiClient.get<Task>(`/Task/${taskId}`);
  },

  // Create new task
  async createTask(data: CreateTaskRequest): Promise<ApiResponse<Task>> {
    return await apiClient.post<Task>('/Task', data);
  },

  // Update task (partial update - legacy)
  async updateTask(taskId: number, data: UpdateTaskRequest): Promise<ApiResponse<Task>> {
    return await apiClient.put<Task>(`/Task/${taskId}`, data);
  },

  // Update task (full update - PUT /api/Task/{id})
  async updateTaskFull(taskId: number, data: UpdateTaskDto): Promise<ApiResponse<null>> {
    // Validation: ID must match
    if (taskId !== data.id) {
      throw new Error('Task ID in URL must match ID in body');
    }
    return await apiClient.put<null>(`/Task/${taskId}`, data);
  },

  // Patch task (for Kanban drag & drop)
  async patchTask(taskId: number, data: PatchTaskRequest): Promise<ApiResponse<Task>> {
    return await apiClient.patch<Task>(`/Task/${taskId}`, {
      id: taskId,
      ...data
    });
  },

  // Delete task
  async deleteTask(taskId: number): Promise<ApiResponse<null>> {
    return await apiClient.delete<null>(`/Task/${taskId}`);
  }
};
