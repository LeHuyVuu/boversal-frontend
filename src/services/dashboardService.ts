import { apiClient } from '@/lib/api-client';

// Dashboard Stats
export interface DashboardStats {
  totalTasks: number;
  activeProjects: number;
  openIssues: number;
  teamMembers: number;
  taskChangeVsLastMonth: number;
  projectChangeVsLastMonth: number;
  issueChangeVsLastMonth: number;
}

// Recent Task
export interface RecentTask {
  id: number;
  title: string;
  projectCode: string;
  statusName: string;
  priority: string;
  dueDate: string;
  createdAt: string;
}

// Active Project
export interface ActiveProject {
  id: number;
  name: string;
  code: string;
  description: string;
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
}

// Monthly Completion Data
export interface MonthlyCompletion {
  month: string;
  year: number;
  createdTasks: number;
  completedTasks: number;
  completionRate: number;
}

// Tasks by Priority
export interface TasksByPriority {
  low: number;
  medium: number;
  high: number;
  emergency: number;
}

// Tasks by Status
export interface TasksByStatus {
  statusName: string;
  count: number;
  percentage: number;
}

// Completion Rate
export interface CompletionRate {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  completionPercentage: number;
  averageDaysToComplete: number;
}

// Productivity Chart
export interface ProductivityChart {
  monthlyCompletion: MonthlyCompletion[];
  tasksByPriority: TasksByPriority;
  tasksByStatus: TasksByStatus[];
  completionRate: CompletionRate;
}

// Dashboard Response
export interface DashboardData {
  stats: DashboardStats;
  recentTasks: RecentTask[];
  activeProjects: ActiveProject[];
  productivityChart: ProductivityChart;
}

// API Response wrapper
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Dashboard service
export const dashboardService = {
  // Get dashboard data
  async getDashboard(): Promise<ApiResponse<DashboardData>> {
    return await apiClient.get<DashboardData>('/Dashboard');
  }
};
