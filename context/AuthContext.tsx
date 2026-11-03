'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: {
    name: string;
    phone: string;
    password: string;
    role: 'farmer' | 'buyer';
    district?: string;
    coordinates?: { lat: number; lng: number };
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Hydrate user and token from localStorage
    const savedToken = localStorage.getItem('km_token');
    const savedUser = localStorage.getItem('km_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Error parsing stored user data:', err);
      }
    }
    setLoading(false);
  }, []);

  const login = async (phone: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || 'Login failed' };
      }

      const userData: User = data.data;
      setUser(userData);
      setToken(userData.token || null);

      if (userData.token) {
        localStorage.setItem('km_token', userData.token);
      }
      localStorage.setItem('km_user', JSON.stringify(userData));

      // Route according to role
      if (userData.role === 'farmer') {
        router.push('/farmer');
      } else {
        router.push('/buyer');
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error' };
    }
  };

  const register = async (userDataInput: any) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userDataInput),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || 'Registration failed' };
      }

      const registeredUser: User = data.data;
      setUser(registeredUser);
      setToken(registeredUser.token || null);

      if (registeredUser.token) {
        localStorage.setItem('km_token', registeredUser.token);
      }
      localStorage.setItem('km_user', JSON.stringify(registeredUser));

      if (registeredUser.role === 'farmer') {
        router.push('/farmer');
      } else {
        router.push('/buyer');
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('km_token');
    localStorage.removeItem('km_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

