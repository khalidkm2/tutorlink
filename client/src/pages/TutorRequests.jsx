import React, { useState, useEffect } from 'react';
import { requestAPI } from '../services/api';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  Loader2,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  BookOpen,
  DollarSign,
  User,
  MapPin,
  Mail,
  Calendar
} from 'lucide-react';

const STATUS_STYLES = {
  pending:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   text: 'text-amber-400',   icon: Clock,         label: 'Pending' },
  accepted:  { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', icon: CheckCircle2,  label: 'Accepted' },
  rejected:  { bg: 'bg-rose-500/10',    border: 'border-rose-500/20',    text: 'text-rose-400',    icon: XCircle,       label: 'Rejected' },
  completed: { bg: 'bg-indigo-500/10',  border: 'border-indigo-500/20',  text: 'text-indigo-400',  icon: Award,         label: 'Completed' },
};

export default function TutorRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Status Filter
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchRequests = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await requestAPI.getTutorRequests();
      if (response.success) {
        setRequests(response.data || []);
      } else {
        setErrorMessage(response.message || 'Failed to fetch requests');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (requestId, newStatus) => {
    setActionLoadingId(requestId);
    setErrorMessage('');
    try {
      const response = await requestAPI.updateRequestStatus(requestId, { status: newStatus });
      if (response.success) {
        // Update local state without full reload for smooth animation
        setRequests((prev) =>
          prev.map((req) => (req._id === requestId ? { ...req, status: newStatus } : req))
        );
      } else {
        setErrorMessage(response.message || 'Failed to update request status');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error updating status');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filters = ['all', 'pending', 'accepted', 'rejected', 'completed'];

  const filteredRequests = activeFilter === 'all'
    ? requests
    : requests.filter((r) => r.status === activeFilter);

  const counts = filters.reduce((acc, f) => {
    acc[f] = f === 'all' ? requests.length : requests.filter((r) => r.status === f).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Tuition Requests Manager</h1>
          <p className="text-sm text-slate-400">Review, approve, and manage incoming tuition requests from students.</p>
        </div>
        <button
          onClick={fetchRequests}
          disabled={loading}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-start space-x-3 text-sm">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              activeFilter === f
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="ml-1.5 bg-black/20 text-[10px] px-1.5 py-0.5 rounded-full">
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* List Area */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-500">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
          <p className="text-sm font-medium">Loading incoming requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 space-y-3">
          <ClipboardList className="h-12 w-12 mx-auto text-slate-700" />
          <p className="text-base font-semibold">
            {activeFilter === 'all'
              ? 'No tuition requests received yet.'
              : `No incoming ${activeFilter} requests found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((booking) => {
            const statusCfg = STATUS_STYLES[booking.status] || STATUS_STYLES.pending;
            const StatusIcon = statusCfg.icon;
            const studentName = booking.studentId?.name || 'Student';
            const studentEmail = booking.studentId?.email || '';
            const studentAddress = booking.studentId?.address || 'Not specified';
            const isProcessing = actionLoadingId === booking._id;

            return (
              <div
                key={booking._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 hover:border-slate-700 transition-all shadow-md shadow-slate-950/20"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Left Section: Information */}
                  <div className="flex-grow space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-600/10 text-indigo-400 p-2.5 rounded-xl border border-indigo-500/20 flex-shrink-0">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-x-2.5">
                          <h3 className="font-bold text-white text-base">{booking.subject}</h3>
                          <span className="text-slate-600 font-normal">for</span>
                          <span className="text-slate-300 font-bold text-sm bg-slate-950 px-2 py-0.5 rounded border border-slate-850">{booking.classGrade}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-indigo-400" />
                          <span>Student: <span className="text-indigo-400 font-semibold">{studentName}</span></span>
                          {studentEmail && (
                            <span className="text-slate-500 flex items-center gap-0.5 ml-2 font-mono">
                              <Mail className="h-3 w-3" /> {studentEmail}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Stats bar */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
                      <div className="flex items-center space-x-1.5 text-slate-400">
                        <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Proposed rate: <span className="font-bold text-emerald-400">${booking.hourlyFee}/hr</span></span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-slate-400">
                        <Calendar className="h-3.5 w-3.5 text-violet-400" />
                        <span>Requested on: <span className="font-semibold text-slate-300">{new Date(booking.createdAt).toLocaleDateString()}</span></span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-slate-400 max-w-sm truncate" title={studentAddress}>
                        <MapPin className="h-3.5 w-3.5 text-rose-500" />
                        <span>Location: <span className="font-semibold text-slate-300">{studentAddress}</span></span>
                      </div>
                    </div>

                    {/* Student message */}
                    {booking.message && (
                      <div className="bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-xs text-slate-400 space-y-1.5">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <MessageSquare className="h-3.5 w-3.5 text-slate-500" /> Student Message
                        </span>
                        <p className="leading-relaxed whitespace-pre-wrap">{booking.message}</p>
                      </div>
                    )}
                  </div>

                  {/* Right Section: Status Badge & Process Buttons */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 flex-shrink-0 border-t lg:border-t-0 border-slate-850 pt-4 lg:pt-0">
                    {/* Status badge */}
                    <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${statusCfg.bg} ${statusCfg.border} ${statusCfg.text}`}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      <span>{statusCfg.label}</span>
                    </div>

                    {/* Actions */}
                    {isProcessing ? (
                      <div className="flex items-center justify-center p-2 text-indigo-400">
                        <Loader2 className="h-5 w-5 animate-spin" />
                      </div>
                    ) : (
                      <div className="flex gap-2 w-full sm:w-auto">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(booking._id, 'rejected')}
                              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/30 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(booking._id, 'accepted')}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-emerald-600/15"
                            >
                              Accept
                            </button>
                          </>
                        )}
                        {booking.status === 'accepted' && (
                          <button
                            onClick={() => handleUpdateStatus(booking._id, 'completed')}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-indigo-600/15 w-full"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
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
