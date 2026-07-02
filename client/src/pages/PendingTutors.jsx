import React, { useState, useEffect } from 'react';
import { profileAPI } from '../services/api';
import {
  ShieldCheck,
  Award,
  BookOpen,
  DollarSign,
  User,
  MapPin,
  Mail,
  Calendar,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  ChevronLeft,
  GraduationCap,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PendingTutors() {
  const [pendingTutors, setPendingTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchPendingTutors = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await profileAPI.getPendingTutors();
      if (response.success) {
        setPendingTutors(response.data || []);
      } else {
        setErrorMessage(response.message || 'Failed to fetch pending tutors');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingTutors();
  }, []);

  const handleApproveTutor = async (tutorId, tutorName) => {
    setActionLoadingId(tutorId);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const response = await profileAPI.approveTutor(tutorId);
      if (response.success) {
        setSuccessMessage(`Tutor profile for ${tutorName} has been approved successfully!`);
        setPendingTutors((prev) => prev.filter((item) => item.user._id !== tutorId));
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        setErrorMessage(response.message || 'Failed to approve tutor profile');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error processing tutor approval');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-8 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 pb-5">
        <div className="flex items-center space-x-3">
          <Link
            to="/admin-dashboard"
            className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
            title="Back to Dashboard"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Pending Verification Queue</h1>
            <p className="text-sm text-slate-600">Tutor accounts activate automatically. This page now acts as a legacy profile review view.</p>
          </div>
        </div>
        <button
          onClick={fetchPendingTutors}
          disabled={loading}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center space-x-3 text-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-start space-x-3 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* List Area */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-500">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
          <p className="text-sm font-medium">Retrieving tutor verification forms...</p>
        </div>
      ) : pendingTutors.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 space-y-3 shadow-lg shadow-slate-950/50">
          <ShieldCheck className="h-12 w-12 mx-auto text-emerald-500/30" />
          <p className="text-base font-semibold text-slate-400">No pending tutor approvals</p>
          <p className="text-xs text-slate-650 max-w-sm mx-auto leading-relaxed">
            Tutor registrations are approved automatically, so there is no admin verification queue to process.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingTutors.map((item) => {
            const tutorProfile = item.profileDetails || {};
            const tutorUser = item.user || {};
            const isProcessing = actionLoadingId === tutorUser._id;

            return (
              <div
                key={tutorUser._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all shadow-md shadow-slate-950/30 space-y-6"
              >
                {/* Profile brief */}
                <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-6">
                  <div className="space-y-4 grow">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <h3 className="font-extrabold text-white text-lg">{tutorUser.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-slate-950 border border-slate-850 px-2 py-0.5 rounded font-mono text-slate-400">{tutorUser.email}</span>
                        <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Active</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs text-slate-400">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                        <span>Hourly Fee: <span className="font-bold text-emerald-400">${tutorProfile.hourlyFee}/hr</span></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="h-4 w-4 text-violet-400" />
                        <span>Experience: <span className="font-semibold text-slate-300">{tutorProfile.experience} Years</span></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span>Joined: <span className="font-semibold text-slate-300">{new Date(tutorUser.createdAt).toLocaleDateString()}</span></span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-500 font-bold block uppercase tracking-wider text-[10px]">Subjects Offered:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {tutorProfile.subjects?.map((sub, idx) => (
                            <span key={idx} className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] px-2 py-0.5 rounded">
                              {sub}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-bold block uppercase tracking-wider text-[10px]">Target Grades:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {tutorProfile.classes?.map((cls, idx) => (
                            <span key={idx} className="bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[10px] px-2 py-0.5 rounded">
                              {cls}
                            </span>
                          ))}
                        </div>
                      </div>
                      {tutorUser.address && (
                        <div className="flex items-start space-x-1.5 pt-1">
                          <MapPin className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                          <p className="text-slate-400">
                            Physical Address: <span className="font-medium text-slate-300">{tutorUser.address}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-stretch sm:flex-row lg:flex-col gap-3 min-w-50 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-850">
                    <button
                      onClick={() => handleApproveTutor(tutorUser._id, tutorUser.name)}
                      disabled={isProcessing}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-650/15 border border-emerald-500 flex items-center justify-center space-x-2 text-xs"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Approving...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Mark as Active</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Qualification details & certificates */}
                <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5 text-slate-500" /> Degrees / Academic Achievements
                    </span>
                    <p className="text-xs text-slate-450 leading-relaxed italic">{tutorProfile.qualifications || 'No qualifications description added.'}</p>
                  </div>

                  <div className="space-y-1.5 md:border-l md:border-slate-850 md:pl-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-slate-500" /> Certificate Verification File
                      </span>
                      {tutorProfile.certificate ? (
                        <p className="text-xs text-slate-400 mt-1 font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Academic proof uploaded</span>
                        </p>
                      ) : (
                        <p className="text-xs text-slate-500 mt-1 italic flex items-center gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5 text-slate-600" />
                          <span>No certificate file uploaded by tutor</span>
                        </p>
                      )}
                    </div>

                    {tutorProfile.certificate && (
                      <a
                        href={tutorProfile.certificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-1.5 bg-slate-905 hover:bg-slate-800 border border-slate-800 text-slate-350 hover:text-white py-2 rounded-xl text-xs font-bold transition-all cursor-pointer mt-3 max-w-50"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Inspect Certificate</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
