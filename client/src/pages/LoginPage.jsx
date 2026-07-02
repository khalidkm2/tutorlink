import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, KeyRound, Mail, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Field-level error messages
  const [errors, setErrors] = useState({});
  // General form error message
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    // Email validate
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validate
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
    try {
      const res = await login(email, password);
      if (res.success) {
        // Route to the appropriate dashboard depending on role
        if (res.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (res.role === 'tutor') {
          navigate('/tutor-dashboard');
        } else {
          navigate('/student-dashboard');
        }
      } else {
        setErrorMessage(res.error || 'Invalid email or password');
      }
    } catch (err) {
      setErrorMessage('An unexpected connection error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFAF7] text-stone-800 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-100/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-100/50 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xl shadow-stone-900/5 relative z-10">
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center space-x-2 mb-3 group">
            <div className="bg-teal-700 p-2.5 rounded-xl text-white transition-transform duration-300 group-hover:rotate-6">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-stone-900">
              TutorLink
            </span>
          </Link>
          <p className="text-stone-500 text-sm">Welcome back! Please enter your details</p>
        </div>

        {/* General Error Alert */}
        {errorMessage && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-xl flex items-start space-x-2 text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className={`absolute inset-y-0 left-0 flex items-center pl-3 transition-colors duration-200 ${errors.email ? 'text-red-500' : 'text-stone-400'}`}>
                <Mail className="h-5 w-5" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                placeholder="you@example.com"
                className={`w-full bg-[#FBFAF7] border rounded-xl py-3 pl-10 pr-4 text-stone-800 placeholder-stone-400 focus:outline-none transition-colors duration-200 text-sm ${
                  errors.email 
                    ? 'border-red-400 focus:border-red-400' 
                    : 'border-stone-300 focus:border-teal-600'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center space-x-1">
                <AlertCircle className="h-3 w-3 mr-1 inline" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
              Password
            </label>
            <div className="relative">
              <span className={`absolute inset-y-0 left-0 flex items-center pl-3 transition-colors duration-200 ${errors.password ? 'text-red-500' : 'text-stone-400'}`}>
                <KeyRound className="h-5 w-5" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                }}
                placeholder="••••••••"
                className={`w-full bg-[#FBFAF7] border rounded-xl py-3 pl-10 pr-4 text-stone-800 placeholder-stone-400 focus:outline-none transition-colors duration-200 text-sm ${
                  errors.password 
                    ? 'border-red-400 focus:border-red-400' 
                    : 'border-stone-300 focus:border-teal-600'
                }`}
              />
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center space-x-1">
                <AlertCircle className="h-3 w-3 mr-1 inline" />
                <span>{errors.password}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 hover:bg-teal-800 text-white py-3.5 px-4 rounded-xl font-semibold transition-all duration-300 shadow-md shadow-teal-900/10 hover:shadow-lg hover:shadow-teal-900/15 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Bottom Link */}
        <p className="mt-8 text-center text-sm text-stone-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-teal-700 hover:text-teal-800 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}