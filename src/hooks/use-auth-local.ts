import { useState, useEffect } from 'react';
import { User } from '@/types/dot';

const STORAGE_KEY = 'local-auth';

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    discord_id: '123456789',
    username: 'Admin',
    role: 'SUPERSTAFF',
    enterprise_id: 'default',
    is_superadmin: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    discord_id: '987654321',
    username: 'Patron',
    role: 'PATRON',
    enterprise_id: 'default',
    is_superadmin: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    discord_id: '456789123',
    username: 'Staff',
    role: 'STAFF',
    enterprise_id: 'default',
    is_superadmin: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export function useAuth() {
  const [appUser, setAppUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage
    const storedAuth = localStorage.getItem(STORAGE_KEY);
    if (storedAuth) {
      try {
        const userData = JSON.parse(storedAuth);
        setAppUser(userData);
      } catch (error) {
        console.error('Error parsing stored auth:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = (username: string) => {
    const user = mockUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (user) {
      setAppUser(user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAppUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    user: appUser ? { id: appUser.id, email: `${appUser.username}@example.com` } : null,
    session: appUser ? { user: { id: appUser.id } } : null,
    appUser,
    loading,
    login,
    logout,
    isAuthenticated: !!appUser,
    isSuperAdmin: appUser?.is_superadmin || false,
    canEdit: appUser?.role === 'SUPERSTAFF' || appUser?.is_superadmin,
    mockUsers
  };
}