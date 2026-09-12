import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('goeato_user')) || null; } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('goeato_token');
    if (!token) { setLoading(false); return; }
    api.get('/api/auth/me').then(({ data }) => {
      setUser(data);
      localStorage.setItem('goeato_user', JSON.stringify(data));
    }).catch(() => {
      setUser(null);
      localStorage.removeItem('goeato_token');
      localStorage.removeItem('goeato_user');
    }).finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('goeato_token', data.token);
    localStorage.setItem('goeato_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const signup = async (name, email, password) => {
    await api.post('/api/auth/signup', { name, email, password });
    return login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('goeato_token');
    localStorage.removeItem('goeato_user');
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
