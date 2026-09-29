import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('alzaban_token') || null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.warn('Session expired or invalid token');
        localStorage.removeItem('alzaban_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('alzaban_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        showToast(`Welcome back, ${res.data.user.name}!`, 'success');
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      if (res.data.success) {
        localStorage.setItem('alzaban_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        showToast('Account registered successfully!', 'success');
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('alzaban_token');
    setToken(null);
    setUser(null);
    showToast('You have been logged out.', 'info');
  };

  const updateProfile = async (data) => {
    try {
      const res = await api.put('/auth/profile', data);
      if (res.data.success) {
        setUser(res.data.user);
        showToast('Profile updated successfully!', 'success');
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not update profile.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
