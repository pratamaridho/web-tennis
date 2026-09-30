'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type UserRole = 'PENGUNJUNG' | 'MEMBER' | 'ADMIN_KOMUNITAS' | 'ADMIN_WEB';

export interface UserProfile {
  id: string;
  nama: string;
  email: string;
  role: UserRole;
  aktif: boolean;
  avatarUrl?: string | null;
  phone?: string | null;
  club?: string | null;
  ntrpRating?: string | null;
  racket?: string | null;
  hand?: string | null;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  setAuthModalMode: (mode: 'login' | 'register') => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { nama: string; email: string; password: string; confirmPassword?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchDemoRole: (targetRole: UserRole) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    async function initUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (active) setUser(data.user || null);
        } else if (active) {
          setUser(null);
        }
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setIsLoading(false);
      }
    }
    initUser();
    return () => {
      active = false;
    };
  }, []);

  const role: UserRole = user?.role || 'PENGUNJUNG';

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Gagal masuk' };
      }

      setUser(data.user);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch {
      return { success: false, error: 'Koneksi bermasalah saat login' };
    }
  };

  const register = async (formData: { nama: string; email: string; password: string; confirmPassword?: string }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Pendaftaran gagal' };
      }

      setUser(data.user);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch {
      return { success: false, error: 'Koneksi bermasalah saat mendaftar' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      setUser(null);
    }
  };

  const switchDemoRole = async (targetRole: UserRole) => {
    if (targetRole === 'PENGUNJUNG') {
      await logout();
      return;
    }

    const demoCredentials: Record<Exclude<UserRole, 'PENGUNJUNG'>, { email: string; password: string }> = {
      ADMIN_WEB: { email: 'adminweb@tennisclub.com', password: 'admin123' },
      ADMIN_KOMUNITAS: { email: 'komunitas@tennisclub.com', password: 'admin123' },
      MEMBER: { email: 'alex@tennisclub.com', password: 'admin123' },
    };

    const creds = demoCredentials[targetRole];
    if (creds) {
      await login(creds.email, creds.password);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
        login,
        register,
        logout,
        switchDemoRole,
        refreshUser,
      }}
    >
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
