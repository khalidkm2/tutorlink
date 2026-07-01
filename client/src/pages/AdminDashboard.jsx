import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../services/api';
import { ShieldCheck, Users, BarChart3, Clock, Loader2, CheckCircle2, AlertCircle, FileText, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [pendingTutors, setPendingTutors] = useState([]);
  const [approvedTutorsCount, setApprovedTutorsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchStatsAndPending = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      // 1. Fetch pending tutors
      const pendingRes = await profileAPI.getPendingTutors();
      if (pendingRes.success) {
        setPendingTutors(pendingRes.data || []);
      }

      // 2. Fetch approved tutors
      const approvedRes = await profileAPI.getTutors();
      if (approvedRes.success) {
        setApprovedTutorsCount(approvedRes.count || 0);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error retrieving administrator stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsAndPending();
  }, []);

  const handleApproveTutor = async (tutorId) => {
    setActionLoadingId(tutorId);
    setErrorMessage('');
    try {
      const response = await profileAPI.approveTutor(tutorId);
      if (response.success) {
        // Update stats and remove approved tutor from state
        setPendingTutors((prev) => prev.filter((item) => item.user._id !== tutorId));
        setApprovedTutorsCount((prev) => prev + 1);
      } else {
        setErrorMessage(response.message || 'Failed to approve tutor');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Server error approving tutor');
    } finally {
      setActionLoadingId(null);
    }
  };

  const previewList = pendingTutors.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 md:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-500/5 rounded-full blur-3xl pointer-events-none" />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Admin Console: Welcome, {user?.name}
        </h1>
        <p className="text-slate-300 max-w-xl text-sm sm:text-base leading-relaxed">
          Monitor system metrics, evaluate pending tutor applications, verify certificates, and manage the system.
        </p>
      </div>

      {errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-start space-x-3 text-sm">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4 shadow-lg shadow-slate-950/50 hover:border-slate-700 transition-colors">
          <div className="bg-indigo-600/10 text-indigo-400 p-3 rounded-xl border border-indigo-500/20">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {loading ? <Loader2 className="h-6 w-6 animate-spin text-slate-500" /> : approvedTutorsCount}
            </div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Tutors</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4 shadow-lg shadow-slate-950/50 hover:border-slate-700 transition-colors">
          <div className="bg-amber-600/10 text-amber-400 p-3 rounded-xl border border-amber-500/20">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {loading ? <Loader2 className="h-6 w-6 animate-spin text-slate-500" /> : pendingTutors.length}
            </div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Awaiting Review</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center space-x-4 shadow-lg shadow-slate-950/50 hover:border-slate-700 transition-colors">
          <div className="bg-violet-600/10 text-violet-400 p-3 rounded-xl border border-violet-500/20">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">100%</div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">System Accuracy</div>
          </div>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-slate-950/50">
        <div className="flex justify-between items-center mb-6 border-b border-slate-850 pb-4">
          <div>
            <h3 className="font-bold text-slate-200 text-base flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-indigo-400" />
              <span>Verification Queue Preview</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Quickly review and approve certificates uploaded by newly registered tutors.</p>
          </div>
          <Link
            to="/admin-dashboard/pending"
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 bg-indigo-650/10 hover:bg-indigo-650/20 px-3 py-1.5 rounded-lg border border-indigo-500/20"
          >
            <span>View Full Queue ({pendingTutors.length})</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-3" />
            <p className="text-xs">Loading queue items...</p>
          </div>
        ) : previewList.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm space-y-2">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
            <p className="font-semibold text-slate-400">All caught up!</p>
            <p className="text-xs text-slate-600">No tutor verification certificates currently pending review.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {previewList.map((item) => {
              const profile = item.profileDetails || {};
              const userObj = item.user || {};
              const isProcessing = actionLoadingId === userObj._id;

              return (
                <div
                  key={userObj._id}
                  className="bg-slate-950 border border-slate-850 rounded-xl p-4 sm:p-5 hover:border-slate-800 transition-colors"
                >
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{userObj.name}</span>
                        <span className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-mono text-slate-400">{userObj.email}</span>
                      </div>
                      <div className="text-xs text-slate-400 space-y-1">
                        <p>
                          Subjects: <span className="text-indigo-400 font-semibold">{profile.subjects?.join(', ') || 'N/A'}</span>
                        </p>
                        <p>
                          Hourly Fee: <span className="text-emerald-400 font-bold">${profile.hourlyFee}/hr</span> | Experience: <span className="text-slate-300 font-semibold">{profile.experience} years</span>
                        </p>
                        {userObj.address && (
                          <p className="truncate max-w-md" title={userObj.address}>
                            Address: <span className="text-slate-300">{userObj.address}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {profile.qualifications && (
                        <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-900 px-3 py-2 rounded-lg border border-slate-850 max-w-[200px] truncate" title={profile.qualifications}>
                          <FileText className="h-4 w-4 text-slate-500 flex-shrink-0" />
                          <span>{profile.qualifications}</span>
                        </div>
                      )}
                      
                      <button
                        onClick={() => handleApproveTutor(userObj._id)}
                        disabled={isProcessing}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-600/10 border border-emerald-500 disabled:opacity-50 min-w-[90px] flex items-center justify-center"
                      >
                        {isProcessing ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          'Approve'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
