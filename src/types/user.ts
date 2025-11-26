export interface User {
  id: string;
  fullName: string;
  avatar: string;
  email: string;
}

export interface Manager {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  gender?: string;
  address?: string;
  image?: string;
  status?: 'active' | 'inactive' | string;
}

// User Profile (from GET /api/User/{id})
export interface UserProfile {
  id: number;
  email: string;
  username: string;
  fullName: string;
  gender: string | null;
  phone: string | null;
  address: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

// Update User Profile DTO (PUT /api/User/profile)
export interface UpdateUserProfileDto {
  fullName?: string;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  address?: string;
  bio?: string;
  avatarUrl?: string;
}

// Change Password DTO (PUT /api/User/password)
export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Search User DTO (GET /api/User/search)
export interface SearchUserDto {
  id: number;
  email: string;
  fullName: string;
  avatarUrl: string | null;
}
