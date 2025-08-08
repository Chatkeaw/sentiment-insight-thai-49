import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState, LoginCredentials } from '@/types/auth';

type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'LOAD_USER'; payload: User | null };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return { 
        user: action.payload, 
        isAuthenticated: true, 
        isLoading: false 
      };
    case 'LOGIN_FAILURE':
      return { 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      };
    case 'LOGOUT':
      return { 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      };
    case 'LOAD_USER':
      return {
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false
      };
    default:
      return state;
  }
};

interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    username: 'hr_user',
    email: 'hr@bank.com',
    role: 'hr',
    fullName: 'สมศรี ใจดี',
    department: 'ทรัพยากรบุคคล',
    lastLogin: new Date().toISOString(),
    isActive: true
  },
  {
    id: '2',
    username: 'business_admin',
    email: 'admin@bank.com',
    role: 'business_admin',
    fullName: 'สมชาย บริหาร',
    department: 'ฝ่ายธุรกิจ',
    lastLogin: new Date().toISOString(),
    isActive: true
  },
  {
    id: '3',
    username: 'system_admin',
    email: 'sysadmin@bank.com',
    role: 'system_admin',
    fullName: 'สมหมาย เทคโนโลยี',
    department: 'ฝ่ายเทคโนโลยีสารสนเทศ',
    lastLogin: new Date().toISOString(),
    isActive: true
  }
];

const rolePermissions = {
  hr: ['view_dashboard', 'export_data', 'manage_feedback', 'view_notifications'],
  business_admin: ['view_dashboard', 'export_data', 'manage_feedback', 'view_notifications', 'manage_users', 'view_logs', 'system_updates'],
  system_admin: ['view_dashboard', 'export_data', 'manage_feedback', 'view_notifications', 'manage_users', 'view_logs', 'system_updates', 'manage_ai', 'manage_integrations', 'technical_monitoring']
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'LOAD_USER', payload: user });
      } catch {
        localStorage.removeItem('user');
        dispatch({ type: 'LOAD_USER', payload: null });
      }
    } else {
      dispatch({ type: 'LOAD_USER', payload: null });
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    // Mock authentication - in real app, this would be an API call
    const user = mockUsers.find(u => 
      u.username === credentials.username && 
      credentials.password === 'password123' // Mock password
    );

    if (user) {
      const updatedUser = { ...user, lastLogin: new Date().toISOString() };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      dispatch({ type: 'LOGIN_SUCCESS', payload: updatedUser });
      return true;
    } else {
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const hasPermission = (permission: string): boolean => {
    if (!state.user) return false;
    return rolePermissions[state.user.role]?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{ state, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};