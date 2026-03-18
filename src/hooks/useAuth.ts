/**
 * useAuth - Authentication state and methods
 * Manages user login, logout, and session
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import type { User, AuthSession } from '@/types';

const SESSION_STORAGE_KEY = 'auth_session';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signup: (email: string, password: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  googleLogin: (googleToken: string) => Promise<User>;
  logout: () => void;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore session from storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        const session: AuthSession = JSON.parse(stored);
        // Check if token is still valid
        if (new Date(session.expiresAt) > new Date()) {
          setUser(session.user);
        } else {
          localStorage.removeItem(SESSION_STORAGE_KEY);
        }
      }
    } catch (err) {
      // Ignore storage errors
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, []);

  const handleAuthResponse = useCallback((data: any) => {
    if (data.user && data.token) {
      const session: AuthSession = {
        user: data.user,
        token: data.token,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      setUser(data.user);
      return data.user;
    }
    throw new Error('Invalid auth response');
  }, []);

  const signup = useCallback(
    async (email: string, password: string): Promise<User> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Signup failed');
        }

        const data = await response.json();
        return handleAuthResponse(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Signup failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [handleAuthResponse]
  );

  const login = useCallback(
    async (email: string, password: string): Promise<User> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Login failed');
        }

        const data = await response.json();
        return handleAuthResponse(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [handleAuthResponse]
  );

  const googleLogin = useCallback(
    async (googleToken: string): Promise<User> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ googleToken }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Google login failed');
        }

        const data = await response.json();
        return handleAuthResponse(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Google login failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [handleAuthResponse]
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    // Optionally call backend logout endpoint
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {
      // Ignore errors
    });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    signup,
    login,
    googleLogin,
    logout,
    clearError,
  };
}
