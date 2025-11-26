import { apiClient } from '@/lib/api-client';
import {
  UserProfile,
  UpdateUserProfileDto,
  ChangePasswordDto,
  SearchUserDto
} from '@/types/user';

// API Response wrapper
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// User service
export const userService = {
  // Get user profile by ID (GET /api/User/{id})
  async getUserProfile(userId: number): Promise<ApiResponse<UserProfile>> {
    return await apiClient.get<UserProfile>(`/User/${userId}`);
  },

  // Update current user profile (PUT /api/User/profile)
  async updateProfile(data: UpdateUserProfileDto): Promise<ApiResponse<UserProfile>> {
    return await apiClient.put<UserProfile>('/User/profile', data);
  },

  // Change password (PUT /api/User/password)
  async changePassword(data: ChangePasswordDto): Promise<ApiResponse<null>> {
    return await apiClient.put<null>('/User/password', data);
  },

  // Search users (GET /api/User/search)
  async searchUsers(query?: string, limit: number = 10): Promise<ApiResponse<SearchUserDto[]>> {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    params.set('limit', Math.min(limit, 50).toString());
    
    const url = `/User/search${params.toString() ? '?' + params.toString() : ''}`;
    return await apiClient.get<SearchUserDto[]>(url);
  }
};
