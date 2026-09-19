import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { useLocalStorage } from '../hooks/index.js';
import { STORAGE_KEYS } from '../config/constants.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage(STORAGE_KEYS.USER, null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) { setLoading(false); return; }
    api.get('/api/auth/me').then(({ data }) => {
      setUser(data);
    }).catch(() => {
      setUser(null);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }).finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
    setUser(data.user);
    return data.user;
  };

  const signup = async (name, email, password) => {
    await api.post('/api/auth/signup', { name, email, password });
    return login(email, password);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, signup, logout, isAdmin: user?.role === 'admin' }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
