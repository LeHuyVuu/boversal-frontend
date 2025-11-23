import axios from '@/lib/axios-config';

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

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface UserResponse {
  userId: number;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role?: string;
}

// Auth service
export const authService = {
  // Login
  async login(data: LoginRequest): Promise<ApiResponse<UserResponse>> {
    const response = await axios.post<ApiResponse<UserResponse>>('/api/Auth/login', data);
    return response.data;
  },

  // Register
  async register(data: RegisterRequest): Promise<ApiResponse<UserResponse>> {
    const response = await axios.post<ApiResponse<UserResponse>>('/api/Auth/register', data);
    return response.data;
  },

  // Get current user
  async getMe(): Promise<ApiResponse<UserResponse>> {
    const response = await axios.get<ApiResponse<UserResponse>>('/api/Auth/me');
    return response.data;
  },

  // Logout
  async logout(): Promise<ApiResponse<null>> {
    const response = await axios.post<ApiResponse<null>>('/api/Auth/logout');
    return response.data;
  }
};
