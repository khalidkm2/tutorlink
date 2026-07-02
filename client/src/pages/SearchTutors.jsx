import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { recommendationAPI, requestAPI } from '../services/api';
import MapView from '../components/MapView';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Award, 
  Calendar, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  X,
  Star,
  Compass
} from 'lucide-react';

export default function SearchTutors() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Search parameters
  const [subject, setSubject] = useState('');
  const [maxBudget, setMaxBudget] = useState('50');
  const [maxDistance, setMaxDistance] = useState('10');
  const [preferredExperience, setPreferredExperience] = useState('2');
  
  // Availability checkbox selections
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);

  // Query states
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);

  // Booking Modal State
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const commonSlots = ['10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00'];

  const normalizeRecommendation = (item) => {
    const tutor = item?.tutor || {};
    const profileDetails = tutor?.profileDetails || {};
    const scores = item?.scores || {};

    return {
      tutor,
      profileDetails,
      distance: Number(item?.distance) || 0,
      scores,
      totalScore: Number(scores.totalScore ?? 0),
    };
  };

  const normalizedResults = results.map(normalizeRecommendation);

  const toggleDaySelection = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const toggleSlotSelection = (slot) => {
    setSelectedSlots(prev => 
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    );
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSearchTriggered(true);

    if (!subject.trim()) {
      setErrorMessage('Please specify a subject to search');
      return;
    }

    // Check if coordinates exist on student profile
    const coords = user?.location?.coordinates;
    if (!coords || coords.length !== 2) {
      setErrorMessage('Please update your street address and location coordinates in your profile settings before querying recommendations');
      return;
    }

    setLoading(true);

    // Format availability criteria for backend
    // backend expects: [{ day: 'Monday', slots: ['16:00-18:00'] }]
    const formattedAvailability = selectedDays.map(day => ({
      day,
      slots: selectedSlots.length > 0 ? selectedSlots : ['16:00-18:00'] // fallback slot if none checked
    }));

    const criteria = {
      subject: subject.trim(),
      maxBudget: parseFloat(maxBudget),
      maxDistance: parseFloat(maxDistance),
      preferredExperience: parseInt(preferredExperience, 10),
      availability: formattedAvailability.length > 0 ? formattedAvailability : undefined
    };

    try {
      const data = await recommendationAPI.getRecommendations(criteria);
      if (data.success) {
        setResults(Array.isArray(data.data) ? data.data : []);
      } else {
        setErrorMessage(data.message || 'Matching failed');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to communicate with recommendations engine');
    } finally {
      setLoading(false);
    }
  };

  // Open booking modal
  const handleOpenBooking = (tutor) => {
    setSelectedTutor(tutor);
    setBookingMessage('');
    setBookingError('');
    setBookingSuccess(false);
  };

  // Submit booking request
  const handleSendBooking = async (e) => {
    e.preventDefault();
    if (!selectedTutor) return;

    setBookingLoading(true);
    setBookingError('');

    const tutorData = selectedTutor.tutor || {};
    const profileData = selectedTutor.profileDetails || {};

    const payload = {
      tutorId: tutorData._id,
      subject: subject.trim(),
      classGrade: profile?.classGrade || 'Grade 10',
      hourlyFee: parseFloat(profileData.hourlyFee),
      message: bookingMessage.trim()
    };

    try {
      const data = await requestAPI.createRequest(payload);
      if (data.success) {
        setBookingSuccess(true);
        setTimeout(() => {
          setSelectedTutor(null);
          navigate('/student-dashboard/bookings');
        }, 1500);
      } else {
        setBookingError(data.message || 'Failed to submit request');
      }
    } catch (err) {
      setBookingError(err.message || 'Error processing request');
    } finally {
      setBookingLoading(false);
    }
  };

  // Format student coordinates array for MapView center
  const getMapCenter = () => {
    const coords = user?.location?.coordinates;
    if (coords && coords.length === 2) {
      return [coords[1], coords[0]]; // [lat, lng] for Leaflet
    }
    return [27.7172, 85.3240];
  };

  return (
    <div className="space-y-8 text-slate-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/10 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Algorithmic Tutor Recommendation</h1>
          <p className="text-sm text-slate-600 max-w-2xl">Search matching tutors sorted by distance, availability, budget, and experience using the smart recommendation engine.</p>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-2xl flex items-start space-x-3 text-sm shadow-sm">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Split layout: Filter Form left, Map right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Filter Controls Column */}
        <div className="bg-white border border-black/10 rounded-[28px] p-5 sm:p-6 space-y-6 lg:col-span-1 shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
          <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
            <Compass className="h-5 w-5 text-teal-700" />
            <span>Search Parameters</span>
          </h2>

          <form onSubmit={handleSearch} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Subject Focus
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Search className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Mathematics"
                  className="w-full bg-[#fbf8f2] border border-black/10 rounded-2xl py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-700 text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Max Budget
                </label>
                <span className="text-xs font-bold text-orange-700">${maxBudget}/hr</span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                className="w-full h-1.5 bg-[#fbf8f2] rounded-lg appearance-none cursor-pointer accent-teal-700"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Max Distance
                </label>
                <span className="text-xs font-bold text-teal-700">{maxDistance} km</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={maxDistance}
                onChange={(e) => setMaxDistance(e.target.value)}
                className="w-full h-1.5 bg-[#fbf8f2] rounded-lg appearance-none cursor-pointer accent-teal-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Min Teaching Experience
              </label>
              <input
                type="number"
                min="0"
                value={preferredExperience}
                onChange={(e) => setPreferredExperience(e.target.value)}
                className="w-full bg-[#fbf8f2] border border-black/10 rounded-2xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-700 text-sm"
              />
            </div>

            {/* Availability schedules */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Days Preferred
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {daysOfWeek.map(day => {
                  const checked = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDaySelection(day)}
                      className={`py-2 px-3 rounded-lg border text-left font-medium transition-colors ${
                        checked 
                          ? 'bg-teal-700 text-white border-teal-700'
                          : 'bg-[#fbf8f2] border-black/10 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {day.substring(0, 3)}day
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Preferred Time Slots
              </label>
              <div className="grid grid-cols-1 gap-2 text-xs">
                {commonSlots.map(slot => {
                  const checked = selectedSlots.includes(slot);
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => toggleSlotSelection(slot)}
                      className={`py-2.5 px-3 rounded-lg border text-left font-medium transition-colors flex justify-between items-center ${
                        checked 
                          ? 'bg-teal-700 text-white border-teal-700'
                          : 'bg-[#fbf8f2] border-black/10 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>{slot}</span>
                      {checked && <CheckCircle className="h-4 w-4 text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-700 hover:bg-teal-800 text-white py-3.5 px-4 rounded-2xl font-bold transition-all duration-200 shadow-lg shadow-teal-700/15 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Clustering Tutors...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Execute Smart Match</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Map View Column */}
        <div className="lg:col-span-2 space-y-6">
          <MapView center={getMapCenter()} tutors={normalizedResults} height="480px" />
          
          <div className="p-4 bg-white border border-black/10 rounded-3xl flex items-center justify-between text-xs sm:text-sm text-slate-600 shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 bg-rose-500 rounded-full inline-block"></span>
              <span className="font-semibold text-slate-800">You (Student)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 bg-teal-700 rounded-full inline-block"></span>
              <span className="font-semibold text-slate-800">Matches (Top 5 Tutors)</span>
            </div>
            <div>
              <span>Centroids Convergence: <span className="text-teal-700 font-semibold">Matched</span></span>
            </div>
          </div>
        </div>

      </div>

      {/* Match Results section */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2">
          <span>Match Recommendations Listing</span>
          {results.length > 0 && (
            <span className="bg-teal-700/10 text-teal-700 border border-teal-700/20 text-xs px-2.5 py-0.5 rounded-full font-bold">
              {results.length} Matches Found
            </span>
          )}
        </h2>

        {loading ? (
          <div className="py-20 text-center text-slate-500 flex flex-col items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-teal-700 mb-4" />
            <p className="text-lg font-semibold">Running K-Means Centroid Math Runtimes...</p>
            <p className="text-xs text-slate-600 mt-1">Isolating physical clusters and parsing scoring vectors.</p>
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white border border-black/10 p-12 rounded-[28px] text-center text-slate-500 shadow-sm">
            <Compass className="h-12 w-12 mx-auto text-slate-400 mb-4 animate-pulse" />
            {searchTriggered 
              ? 'No tutors in the converged search cluster match your parameters. Adjust your filters and run again.' 
              : 'Specify subject queries and run matching algorithms to view top 5 matching recommendations.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {normalizedResults.map((tutor, index) => (
              <div 
                key={tutor.tutor?._id || tutor.tutor?.email || index}
                className="bg-white border border-black/10 rounded-[28px] p-6 flex flex-col justify-between hover:border-teal-700/20 transition-colors relative overflow-hidden group shadow-[0_14px_35px_rgba(15,23,42,0.08)]"
              >
                {/* Ranking Tag */}
                <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl uppercase tracking-wider">
                  Match Rank #{index + 1}
                </div>

                <div>
                  {/* Name and Rating */}
                  <div className="flex items-start justify-between mb-4 pr-12">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                        {tutor.tutor?.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="bg-[#fbf8f2] text-orange-700 px-2 py-0.5 rounded-lg text-xs font-bold flex items-center space-x-1 border border-black/10">
                          <Star className="h-3 w-3 fill-orange-500 stroke-none" />
                          <span>★ {tutor.profileDetails?.averageRating ?? 'Unrated'}</span>
                        </span>
                        <span className="text-xs text-slate-500">
                          ({tutor.profileDetails?.reviewCount ?? 0} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Specs */}
                  <div className="grid grid-cols-3 gap-3 bg-[#fbf8f2] p-3 rounded-2xl border border-black/10 mb-4 text-xs">
                    <div className="text-center">
                      <span className="block text-slate-500 font-medium mb-0.5">Rate</span>
                      <span className="font-bold text-teal-700 text-sm">${tutor.profileDetails?.hourlyFee ?? 'N/A'}/hr</span>
                    </div>
                    <div className="text-center border-x border-black/10">
                      <span className="block text-slate-500 font-medium mb-0.5">Experience</span>
                      <span className="font-bold text-slate-800 text-sm">{tutor.profileDetails?.experience ?? 'N/A'} Yrs</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-slate-500 font-medium mb-0.5">Distance</span>
                      <span className="font-bold text-orange-700 text-sm">{tutor.distance.toFixed(2)} km</span>
                    </div>
                  </div>

                  {/* Algorithm compatibility score details */}
                  <div className="mb-4 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Weighted Match Score:</span>
                      <span className="font-bold text-teal-700">{(tutor.totalScore * 100).toFixed(0)}% Match</span>
                    </div>
                    <div className="w-full bg-[#fbf8f2] rounded-full h-1.5 overflow-hidden border border-black/10">
                      <div 
                        className="bg-linear-to-r from-teal-700 to-orange-500 h-1.5 rounded-full"
                        style={{ width: `${Math.max(0, Math.min(100, tutor.totalScore * 100))}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Score breakdown */}
                  <div className="mb-4 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                    <div className="bg-[#fbf8f2] border border-black/10 rounded-lg px-2.5 py-2">
                      Distance: <span className="text-slate-200 font-semibold">{(tutor.scores.distanceScore ?? 0).toFixed(2)}</span>
                    </div>
                    <div className="bg-[#fbf8f2] border border-black/10 rounded-lg px-2.5 py-2">
                      Availability: <span className="text-slate-200 font-semibold">{(tutor.scores.availabilityScore ?? 0).toFixed(2)}</span>
                    </div>
                    <div className="bg-[#fbf8f2] border border-black/10 rounded-lg px-2.5 py-2">
                      Budget: <span className="text-slate-200 font-semibold">{(tutor.scores.budgetScore ?? 0).toFixed(2)}</span>
                    </div>
                    <div className="bg-[#fbf8f2] border border-black/10 rounded-lg px-2.5 py-2">
                      Experience: <span className="text-slate-200 font-semibold">{(tutor.scores.experienceScore ?? 0).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2 text-[10px]">
                    {tutor.tutor?.profileDetails?.subjects?.map((subjectItem) => (
                      <span key={subjectItem} className="bg-teal-700/10 border border-teal-700/20 text-teal-700 px-2 py-1 rounded-md font-semibold">
                        {subjectItem}
                      </span>
                    ))}
                    {tutor.tutor?.profileDetails?.classes?.map((classItem) => (
                      <span key={classItem} className="bg-orange-500/10 border border-orange-500/20 text-orange-700 px-2 py-1 rounded-md font-semibold">
                        Class {classItem}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs text-slate-600 leading-relaxed mb-4 border-t border-black/10 pt-3">
                    <span className="font-bold text-slate-800 block mb-1">Qualifications:</span>
                    <p className="leading-relaxed">{tutor.profileDetails?.qualifications || 'No qualifications listed.'}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenBooking(tutor)}
                  className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 rounded-2xl text-sm transition-colors cursor-pointer shadow-sm"
                >
                  Send Booking Request
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Form Modal Overlay */}
      {selectedTutor && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-lg bg-white border border-black/10 rounded-[28px] p-6 sm:p-8 relative shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
            {/* Close */}
            <button 
              onClick={() => setSelectedTutor(null)} 
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-teal-700/10 text-teal-700 rounded-full flex items-center justify-center mx-auto border border-teal-700/20">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Booking Request Sent!</h3>
                <p className="text-sm text-slate-600">Your tuition request has been submitted. Redirecting to bookings panel...</p>
              </div>
            ) : (
              <form onSubmit={handleSendBooking} className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Book Tutor Request</h3>
                  <p className="text-sm text-slate-600">Initiate match with <span className="font-bold text-teal-700">{selectedTutor.tutor?.name}</span></p>
                </div>

                {bookingError && (
                  <div className="bg-orange-50 border border-orange-200 text-orange-800 p-3 rounded-2xl flex items-center space-x-2 text-xs">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{bookingError}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm bg-[#fbf8f2] p-4 rounded-2xl border border-black/10">
                  <div>
                    <span className="block text-slate-500 font-semibold mb-0.5 text-xs uppercase tracking-wider">Subject</span>
                    <span className="font-bold text-white">{subject}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 font-semibold mb-0.5 text-xs uppercase tracking-wider">Hourly Rate</span>
                    <span className="font-bold text-teal-700">${selectedTutor.profileDetails?.hourlyFee ?? 'N/A'}/hr</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 font-semibold mb-0.5 text-xs uppercase tracking-wider">Your Grade</span>
                    <span className="font-bold text-white">{profile?.classGrade || 'Grade 10'}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 font-semibold mb-0.5 text-xs uppercase tracking-wider">Distance Commute</span>
                    <span className="font-bold text-orange-700">{selectedTutor.distance.toFixed(2)} km</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Tuition Details / Custom Message
                  </label>
                  <textarea
                    rows="4"
                    value={bookingMessage}
                    onChange={(e) => setBookingMessage(e.target.value)}
                    placeholder="Describe tuition topics, weekly timings, or coordinates preferences..."
                    className="w-full bg-[#fbf8f2] border border-black/10 rounded-2xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-700 text-sm resize-none"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedTutor(null)}
                    className="flex-1 bg-[#fbf8f2] hover:bg-black/5 text-slate-900 font-semibold py-3 rounded-2xl transition-colors border border-black/10 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="grow flex-1 bg-teal-700 hover:bg-teal-800 text-white font-semibold py-3 rounded-2xl transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 shadow-sm"
                  >
                    {bookingLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <span>Confirm Booking</span>
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
