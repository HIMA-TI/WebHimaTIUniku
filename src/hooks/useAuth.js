import { useState, useCallback } from 'react';
import { API_BASE } from '../config/api';

const AUTH_KEY = 'himati_auth';

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(AUTH_KEY) !== null
  );

  const login = useCallback(async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        const token =
          data?.data?.token ||
          data?.token ||
          data?.data?.accessToken ||
          data?.accessToken ||
          data?.data?.access_token ||
          data?.access_token;

        if (!token) {
          return { success: false, error: 'Login berhasil, tapi token tidak ditemukan' };
        }

        sessionStorage.setItem(AUTH_KEY, token);
        setIsAuthenticated(true);
        return { success: true };
      }

      return { success: false, error: data.message || 'Email atau password salah' };
    } catch {
      return { success: false, error: 'Gagal menghubungi server' };
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout };
}
