import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (displayName: string, imageRetention: 'keep_thumbnail' | 'delete_immediately') => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user from localStorage (in real app, this would be from backend)
    const storedUser = localStorage.getItem('clearshot_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signup = async (email: string, password: string) => {
    // TODO: Connect to Lovable Cloud auth
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      image_retention: 'keep_thumbnail',
      created_at: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem('clearshot_user', JSON.stringify(newUser));
  };

  const login = async (email: string, password: string) => {
    // TODO: Connect to Lovable Cloud auth
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      image_retention: 'keep_thumbnail',
      created_at: new Date().toISOString(),
    };
    setUser(mockUser);
    localStorage.setItem('clearshot_user', JSON.stringify(mockUser));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('clearshot_user');
  };

  const updateProfile = async (displayName: string, imageRetention: 'keep_thumbnail' | 'delete_immediately') => {
    if (user) {
      const updated = { ...user, display_name: displayName, image_retention: imageRetention };
      setUser(updated);
      localStorage.setItem('clearshot_user', JSON.stringify(updated));
    }
  };

  const deleteAccount = async () => {
    setUser(null);
    localStorage.removeItem('clearshot_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, updateProfile, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
