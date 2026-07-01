import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  BookOpen,
  LogOut,
  Bell,
  User,
  Search,
  Grid,
  Calendar,
  ClipboardList,
  ShieldCheck,
  CheckCircle,
  FileText,
  Menu,
  X,
  MapPin
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Sidebar link generation depending on user role
  const getSidebarLinks = () => {
    if (user?.role === 'student') {
      return [
        { label: 'Dashboard', path: '/student-dashboard', icon: Grid },
        { label: 'Search & Match', path: '/student-dashboard/search', icon: Search },
        { label: 'My Bookings', path: '/student-dashboard/bookings', icon: ClipboardList },
      ];
    } else if (user?.role === 'tutor') {
      return [
        { label: 'Tutor Panel', path: '/tutor-dashboard', icon: Grid },
        { label: 'Schedule & Slots', path: '/tutor-dashboard/schedule', icon: Calendar },
        { label: 'Tuition Requests', path: '/tutor-dashboard/requests', icon: ClipboardList },
      ];
    } else if (user?.role === 'admin') {
      return [
        { label: 'Overview', path: '/admin-dashboard', icon: Grid },
        { label: 'Pending Tutors', path: '/admin-dashboard/pending', icon: ShieldCheck },
      ];
    }
    return [];
  };

  const links = getSidebarLinks();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                TutorLink
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white relative transition-colors"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-slate-900 leading-none">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotifDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                      <span className="font-semibold text-sm">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-xs text-indigo-400 font-medium">
                          {unreadCount} unread
                        </span>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-800">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-500">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif._id}
                            className={`p-3 text-xs transition-colors hover:bg-slate-800/40 ${
                              !notif.isRead ? 'bg-indigo-600/5' : ''
                            }`}
                          >
                            <p className="text-slate-300 font-medium mb-1">{notif.message}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-[10px] text-slate-500">
                                {new Date(notif.createdAt).toLocaleDateString()}
                              </span>
                              {!notif.isRead && (
                                <button
                                  onClick={() => markAsRead(notif._id)}
                                  className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline text-[10px]"
                                >
                                  Mark read
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Brief */}
            <div className="hidden sm:flex items-center space-x-3 border-l border-slate-800 pl-4">
              <div className="bg-slate-800 text-slate-300 p-2 rounded-full">
                <User className="h-4 w-4" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold leading-none">{user?.name}</p>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                  {user?.role}
                </span>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-grow relative">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 border-r border-slate-800 bg-slate-900/50 flex-shrink-0">
          <div className="p-4 flex flex-col h-full justify-between">
            <nav className="space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-300'
                        : 'text-slate-400 hover:bg-slate-800/40 hover:text-white border border-transparent'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Account Status Badge */}
            {user?.role === 'tutor' && (
              <div className="mt-8 p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className={`h-4 w-4 ${user.isApproved ? 'text-emerald-500' : 'text-amber-500'}`} />
                  <span className="font-semibold text-slate-300">Account Status</span>
                </div>
                <p className="text-slate-500">
                  {user.isApproved
                    ? 'Your tutor profile is fully verified and matches search criteria.'
                    : 'Awaiting admin review. You will be matched once approved.'}
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-slate-950/80 z-30 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 z-30 p-4 flex flex-col justify-between lg:hidden transition-transform">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">Menu</span>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className="h-5 w-5 text-slate-400 hover:text-white" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-300'
                            : 'text-slate-400 hover:bg-slate-800/40 hover:text-white border border-transparent'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* User profile brief bottom */}
              <div className="p-3 bg-slate-950 rounded-xl flex items-center space-x-3 border border-slate-800">
                <div className="bg-slate-800 text-slate-300 p-2 rounded-full">
                  <User className="h-4 w-4" />
                </div>
                <div className="text-left overflow-hidden">
                  <p className="text-sm font-semibold truncate leading-none">{user?.name}</p>
                  <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                    {user?.role}
                  </span>
                </div>
              </div>
            </aside>
          </>
        )}

        {/* Content View */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
