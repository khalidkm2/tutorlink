import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, MapPin, Calendar, ClipboardCheck, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TutorDashboard() {
  const { user, profile } = useAuth();

  return (
    <div className="space-y-6">
      {/* Pending Account Alert */}
      {!user?.isApproved && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-2xl flex items-start space-x-3 text-sm">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Profile Pending Verification: </span>
            Your account is currently waiting for administrator approval. Once approved, your profile will join the dynamic K-Means match cluster and receive student booking requests.
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-violet-900 to-indigo-950 rounded-2xl p-6 md:p-8 border border-violet-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Tutor Panel: Welcome, {user?.name}!
        </h1>
        <p className="text-slate-300 max-w-xl text-sm sm:text-base leading-relaxed">
          Manage your student matching availability, respond to tuition requests, and organize your academic profile here.
        </p>
      </div>

      {/* Profile Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="font-semibold text-slate-200 mb-4 flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-violet-400" />
            <span>Tutor Qualifications</span>
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500">Hourly Fee:</span>
              <span className="font-semibold text-emerald-400">${profile?.hourlyFee}/hr</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500">Teaching Experience:</span>
              <span className="font-medium text-slate-300">{profile?.experience} Years</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500">Avg Rating:</span>
              <span className="font-medium text-amber-400">★ {profile?.averageRating || 'Unrated'}</span>
            </div>
          </div>
        </div>

        {/* subjects and classes Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="font-semibold text-slate-200 mb-4 flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-violet-400" />
            <span>Academic Focus</span>
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500">Subjects:</span>
              <span className="font-medium text-slate-300 truncate max-w-[150px]" title={profile?.subjects?.join(', ')}>
                {profile?.subjects?.join(', ') || 'None'}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-500">Classes:</span>
              <span className="font-medium text-slate-300 truncate max-w-[150px]" title={profile?.classes?.join(', ')}>
                {profile?.classes?.join(', ') || 'None'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Address:</span>
              <span className="font-medium text-slate-300 truncate max-w-[150px]" title={user?.address}>
                {user?.address || 'None'}
              </span>
            </div>
          </div>
        </div>

        {/* Schedule Quick Action */}
        <div className="bg-violet-950/20 border border-violet-900/30 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-violet-300 mb-2 flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Availability Scheduler</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Configure your daily time slots and days of availability so students can select compatible slots.
            </p>
          </div>
          <Link
            to="/tutor-dashboard/schedule"
            className="w-full bg-violet-600 hover:bg-violet-500 text-white text-center py-2.5 rounded-xl font-semibold text-sm transition-all duration-200"
          >
            Update Schedule
          </Link>
        </div>
      </div>

      {/* Requests Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="font-semibold text-slate-200 mb-4 flex items-center space-x-2">
          <ClipboardCheck className="h-5 w-5 text-violet-400" />
          <span>Tuition Requests Manager</span>
        </h3>
        <div className="text-center py-8 text-slate-500 text-sm">
          <p>No active booking requests received yet.</p>
        </div>
      </div>
    </div>
  );
}
