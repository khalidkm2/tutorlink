import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Users, BarChart3, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 md:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-500/5 rounded-full blur-3xl pointer-events-none" />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Admin Console: {user?.name}
        </h1>
        <p className="text-slate-300 max-w-xl text-sm sm:text-base leading-relaxed">
          Monitor system metrics, evaluate pending tutor applications, verify certificates, and manage the system.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4">
          <div className="bg-indigo-600/10 text-indigo-400 p-3 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">Active</div>
            <div className="text-xs text-slate-500">Tutor Records</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4">
          <div className="bg-amber-600/10 text-amber-400 p-3 rounded-xl">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">Pending</div>
            <div className="text-xs text-slate-500">Tutors Awaiting Review</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4">
          <div className="bg-violet-600/10 text-violet-400 p-3 rounded-xl">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">100%</div>
            <div className="text-xs text-slate-500">System Performance</div>
          </div>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-slate-200 flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-indigo-400" />
            <span>Verification Queue</span>
          </h3>
          <Link
            to="/admin-dashboard/pending"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
          >
            Review applications &rarr;
          </Link>
        </div>
        <div className="text-center py-8 text-slate-500 text-sm">
          <span>Check the queue link above to review certificate uploads and approve new tutors.</span>
        </div>
      </div>
    </div>
  );
}
