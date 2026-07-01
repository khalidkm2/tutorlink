import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, MapPin, Sparkles, Shield, Star, Users } from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Header / Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              TutorLink
            </span>
          </div>

          <nav className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link
                to={
                  user?.role === 'admin'
                    ? '/admin-dashboard'
                    : user?.role === 'tutor'
                    ? '/tutor-dashboard'
                    : '/student-dashboard'
                }
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 sm:px-5 py-2 rounded-lg font-medium text-sm transition-all duration-300 shadow-lg shadow-indigo-600/20"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 sm:px-5 py-2 rounded-lg font-medium text-sm transition-all duration-300 shadow-lg shadow-indigo-600/20"
                >
                  Join as Student/Tutor
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24 flex-grow">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-slate-800/80 border border-slate-700/60 px-3 py-1 rounded-full text-indigo-400 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Smart Recommendations & Geospatial Clustering</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6">
            Find the Perfect Tutor{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              Right Around the Corner
            </span>
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Our CS-powered matching system combines K-Means clustering, physical distance calculations, and multi-criteria weighted scoring to match you with top-rated tutors near you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-xl shadow-indigo-600/30 hover:scale-[1.02]"
            >
              Get Started Now
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
            >
              Log in to Account
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Pillars Section */}
      <section className="bg-slate-950 border-t border-slate-800 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
              Designed For High-Performance Matching
            </h2>
            <p className="text-slate-400">
              Advanced algorithms and security guardrails ensure the highest quality experience for students, parents, and tutors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl relative hover:border-slate-700 transition-colors">
              <div className="bg-indigo-600/10 text-indigo-400 p-3 rounded-xl inline-block mb-6">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Haversine Distance Matching</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Calculates actual physical distance based on earth radius rather than flat approximations. Keeps commutes short and direct.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl relative hover:border-slate-700 transition-colors">
              <div className="bg-violet-600/10 text-violet-400 p-3 rounded-xl inline-block mb-6">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">K-Means Clustering</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Groups tutors dynamically on hourly fees, rating, teaching experiences, and coordinates to construct highly optimal tutor match spaces.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl relative hover:border-slate-700 transition-colors">
              <div className="bg-pink-600/10 text-pink-400 p-3 rounded-xl inline-block mb-6">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Verified Academic Quality</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Tutor credentials are reviewed and approved manually by administrators prior to entering the recommendation system catalog.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="border-t border-slate-800 py-12 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400 mb-1">99.8%</div>
            <div className="text-xs sm:text-sm uppercase tracking-wider text-slate-500 font-semibold">Match Accuracy</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-violet-400 mb-1">&lt; 5km</div>
            <div className="text-xs sm:text-sm uppercase tracking-wider text-slate-500 font-semibold">Average Match Distance</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-pink-400 mb-1">24/7</div>
            <div className="text-xs sm:text-sm uppercase tracking-wider text-slate-500 font-semibold">Dashboard Management</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mb-1">100%</div>
            <div className="text-xs sm:text-sm uppercase tracking-wider text-slate-500 font-semibold">Data Privacy</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-center text-xs sm:text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>&copy; {new Date().getFullYear()} TutorLink. Final Year Computer Science Project.</div>
          <div className="flex space-x-6">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
