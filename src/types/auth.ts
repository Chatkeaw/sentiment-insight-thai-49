export interface User {
  id: string;
  username: string;
  email: string;
  role: 'hr' | 'business_admin' | 'system_admin';
  fullName: string;
  department?: string;
  lastLogin: string;
  isActive: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  details: string;
  ipAddress?: string;
}

export const USER_ROLES = {
  hr: 'HR User',
  business_admin: 'Business Admin',
  system_admin: 'System Admin'
} as const;