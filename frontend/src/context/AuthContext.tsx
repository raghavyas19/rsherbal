import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminLogout } from '../services/api';

interface User {
  id: string;
  mobile: string;
  name?: string;
  gender?: string;
  dob?: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('ayur_user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem('ayur_user', JSON.stringify(user));
  };

  const logout = () => {
    // If admin, also notify backend to clear auth cookies
    if (user && user.role === 'admin') {
      try {
        adminLogout();
      } catch (e) {
        // ignore
      }
    }
    setUser(null);
    localStorage.removeItem('ayur_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}; 