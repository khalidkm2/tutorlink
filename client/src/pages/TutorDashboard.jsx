import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../services/api';
import {
  ShieldCheck,
  MapPin,
  Calendar,
  ClipboardCheck,
  AlertTriangle,
  Edit2,
  Save,
  X,
  Upload,
  Loader2,
  CheckCircle,
  FileText,
  User,
  DollarSign,
  GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TutorDashboard() {
  const { user, profile, updateLocalUser, updateLocalProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [subjects, setSubjects] = useState('');
  const [classes, setClasses] = useState('');
  const [hourlyFee, setHourlyFee] = useState('');
  const [experience, setExperience] = useState('');
  const [qualifications, setQualifications] = useState('');

  // Certificate Upload State
  const [certificateFile, setCertificateFile] = useState(null);
  const [uploadingCertificate, setUploadingCertificate] = useState(false);
  const [certificatePath, setCertificatePath] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Status & Error states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);

  // Initialize form with user/profile data
  useEffect(() => {
    if (user && profile) {
      setName(user.name || '');
      setAddress(user.address || '');
      // MongoDB coordinates are [longitude, latitude]
      if (user.location?.coordinates) {
        setLongitude(user.location.coordinates[0]?.toString() || '');
        setLatitude(user.location.coordinates[1]?.toString() || '');
      }
      setSubjects(profile.subjects?.join(', ') || '');
      setClasses(profile.classes?.join(', ') || '');
      setHourlyFee(profile.hourlyFee?.toString() || '');
      setExperience(profile.experience?.toString() || '');
      setQualifications(profile.qualifications || '');
      setCertificatePath(profile.certificate || '');
    }
  }, [user, profile, isEditing]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser');
      return;
    }

    setGpsLoading(true);
    setErrorMessage('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setGpsLoading(false);
      },
      (error) => {
        setErrorMessage('Unable to retrieve GPS coordinates. Please enter them manually.');
        setGpsLoading(false);
      }
    );
  };

  const handleCertificateUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please upload a PDF or image file (PNG/JPG)');
      return;
    }

    setCertificateFile(file);
    setUploadingCertificate(true);
    setErrorMessage('');
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append('certificate', file);

    try {
      const response = await profileAPI.uploadCertificate(formData);
      if (response.success) {
        setCertificatePath(response.filePath);
        setUploadSuccess(true);
        setSuccessMessage('Certificate uploaded successfully!');
        setTimeout(() => setSuccessMessage(''), 3005);
      } else {
        setErrorMessage(response.message || 'Certificate upload failed');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error uploading certificate');
    } finally {
      setUploadingCertificate(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Field Validation
    if (!name.trim() || !address.trim() || !latitude || !longitude || !subjects.trim() || !classes.trim() || !hourlyFee || !experience || !qualifications.trim()) {
      setErrorMessage('All profile details are required');
      setLoading(false);
      return;
    }

    const latVal = parseFloat(latitude);
    const lngVal = parseFloat(longitude);
    if (isNaN(latVal) || latVal < -90 || latVal > 90) {
      setErrorMessage('Latitude must be a number between -90 and 90');
      setLoading(false);
      return;
    }
    if (isNaN(lngVal) || lngVal < -180 || lngVal > 180) {
      setErrorMessage('Longitude must be a number between -180 and 180');
      setLoading(false);
      return;
    }

    const feeVal = parseFloat(hourlyFee);
    const expVal = parseInt(experience, 10);
    if (isNaN(feeVal) || feeVal < 0) {
      setErrorMessage('Hourly fee must be a non-negative number');
      setLoading(false);
      return;
    }
    if (isNaN(expVal) || expVal < 0) {
      setErrorMessage('Teaching experience must be a non-negative integer');
      setLoading(false);
      return;
    }

    // Format subjects and classes as array
    const subjectsArray = subjects.split(',').map(s => s.trim()).filter(s => s !== '');
    const classesArray = classes.split(',').map(c => c.trim()).filter(c => c !== '');

    const profileData = {
      name: name.trim(),
      address: address.trim(),
      coordinates: [lngVal, latVal], // [longitude, latitude] matching backend GeoJSON expectation
      subjects: subjectsArray,
      classes: classesArray,
      hourlyFee: feeVal,
      experience: expVal,
      qualifications: qualifications.trim(),
      certificate: certificatePath
    };

    try {
      const response = await profileAPI.updateTutorProfile(profileData);
      if (response.success) {
        updateLocalUser(response.user);
        updateLocalProfile(response.profileDetails);
        setSuccessMessage('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Server error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Messages */}
      {successMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl flex items-center space-x-3 text-sm">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl flex items-start space-x-3 text-sm">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

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
      <div className="bg-gradient-to-r from-violet-900 to-indigo-950 rounded-2xl p-6 md:p-8 border border-violet-500/20 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Tutor Panel: Welcome, {user?.name}!
          </h1>
          <p className="text-slate-300 max-w-xl text-sm leading-relaxed">
            Manage your student matching availability, respond to tuition requests, and organize your academic profile here.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-indigo-600/15 border border-indigo-500"
          >
            <Edit2 className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {isEditing ? (
        /* Edit Profile Form */
        <form onSubmit={handleSaveProfile} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Edit Academic & Physical Profile</h2>
              <p className="text-xs text-slate-400">Modify information used for recommendations & matching calculations.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">General Information</h3>
              
              <div className="space-y-1">
                <label className="block text-xs text-slate-400 font-semibold">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs text-slate-400 font-semibold">Hourly Fee ($)</label>
                <input
                  type="number"
                  value={hourlyFee}
                  onChange={(e) => setHourlyFee(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                  placeholder="e.g. 40"
                  min="0"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs text-slate-400 font-semibold">Teaching Experience (Years)</label>
                <input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                  placeholder="e.g. 5"
                  min="0"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs text-slate-400 font-semibold">Qualifications & Degree</label>
                <textarea
                  rows="3"
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm resize-none"
                  placeholder="e.g. BSc in Computer Science, Certified Math Teacher"
                />
              </div>
            </div>

            {/* Location & Academic Focus */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Location & Academics</h3>

              <div className="space-y-1">
                <label className="block text-xs text-slate-400 font-semibold">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                  placeholder="e.g. 123 Main St, Kathmandu"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs text-slate-400 font-semibold">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                    placeholder="e.g. 27.7172"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs text-slate-400 font-semibold">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                    placeholder="e.g. 85.3240"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleGetLocation}
                disabled={gpsLoading}
                className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-750 border border-slate-755 text-slate-300 w-full py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                {gpsLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Detecting Location Coordinates...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="h-3.5 w-3.5 text-rose-500" />
                    <span>Use Current GPS Coordinates</span>
                  </>
                )}
              </button>

              <div className="space-y-1">
                <label className="block text-xs text-slate-400 font-semibold">Subjects Taught (comma separated)</label>
                <input
                  type="text"
                  value={subjects}
                  onChange={(e) => setSubjects(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                  placeholder="e.g. Mathematics, Science, Physics"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs text-slate-400 font-semibold">Classes/Grades Taught (comma separated)</label>
                <input
                  type="text"
                  value={classes}
                  onChange={(e) => setClasses(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                  placeholder="e.g. Grade 9, Grade 10, A-Levels"
                />
              </div>
            </div>
          </div>

          {/* Certificate Verification Attachment */}
          <div className="border-t border-slate-850 pt-6">
            <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-3">Academic Verification Documents</h3>
            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="bg-indigo-600/10 text-indigo-400 p-3 rounded-xl border border-indigo-500/20">
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex-grow text-center sm:text-left space-y-1">
                <p className="text-sm font-bold text-white">Upload Certificate / Qualification proof</p>
                <p className="text-xs text-slate-500">Attach certificates to assist administrators with account approval (PDF, PNG, JPG).</p>
                {certificatePath && (
                  <p className="text-[10px] text-emerald-400 font-mono break-all mt-1">Uploaded to: {certificatePath}</p>
                )}
              </div>
              <div className="relative">
                <input
                  type="file"
                  id="certificate-input"
                  onChange={handleCertificateUpload}
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg"
                  disabled={uploadingCertificate}
                />
                <label
                  htmlFor="certificate-input"
                  className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-indigo-600/15"
                >
                  {uploadingCertificate ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>Choose Certificate File</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 border-t border-slate-850 pt-6">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-slate-800 hover:bg-slate-750 text-white font-semibold py-3 rounded-xl transition-colors border border-slate-700 cursor-pointer text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 text-sm border border-indigo-500 shadow-lg shadow-indigo-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Saving Updates...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* View Profile Details */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors shadow-lg shadow-slate-950/50">
            <h3 className="font-semibold text-slate-200 mb-4 flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-violet-400" />
              <span>Tutor Qualifications</span>
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500 flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" /> Hourly Fee:
                </span>
                <span className="font-semibold text-emerald-400">${profile?.hourlyFee}/hr</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500 flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5" /> Teaching Experience:
                </span>
                <span className="font-medium text-slate-300">{profile?.experience} Years</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">Avg Rating:</span>
                <span className="font-medium text-amber-400">★ {profile?.averageRating?.toFixed(1) || 'Unrated'} ({profile?.reviewCount || 0} reviews)</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 text-xs font-semibold">Degree / Certification Summary:</span>
                <p className="text-slate-400 text-xs italic leading-relaxed">{profile?.qualifications || 'No qualifications description added.'}</p>
              </div>
            </div>
          </div>

          {/* subjects and classes Card */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors shadow-lg shadow-slate-950/50">
            <h3 className="font-semibold text-slate-200 mb-4 flex items-center space-x-2">
              <User className="h-5 w-5 text-violet-400" />
              <span>Academic Focus</span>
            </h3>
            <div className="space-y-3 text-sm">
              <div className="space-y-1 border-b border-slate-800 pb-3">
                <span className="text-slate-500 block text-xs">Subjects Taught:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {profile?.subjects && profile.subjects.length > 0 ? (
                    profile.subjects.map((sub, idx) => (
                      <span key={idx} className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] px-2 py-0.5 rounded-md font-semibold">
                        {sub}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-600 text-xs">None specified</span>
                  )}
                </div>
              </div>
              <div className="space-y-1 border-b border-slate-800 pb-3">
                <span className="text-slate-500 block text-xs">Classes/Grades Taught:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {profile?.classes && profile.classes.length > 0 ? (
                    profile.classes.map((cls, idx) => (
                      <span key={idx} className="bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[10px] px-2 py-0.5 rounded-md font-semibold">
                        {cls}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-600 text-xs">None specified</span>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 flex items-center gap-1 text-xs">
                  <MapPin className="h-3.5 w-3.5 text-rose-500" /> Coordinates:
                </span>
                <div className="flex justify-between text-xs font-mono text-slate-400 mt-1">
                  <span>Lat: {user?.location?.coordinates?.[1]?.toFixed(5) || 'N/A'}</span>
                  <span>Lng: {user?.location?.coordinates?.[0]?.toFixed(5) || 'N/A'}</span>
                </div>
                <p className="text-slate-400 text-xs truncate mt-2 font-medium" title={user?.address}>
                  Address: <span className="font-semibold text-slate-300">{user?.address || 'None'}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Schedule Quick Action */}
          <div className="bg-violet-950/20 border border-violet-900/30 p-6 rounded-2xl flex flex-col justify-between shadow-lg shadow-violet-950/30">
            <div>
              <h3 className="font-semibold text-violet-300 mb-2 flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Availability Scheduler</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Configure your daily time slots and days of availability so students can select compatible slots during recommendation matching.
              </p>
              {profile?.availability && profile.availability.length > 0 && (
                <div className="space-y-1 mt-2">
                  <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Active Days Scheduled:</p>
                  <div className="flex flex-wrap gap-1">
                    {profile.availability.map((av, idx) => (
                      <span key={idx} className="bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                        {av.day.substring(0, 3)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link
              to="/tutor-dashboard/schedule"
              className="w-full bg-violet-600 hover:bg-violet-500 text-white text-center py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md shadow-violet-700/20 border border-violet-500"
            >
              Update Schedule
            </Link>
          </div>
        </div>
      )}

      {/* Requests Status Quick Link */}
      {!isEditing && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-violet-500/10 text-violet-400 p-3 rounded-xl border border-violet-500/20">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200 text-base">Booking Requests & Approval Queue</h3>
              <p className="text-xs text-slate-400">Review student requests, update statuses (Accept/Reject), and track completed lessons.</p>
            </div>
          </div>
          <Link
            to="/tutor-dashboard/requests"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-center py-2.5 px-6 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md shadow-indigo-600/15 border border-indigo-500 w-full sm:w-auto"
          >
            Review Requests
          </Link>
        </div>
      )}
    </div>
  );
}
