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
