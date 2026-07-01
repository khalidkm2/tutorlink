import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { user, profile } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-violet-950 rounded-2xl p-6 md:p-8 border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Hello, {user?.name}!
        </h1>
        <p className="text-slate-300 max-w-xl text-sm sm:text-base leading-relaxed">
          Welcome to your Student Dashboard. Use the search panel to get smart tutor recommendations sorted by distance and compatibility algorithms.
        </p>
      </div>

      {/* Profile Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="font-semibold text-slate-200 mb-4 flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 text-indigo-400" />
            <span>Academic Profile</span>
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500">Grade Level:</span>
              <span className="font-medium text-slate-300">{profile?.classGrade || 'Not set'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500">School / Institution:</span>
              <span className="font-medium text-slate-300">{profile?.schoolName || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Account Type:</span>
              <span className="font-bold text-indigo-400 capitalize">{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Location Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="font-semibold text-slate-200 mb-4 flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-indigo-400" />
            <span>Your Geolocation</span>
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500">Street Address:</span>
              <span className="font-medium text-slate-300 truncate max-w-[150px]">{user?.address || 'Not set'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500">Longitude:</span>
              <span className="font-medium text-slate-300">{user?.location?.coordinates?.[0] || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Latitude:</span>
              <span className="font-medium text-slate-300">{user?.location?.coordinates?.[1] || 'Not set'}</span>
            </div>
          </div>
        </div>

        {/* Recommendations Quick Action */}
        <div className="bg-indigo-950/20 border border-indigo-900/30 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-indigo-300 mb-2 flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Smart Recommendation</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Enter your budget, subjects, and availability to run our 3-stage recommendation matching algorithm.
            </p>
          </div>
          <Link
            to="/student-dashboard/search"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-center py-2.5 rounded-xl font-semibold text-sm transition-all duration-200"
          >
            Find a Tutor
          </Link>
        </div>
      </div>

      {/* Mock Booking Info Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="font-semibold text-slate-200 mb-4 flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-indigo-400" />
          <span>Active Tuition Bookings</span>
        </h3>
        <div className="text-center py-8 text-slate-500 text-sm">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-slate-600" />
          <span>You don't have any active booking requests at the moment.</span>
        </div>
      </div>
    </div>
  );
}
