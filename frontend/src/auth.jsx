import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from './api';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [me, setMe] = useState(() => {
    const raw = localStorage.getItem('me');
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('me', JSON.stringify(data.me));
    setToken(data.token);
    setMe(data.me);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('me');
    setToken(null);
    setMe(null);
  };

  const value = useMemo(() => ({ me, token, login, logout }), [me, token]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
