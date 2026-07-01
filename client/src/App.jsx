import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';

// Layouts & Pages
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import TutorDashboard from './pages/TutorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SearchTutors from './pages/SearchTutors';
import Bookings from './pages/Bookings';

// Page not found fallback
function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-extrabold text-indigo-500 mb-4">404</h1>
      <p className="text-xl text-slate-400 mb-6">Page Not Found</p>
      <a href="/" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
        Go Home
      </a>
    </div>
  );
}

// Protected Route Guard
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-indigo-500 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect unauthorized roles back to their respective landing dashboards
    if (user?.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    if (user?.role === 'tutor') return <Navigate to="/tutor-dashboard" replace />;
    return <Navigate to="/student-dashboard" replace />;
  }

  return children;
}

// Public Route Guard (prevents logged in users from visiting Login/Register)
function PublicRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-indigo-500 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    if (user?.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    if (user?.role === 'tutor') return <Navigate to="/tutor-dashboard" replace />;
    return <Navigate to="/student-dashboard" replace />;
  }

  return children;
}

// Helper component to resolve root redirect dynamically
function RootRedirect() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-indigo-500 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    if (user?.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    if (user?.role === 'tutor') return <Navigate to="/tutor-dashboard" replace />;
    return <Navigate to="/student-dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes protected from logged-in users */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Unified Dashboard Redirect */}
        <Route path="/dashboard" element={<RootRedirect />} />

        {/* Role-Specific Protected Dashboards wrapped in DashboardLayout */}
        <Route element={<DashboardLayout />}>
          {/* Student Routes */}
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          {/* Student Nested Sub-routes */}
          <Route
            path="/student-dashboard/search"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <SearchTutors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-dashboard/bookings"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Bookings />
              </ProtectedRoute>
            }
          />

          {/* Tutor Routes */}
          <Route
            path="/tutor-dashboard"
            element={
              <ProtectedRoute allowedRoles={['tutor']}>
                <TutorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tutor-dashboard/schedule"
            element={
              <ProtectedRoute allowedRoles={['tutor']}>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                  <h2 className="text-xl font-bold mb-2">Availability Schedule Planner</h2>
                  <p className="text-slate-400 text-sm">Manage slot times and days of the week.</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tutor-dashboard/requests"
            element={
              <ProtectedRoute allowedRoles={['tutor']}>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                  <h2 className="text-xl font-bold mb-2">Tuition Request Review</h2>
                  <p className="text-slate-400 text-sm">Approve or reject booking requests from students.</p>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard/pending"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                  <h2 className="text-xl font-bold mb-2">Pending Tutors Queue</h2>
                  <p className="text-slate-400 text-sm">Approve certificates and activate tutor profiles.</p>
                </div>
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}