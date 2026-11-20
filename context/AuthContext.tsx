'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { API_BASE } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (phoneOrEmail: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: {
    name: string;
    phone: string;
    password: string;
    role: 'farmer' | 'buyer';
    email?: string;
    district?: string;
    coordinates?: { lat: number; lng: number };
    farmerProfile?: any;
    buyerProfile?: any;
  }) => Promise<{ success: boolean; message?: string; mockOtp?: string }>;
  verifyOtp: (phone: string, otp: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('km_token');
    const savedUser = localStorage.getItem('km_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Error restoring session:', err);
      }
    }
    setLoading(false);
  }, []);

  const login = async (phoneOrEmail: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: phoneOrEmail, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.error?.message || data.message || 'Login failed' };
      }

      const userData: User = data.data.user || data.data;
      const authToken: string = data.data.token;
      const refreshToken: string = data.data.refreshToken;

      setUser(userData);
      setToken(authToken);

      localStorage.setItem('km_token', authToken);
      if (refreshToken) localStorage.setItem('km_refresh_token', refreshToken);
      localStorage.setItem('km_user', JSON.stringify(userData));

      // Role-based routing
      if (userData.role === 'farmer') {
        router.push('/farmer');
      } else if (userData.role === 'buyer') {
        router.push('/buyer');
      } else if (userData.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
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
      if (!res.ok || !data.success) {
        return { success: false, message: data.error?.message || data.message || 'Registration failed' };
      }

      const registeredUser: User = data.data.user || data.data;
      const authToken: string = data.data.token;
      const refreshToken: string = data.data.refreshToken;

      setUser(registeredUser);
      setToken(authToken);

      localStorage.setItem('km_token', authToken);
      if (refreshToken) localStorage.setItem('km_refresh_token', refreshToken);
      localStorage.setItem('km_user', JSON.stringify(registeredUser));

      return {
        success: true,
        mockOtp: data.data.mockVerificationOtp,
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error' };
    }
  };

  const verifyOtp = async (phone: string, otp: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.error?.message || data.message || 'Verification failed' };
      }

      if (user) {
        const updated = { ...user, isVerified: true };
        setUser(updated);
        localStorage.setItem('km_user', JSON.stringify(updated));
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error' };
    }
  };

  const logout = () => {
    if (token) {
      fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('km_token');
    localStorage.removeItem('km_refresh_token');
    localStorage.removeItem('km_user');
    router.push('/login');
  };

  const updateUser = (updatedUser: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const merged = { ...prev, ...updatedUser };
      localStorage.setItem('km_user', JSON.stringify(merged));
      return merged;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, verifyOtp, logout, updateUser }}>
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
