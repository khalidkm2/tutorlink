import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, User, Mail, KeyRound, MapPin, Loader2, AlertCircle, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('student'); // 'student' | 'tutor'
  
  // General states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  
  // Student Specific states
  const [classGrade, setClassGrade] = useState('');
  const [schoolName, setSchoolName] = useState('');

  // Tutor Specific states
  const [subjects, setSubjects] = useState('');
  const [classes, setClasses] = useState('');
  const [hourlyFee, setHourlyFee] = useState('');
  const [experience, setExperience] = useState('');
  const [qualifications, setQualifications] = useState('');

  // Errors state
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Helper to fetch current location coordinates from browser GPS
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser');
      return;
    }
    
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        // Clear previous coordinates errors
        setErrors(prev => ({ ...prev, latitude: '', longitude: '' }));
        setLoading(false);
      },
      (error) => {
        setErrorMessage('Unable to retrieve your GPS coordinates. Please enter them manually.');
        setLoading(false);
      }
    );
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 1. Account Info Validation
    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // 2. Geospatial Location Validation
    if (!address.trim()) {
      newErrors.address = 'Street address is required';
    } else if (address.trim().length < 5) {
      newErrors.address = 'Address must be at least 5 characters';
    }

    const latFloat = parseFloat(latitude);
    const lngFloat = parseFloat(longitude);

    if (latitude === '') {
      newErrors.latitude = 'Latitude is required';
    } else if (isNaN(latFloat) || latFloat < -90 || latFloat > 90) {
      newErrors.latitude = 'Latitude must be a valid float between -90 and 90';
    }

    if (longitude === '') {
      newErrors.longitude = 'Longitude is required';
    } else if (isNaN(lngFloat) || lngFloat < -180 || lngFloat > 180) {
      newErrors.longitude = 'Longitude must be a valid float between -180 and 180';
    }

    // 3. Role-Specific Validation
    if (role === 'student') {
      if (!classGrade.trim()) {
        newErrors.classGrade = 'Class grade is required';
      }
    } else if (role === 'tutor') {
      if (!subjects.trim()) {
        newErrors.subjects = 'At least one subject is required';
      }
      if (!classes.trim()) {
        newErrors.classes = 'Target classes/grades are required';
      }

      const feeFloat = parseFloat(hourlyFee);
      if (hourlyFee === '') {
        newErrors.hourlyFee = 'Hourly fee rate is required';
      } else if (isNaN(feeFloat) || feeFloat < 0) {
        newErrors.hourlyFee = 'Hourly fee must be a positive number';
      }

      const expInt = parseInt(experience, 10);
      if (experience === '') {
        newErrors.experience = 'Years of experience is required';
      } else if (isNaN(expInt) || expInt < 0) {
        newErrors.experience = 'Experience must be a positive integer';
      }

      if (!qualifications.trim()) {
        newErrors.qualifications = 'Qualifications description is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setErrors({});

    // Client-side validation check
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    // Prepare coordinates array: [longitude, latitude] for GeoJSON
    const coords = [parseFloat(longitude), parseFloat(latitude)];

    // Prepare role-specific payloads
    const payload = {
      name: name.trim(),
      email,
      password,
      role,
      coordinates: coords,
      address: address.trim()
    };

    if (role === 'student') {
      payload.classGrade = classGrade.trim();
      payload.schoolName = schoolName.trim();
    } else {
      payload.subjects = subjects.split(',').map(s => s.trim()).filter(s => s !== '');
      payload.classes = classes.split(',').map(c => c.trim()).filter(c => c !== '');
      payload.hourlyFee = parseFloat(hourlyFee);
      payload.experience = parseInt(experience, 10);
      payload.qualifications = qualifications.trim();
      payload.availability = []; // Default empty schedule
    }

    try {
      const res = await register(payload);
      if (res.success) {
        if (res.role === 'tutor') {
          navigate('/tutor-dashboard');
        } else {
          navigate('/student-dashboard');
        }
      } else {
        setErrorMessage(res.error || 'Registration failed');
      }
    } catch (err) {
      setErrorMessage('An unexpected server error occurred. Please check network settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setErrorMessage('');
    setErrors({});
  };

  // Helper to clear error state on typing
  const handleInputChange = (field, setter, value) => {
    setter(value);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10 my-8">
        {/* Logo and title */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center space-x-2 mb-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              TutorLink
            </span>
          </Link>
          <p className="text-slate-400 text-sm">Join the next-generation tutor recommendation network</p>
        </div>

        {/* Tab Selector for User Role */}
        <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => handleRoleChange('student')}
            className={`py-3.5 px-4 rounded-lg font-bold text-sm transition-all duration-200 cursor-pointer ${
              role === 'student'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            I am a Student / Parent
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('tutor')}
            className={`py-3.5 px-4 rounded-lg font-bold text-sm transition-all duration-200 cursor-pointer ${
              role === 'tutor'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            I am a Tutor
          </button>
        </div>

        {/* General Error Alert */}
        {errorMessage && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-xl flex items-start space-x-2 text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* section 1 */}
          <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2 flex items-center space-x-2">
            <User className="h-5 w-5 text-indigo-400" />
            <span>1. Account Information</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleInputChange('name', setName, e.target.value)}
                placeholder="John Doe"
                className={`w-full bg-slate-950 border rounded-xl py-3 px-4 text-slate-200 placeholder-slate-700 focus:outline-none transition-colors text-sm ${
                  errors.name ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                }`}
              />
              {errors.name && <p className="mt-1.5 text-xs text-rose-400"><AlertCircle className="h-3 w-3 inline mr-1" />{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => handleInputChange('email', setEmail, e.target.value)}
                placeholder="john@example.com"
                className={`w-full bg-slate-950 border rounded-xl py-3 px-4 text-slate-200 placeholder-slate-700 focus:outline-none transition-colors text-sm ${
                  errors.email ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                }`}
              />
              {errors.email && <p className="mt-1.5 text-xs text-rose-400"><AlertCircle className="h-3 w-3 inline mr-1" />{errors.email}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => handleInputChange('password', setPassword, e.target.value)}
                placeholder="Min 6 characters"
                className={`w-full bg-slate-950 border rounded-xl py-3 px-4 text-slate-200 placeholder-slate-700 focus:outline-none transition-colors text-sm ${
                  errors.password ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                }`}
              />
              {errors.password && <p className="mt-1.5 text-xs text-rose-400"><AlertCircle className="h-3 w-3 inline mr-1" />{errors.password}</p>}
            </div>
          </div>

          {/* section 2 */}
          <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2 flex items-center space-x-2 pt-2">
            <MapPin className="h-5 w-5 text-indigo-400" />
            <span>2. Geospatial Location</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Physical Street Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => handleInputChange('address', setAddress, e.target.value)}
                placeholder="123 Main St, Kathmandu"
                className={`w-full bg-slate-950 border rounded-xl py-3 px-4 text-slate-200 placeholder-slate-700 focus:outline-none transition-colors text-sm ${
                  errors.address ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                }`}
              />
              {errors.address && <p className="mt-1.5 text-xs text-rose-400"><AlertCircle className="h-3 w-3 inline mr-1" />{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Longitude Coordinates
                </label>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => handleInputChange('longitude', setLongitude, e.target.value)}
                  placeholder="85.3240"
                  className={`w-full bg-slate-950 border rounded-xl py-3 px-4 text-slate-200 placeholder-slate-700 focus:outline-none transition-colors text-sm ${
                    errors.longitude ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />
                {errors.longitude && <p className="mt-1.5 text-xs text-rose-400"><AlertCircle className="h-3 w-3 inline mr-1" />{errors.longitude}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Latitude Coordinates
                </label>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => handleInputChange('latitude', setLatitude, e.target.value)}
                  placeholder="27.7172"
                  className={`w-full bg-slate-950 border rounded-xl py-3 px-4 text-slate-200 placeholder-slate-700 focus:outline-none transition-colors text-sm ${
                    errors.latitude ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />
                {errors.latitude && <p className="mt-1.5 text-xs text-rose-400"><AlertCircle className="h-3 w-3 inline mr-1" />{errors.latitude}</p>}
              </div>
            </div>

            <button
              type="button"
              onClick={handleGetLocation}
              disabled={loading}
              className="w-full bg-slate-800 hover:bg-slate-750 text-indigo-300 py-3 rounded-xl text-xs font-semibold border border-slate-700 hover:border-slate-600 transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Locating Coordinates...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Auto-Detect Current GPS Coordinates</span>
                </>
              )}
            </button>
          </div>

          {/* section 3 */}
          <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2 flex items-center space-x-2 pt-2">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            <span>3. Role-Specific Profile Info</span>
          </h3>

          {/* Student Specific Fields */}
          {role === 'student' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Class / Grade Level
                </label>
                <input
                  type="text"
                  value={classGrade}
                  onChange={(e) => handleInputChange('classGrade', setClassGrade, e.target.value)}
                  placeholder="e.g. Grade 10"
                  className={`w-full bg-slate-950 border rounded-xl py-3 px-4 text-slate-200 placeholder-slate-700 focus:outline-none transition-colors text-sm ${
                    errors.classGrade ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />
                {errors.classGrade && <p className="mt-1.5 text-xs text-rose-400"><AlertCircle className="h-3 w-3 inline mr-1" />{errors.classGrade}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  School Name
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => handleInputChange('schoolName', setSchoolName, e.target.value)}
                  placeholder="e.g. St. Xavier School"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 placeholder-slate-700 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                />
              </div>
            </div>
          )}

          {/* Tutor Specific Fields */}
          {role === 'tutor' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Subjects (comma separated)
                  </label>
                  <input
                    type="text"
                    value={subjects}
                    onChange={(e) => handleInputChange('subjects', setSubjects, e.target.value)}
                    placeholder="Mathematics, Physics, Chemistry"
                    className={`w-full bg-slate-950 border rounded-xl py-3 px-4 text-slate-200 placeholder-slate-700 focus:outline-none transition-colors text-sm ${
                      errors.subjects ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                    }`}
                  />
                  {errors.subjects && <p className="mt-1.5 text-xs text-rose-400"><AlertCircle className="h-3 w-3 inline mr-1" />{errors.subjects}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Target Classes (comma separated)
                  </label>
                  <input
                    type="text"
                    value={classes}
                    onChange={(e) => handleInputChange('classes', setClasses, e.target.value)}
                    placeholder="Grade 8, Grade 9, Grade 10"
                    className={`w-full bg-slate-950 border rounded-xl py-3 px-4 text-slate-200 placeholder-slate-700 focus:outline-none transition-colors text-sm ${
                      errors.classes ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                    }`}
                  />
                  {errors.classes && <p className="mt-1.5 text-xs text-rose-400"><AlertCircle className="h-3 w-3 inline mr-1" />{errors.classes}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Hourly Fee (USD)
                  </label>
                  <input
                    type="number"
                    value={hourlyFee}
                    onChange={(e) => handleInputChange('hourlyFee', setHourlyFee, e.target.value)}
                    placeholder="30"
                    className={`w-full bg-slate-950 border rounded-xl py-3 px-4 text-slate-200 placeholder-slate-700 focus:outline-none transition-colors text-sm ${
                      errors.hourlyFee ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                    }`}
                  />
                  {errors.hourlyFee && <p className="mt-1.5 text-xs text-rose-400"><AlertCircle className="h-3 w-3 inline mr-1" />{errors.hourlyFee}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={experience}
                    onChange={(e) => handleInputChange('experience', setExperience, e.target.value)}
                    placeholder="3"
                    className={`w-full bg-slate-950 border rounded-xl py-3 px-4 text-slate-200 placeholder-slate-700 focus:outline-none transition-colors text-sm ${
                      errors.experience ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                    }`}
                  />
                  {errors.experience && <p className="mt-1.5 text-xs text-rose-400"><AlertCircle className="h-3 w-3 inline mr-1" />{errors.experience}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Academic Qualifications
                </label>
                <textarea
                  rows="3"
                  value={qualifications}
                  onChange={(e) => handleInputChange('qualifications', setQualifications, e.target.value)}
                  placeholder="e.g. B.Sc. in Physics, Kathmandu University."
                  className={`w-full bg-slate-950 border rounded-xl py-3 px-4 text-slate-200 placeholder-slate-700 focus:outline-none transition-colors text-sm resize-none ${
                    errors.qualifications ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                  }`}
                />
                {errors.qualifications && <p className="mt-1.5 text-xs text-rose-400"><AlertCircle className="h-3 w-3 inline mr-1" />{errors.qualifications}</p>}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 px-4 rounded-xl font-bold transition-all duration-200 shadow-xl shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center space-x-2 mt-4 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Creating your account...</span>
              </>
            ) : (
              <span>Register Account</span>
            )}
          </button>
        </form>

        {/* Bottom Link */}
        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
