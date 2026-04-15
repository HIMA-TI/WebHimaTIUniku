import { useState, useCallback } from 'react';

const AUTH_KEY = 'himati_auth';
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(AUTH_KEY) !== null
  );

  const login = useCallback(async (username, password) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password })
      });
      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem(AUTH_KEY, data.data.token || 'true');
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: data.message || 'Username atau password salah' };
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
