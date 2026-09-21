'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, authStorage } from '@/services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register'

  // Initialize auth on client mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedUser = authStorage.getUser();
        const token = authStorage.getToken();

        if (savedUser && token) {
          setUser(savedUser);
          // Verify with backend
          const verifiedUser = await api.getMe();
          if (verifiedUser) {
            setUser(verifiedUser);
          } else {
            setUser(null);
          }
        }
      } catch (err) {
        console.warn('Auth init failed:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.user) {
      setUser(res.user);
    }
    return res;
  };

  const register = async (name, email, password) => {
    const res = await api.register({ name, email, password });
    if (res.user) {
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        authModalOpen,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        closeAuthModal,
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
