"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface User {
  id: number;
  username: string;
  balance: number;
  leverage: number;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch user profile if token exists
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      fetchUserProfile(token);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      if (!res.ok) throw new Error('Failed to fetch user profile');

      const data = await res.json();

      
      const { password, ...userData } = data;

      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error(error);
      setUser(null);
      setIsAuthenticated(false);
      Cookies.remove('token');
    }
  };
const logout = async () => {
  try {
    console.log('Calling logout API...');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/cookie/logout`, { method: 'POST' });
    console.log('Logout API response:', res.status);
  } catch (err) {
    console.error('Logout failed:', err);
  } finally {
    setUser(null);
    setIsAuthenticated(false);
    Cookies.remove('token', { path: '/' });
    console.log('Removed token cookie on client');
  }
};
  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
