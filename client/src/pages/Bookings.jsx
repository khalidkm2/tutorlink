import React, { useState, useEffect } from 'react';
import { requestAPI, reviewAPI } from '../services/api';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  Star,
  Loader2,
  AlertCircle,
  X,
  RefreshCw,
  MessageSquare,
  BookOpen,
  DollarSign
} from 'lucide-react';

const STATUS_STYLES = {
  pending:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   text: 'text-amber-400',   icon: Clock,         label: 'Pending' },
  accepted:  { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', icon: CheckCircle2,  label: 'Accepted' },
  rejected:  { bg: 'bg-rose-500/10',    border: 'border-rose-500/20',    text: 'text-rose-400',    icon: XCircle,       label: 'Rejected' },
  completed: { bg: 'bg-indigo-500/10',  border: 'border-indigo-500/20',  text: 'text-indigo-400',  icon: Award,         label: 'Completed' },
};

export default function Bookings() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Status filter
  const [activeFilter, setActiveFilter] = useState('all');

  // Review Modal State
  const [reviewTarget, setReviewTarget] = useState(null); // booking object
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await requestAPI.getStudentRequests();
      if (data.success) {
        setRequests(data.data || []);
      } else {
        setErrorMessage(data.message || 'Failed to fetch bookings');
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

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewTarget) return;

    if (!comment.trim() || comment.trim().length < 5) {
      setReviewError('Review comment must be at least 5 characters');
      return;
    }

    setReviewLoading(true);
    setReviewError('');

    try {
      const data = await reviewAPI.createReview({
        requestId: reviewTarget._id,
        rating,
        comment: comment.trim()
      });

      if (data.success) {
        setReviewSuccess(true);
        // After brief success state, close modal and refresh
        setTimeout(() => {
          setReviewTarget(null);
          setReviewSuccess(false);
          setRating(5);
          setComment('');
          fetchRequests();
        }, 1800);
      } else {
        setReviewError(data.message || 'Failed to submit review');
      }
    } catch (err) {
      setReviewError(err.message || 'Server error submitting review');
    } finally {
      setReviewLoading(false);
    }
  };

  const openReviewModal = (booking) => {
    setReviewTarget(booking);
    setRating(5);
    setComment('');
    setReviewError('');
    setReviewSuccess(false);
  };

  const filters = ['all', 'pending', 'accepted', 'rejected', 'completed'];

  const filteredRequests = activeFilter === 'all'
    ? requests
    : requests.filter(r => r.status === activeFilter);

  const counts = filters.reduce((acc, f) => {
    acc[f] = f === 'all' ? requests.length : requests.filter(r => r.status === f).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">My Tuition Bookings</h1>
          <p className="text-sm text-slate-400">Track your submitted tuition requests and leave reviews upon completion.</p>
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
        {filters.map(f => (
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

      {/* Content Area */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-500">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
          <p className="text-sm font-medium">Loading your booking history...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 space-y-3">
          <ClipboardList className="h-12 w-12 mx-auto text-slate-700" />
          <p className="text-base font-semibold">
            {activeFilter === 'all'
              ? "No booking requests yet. Use Search & Match to find a tutor!"
              : `No ${activeFilter} bookings found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((booking) => {
            const statusCfg = STATUS_STYLES[booking.status] || STATUS_STYLES.pending;
            const StatusIcon = statusCfg.icon;
            const tutorName = booking.tutorId?.name || 'Tutor';

            return (
              <div
                key={booking._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Left Info block */}
                  <div className="flex-grow space-y-3">
                    {/* Tutor + Subject Header */}
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-600/10 text-indigo-400 p-2.5 rounded-xl border border-indigo-500/20 flex-shrink-0">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base">{booking.subject}</h3>
                        <p className="text-xs text-slate-400">
                          Tutor: <span className="text-indigo-400 font-semibold">{tutorName}</span>
                          {booking.tutorId?.address && (
                            <span className="text-slate-600"> — {booking.tutorId.address}</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
                      <div className="flex items-center space-x-1.5 text-slate-400">
                        <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                        <span><span className="font-bold text-emerald-400">${booking.hourlyFee}/hr</span></span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-slate-400">
                        <ClipboardList className="h-3.5 w-3.5 text-indigo-400" />
                        <span>Grade: <span className="font-semibold text-slate-300">{booking.classGrade}</span></span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-slate-400">
                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                        <span>Requested: <span className="font-semibold text-slate-300">{new Date(booking.createdAt).toLocaleDateString()}</span></span>
                      </div>
                    </div>

                    {/* Message preview */}
                    {booking.message && (
                      <div className="bg-slate-950 border border-slate-850/80 rounded-xl px-4 py-2.5 text-xs text-slate-400 flex items-start space-x-2">
                        <MessageSquare className="h-4 w-4 text-slate-600 flex-shrink-0 mt-0.5" />
                        <p className="line-clamp-2 leading-relaxed">{booking.message}</p>
                      </div>
                    )}
                  </div>

                  {/* Right Status + Actions block */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 flex-shrink-0">
                    {/* Status Badge */}
                    <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${statusCfg.bg} ${statusCfg.border} ${statusCfg.text}`}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      <span>{statusCfg.label}</span>
                    </div>

                    {/* Leave Review CTA — only for completed bookings */}
                    {booking.status === 'completed' && (
                      <button
                        onClick={() => openReviewModal(booking)}
                        className="flex items-center space-x-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 hover:border-indigo-500/40 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Star className="h-3.5 w-3.5" />
                        <span>Leave Review</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {reviewTarget && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative shadow-2xl">
            <button
              onClick={() => setReviewTarget(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {reviewSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Review Submitted!</h3>
                <p className="text-sm text-slate-400">Your {rating}-star review has been recorded. Thank you!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Write a Review</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    For <span className="font-bold text-indigo-400">{reviewTarget.tutorId?.name}</span> — {reviewTarget.subject}
                  </p>
                </div>

                {reviewError && (
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl flex items-center space-x-2 text-xs">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{reviewError}</span>
                  </div>
                )}

                {/* Star Rating Picker */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Your Rating
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-9 w-9 transition-colors ${
                            star <= (hoverRating || rating)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-700 fill-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">{rating} out of 5 stars selected</p>
                </div>

                {/* Comment */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Written Comment
                  </label>
                  <textarea
                    rows="4"
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                      if (reviewError) setReviewError('');
                    }}
                    placeholder="Describe your overall tutoring experience in at least 5 characters..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm resize-none"
                  />
                  <p className="text-[10px] text-slate-600">{comment.length} characters (min 5)</p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setReviewTarget(null)}
                    className="flex-1 bg-slate-800 hover:bg-slate-750 text-white font-semibold py-3 rounded-xl transition-colors border border-slate-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {reviewLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Review</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
