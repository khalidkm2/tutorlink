import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { notificationAPI } from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const data = await notificationAPI.getNotifications();
      if (data.success) {
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err.message);
    }
  };

  // Fetch immediately and set up polling when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      fetchNotifications().finally(() => setLoading(false));

      // Poll for notifications every 15 seconds to keep dashboard dynamic
      intervalRef.current = setInterval(fetchNotifications, 15000);
    } else {
      // Clean up on logout
      setNotifications([]);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAuthenticated]);

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      const data = await notificationAPI.markAsRead(id);
      if (data.success) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === id ? { ...notif, isRead: true } : notif
          )
        );
      }
      return { success: true };
    } catch (err) {
      console.error('Error marking notification as read:', err.message);
      return { success: false, error: err.message };
    }
  };

  // Helper to get unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
