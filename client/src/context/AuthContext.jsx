import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, getApiErrorMessage, getApiFieldErrors } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Authenticate user on page load/refresh
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await authAPI.me();
        if (data.success) {
          setUser(data.user);
          setProfile(data.profileDetails);
        } else {
          // Token is invalid/expired
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Failed to verify token:', err.message);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.login({ email, password });
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        // Call authAPI.me() to get full profile details, location coordinates, etc.
        const userDetails = await authAPI.me();
        setUser(userDetails.user);
        setProfile(userDetails.profileDetails);
        return { success: true, role: userDetails.user.role };
      }
      throw new Error(data.message || 'Login failed');
    } catch (err) {
      const errorMessage = getApiErrorMessage(err, 'Login failed');
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        fieldErrors: getApiFieldErrors(err)
      };
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.register(userData);
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        // Call authAPI.me() to get full profile details, location coordinates, etc.
        const userDetails = await authAPI.me();
        setUser(userDetails.user);
        setProfile(userDetails.profileDetails);
        return { success: true, role: userDetails.user.role };
      }
      throw new Error(data.message || 'Registration failed');
    } catch (err) {
      const errorMessage = getApiErrorMessage(err, 'Registration failed');
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        fieldErrors: getApiFieldErrors(err)
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setProfile(null);
    setError(null);
  };

  // Manual Profile State Update (useful when student/tutor updates details inside dashboard)
  const updateLocalProfile = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  // Manual User State Update
  const updateLocalUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    profile,
    loading,
    error,
    login,
    register,
    logout,
    updateLocalProfile,
    updateLocalUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
