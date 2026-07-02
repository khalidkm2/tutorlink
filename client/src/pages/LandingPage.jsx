import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, MapPin, Sparkles, Shield, Star, Users } from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();

  const areas = [
    "Basantapur, Kathmandu", "Thamel, Kathmandu", "Baneshwor, Kathmandu", "Koteshwor, Kathmandu",
    "Gongabu, Kathmandu", "Balaju, Kathmandu", "Kalanki, Kathmandu", "Swayambhu, Kathmandu",
    "Boudha, Kathmandu", "Chabahil, Kathmandu", "Jorpati, Kathmandu", "Patan (Lalitpur)",
    "Jawalakhel, Lalitpur", "Bhaktapur", "Pokhara", "Bharatpur, Chitwan", "Biratnagar", "Butwal",
  ];

  return (
    <div className="min-h-screen bg-[#FBFAF7] text-stone-800 flex flex-col font-sans">
      {/* Header / Navigation */}
      <header className="border-b border-stone-200 bg-[#FBFAF7]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="bg-teal-700 p-2 rounded-lg text-white transition-transform duration-300 group-hover:rotate-6">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="flex flex-col leading-tight">
              <span className="text-xl font-bold tracking-tight text-stone-900">
                TutorLink Nepal
              </span>
              <span className="text-[11px] text-stone-400 -mt-0.5">ट्युटर लिंक नेपाल</span>
            </span>
          </div>

          <nav className="flex items-center space-x-1">
            {isAuthenticated ? (
              <Link
                to={
                  user?.role === 'admin'
                    ? '/admin-dashboard'
                    : user?.role === 'tutor'
                    ? '/tutor-dashboard'
                    : '/student-dashboard'
                }
                className="bg-teal-700 hover:bg-teal-800 text-white px-4 sm:px-5 py-2 rounded-lg font-medium text-sm transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="relative text-stone-600 hover:text-stone-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 after:content-[''] after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-px after:bg-teal-700 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-teal-700 hover:bg-teal-800 text-white px-4 sm:px-5 py-2 rounded-lg font-medium text-sm transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Join as Student/Tutor
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-28 lg:pb-24 flex-grow">
        <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-amber-100/50 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[380px] h-[380px] bg-teal-100/60 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-white border border-amber-200 px-3 py-1 rounded-full text-amber-700 text-xs font-semibold tracking-wide uppercase mb-6 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Home tutors &amp; online tutors, matched by location</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6 text-stone-900">
            Find the right tutor,{' '}
            <span className="relative inline-block text-teal-700">
              close to home.
              <svg className="absolute left-0 -bottom-2 w-full h-3 text-amber-300" viewBox="0 0 300 12" preserveAspectRatio="none">
                <path d="M2 9 Q 150 -2 298 9" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="text-stone-500 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Tell us your subject, level and area — from Baneshwor to Butwal — and we'll show you tutors nearest to you, sorted by real distance, not guesswork.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-teal-700 hover:bg-teal-800 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-md shadow-teal-900/10 hover:shadow-lg hover:shadow-teal-900/15 hover:-translate-y-0.5"
            >
              Find Tutors Near Me
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5"
            >
              Log in to Account
            </Link>
          </div>

          {/* Hero Stats (from source content) */}
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            <div className="border-l-2 border-amber-400 pl-4 text-left">
              <div className="text-2xl font-bold text-stone-900">500+</div>
              <div className="text-xs text-stone-400">Verified tutors</div>
            </div>
            <div className="border-l-2 border-amber-400 pl-4 text-left">
              <div className="text-2xl font-bold text-stone-900">20+</div>
              <div className="text-xs text-stone-400">Areas covered</div>
            </div>
            <div className="border-l-2 border-amber-400 pl-4 text-left">
              <div className="text-2xl font-bold text-stone-900">SEE–Bachelor</div>
              <div className="text-xs text-stone-400">Levels taught</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars Section */}
      <section className="bg-white border-t border-b border-stone-200 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-stone-900 mb-4">
              Designed For High-Performance Matching
            </h2>
            <p className="text-stone-500">
              Thoughtful algorithms and manual review keep every match relevant, nearby, and trustworthy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="group bg-[#FBFAF7] border border-stone-200 p-8 rounded-2xl transition-all duration-300 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-900/5 hover:-translate-y-1">
              <div className="bg-teal-700 text-white p-3 rounded-xl inline-block mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">Haversine Distance Matching</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Calculates actual physical distance based on earth radius rather than flat approximations. Keeps commutes short and direct.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group bg-[#FBFAF7] border border-stone-200 p-8 rounded-2xl transition-all duration-300 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-900/5 hover:-translate-y-1">
              <div className="bg-amber-500 text-white p-3 rounded-xl inline-block mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">K-Means Clustering</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Groups tutors dynamically on hourly fees, rating, and experience to construct highly optimal match spaces.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group bg-[#FBFAF7] border border-stone-200 p-8 rounded-2xl transition-all duration-300 hover:border-stone-400 hover:shadow-lg hover:shadow-stone-900/5 hover:-translate-y-1">
              <div className="bg-stone-800 text-white p-3 rounded-xl inline-block mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">Verified Academic Quality</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Tutor credentials are reviewed and approved manually by administrators before entering the catalog.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section (from source content) */}
      <section className="py-16 lg:py-24 bg-[#FBFAF7] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-stone-900 mb-2">How it works</h2>
            <p className="text-stone-500">Three steps, from request to your first class.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="transition-transform duration-300 hover:-translate-y-1">
              <div className="font-serif text-4xl font-bold text-amber-500 mb-3">01</div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">Tell us what you need</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Pick your area, subject and level — for a school student, +2, or bachelor's course.
              </p>
            </div>
            <div className="transition-transform duration-300 hover:-translate-y-1">
              <div className="font-serif text-4xl font-bold text-amber-500 mb-3">02</div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">We sort by distance</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Every tutor near your area shows up first, with real distance so you know who's actually close.
              </p>
            </div>
            <div className="transition-transform duration-300 hover:-translate-y-1">
              <div className="font-serif text-4xl font-bold text-amber-500 mb-3">03</div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">Request and connect</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Send a request to the tutor you like. They'll confirm timing and fee directly with you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Section (from source content) */}
      <section className="py-16 lg:py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 mb-2">Areas we cover</h2>
          <p className="text-stone-500 text-sm mb-8">Mostly Kathmandu Valley, growing outward.</p>
          <div className="flex flex-wrap gap-2.5">
            {areas.map((area) => (
              <span
                key={area}
                className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-[#FBFAF7] border border-stone-200 text-stone-600 transition-all duration-200 hover:border-teal-300 hover:text-teal-700 hover:-translate-y-0.5"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-12 bg-[#FBFAF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="transition-transform duration-300 hover:-translate-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-teal-700 mb-1">99.8%</div>
            <div className="text-xs sm:text-sm uppercase tracking-wider text-stone-400 font-semibold">Match Accuracy</div>
          </div>
          <div className="transition-transform duration-300 hover:-translate-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-600 mb-1">&lt; 5km</div>
            <div className="text-xs sm:text-sm uppercase tracking-wider text-stone-400 font-semibold">Average Match Distance</div>
          </div>
          <div className="transition-transform duration-300 hover:-translate-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-stone-700 mb-1">24/7</div>
            <div className="text-xs sm:text-sm uppercase tracking-wider text-stone-400 font-semibold">Dashboard Management</div>
          </div>
          <div className="transition-transform duration-300 hover:-translate-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-teal-800 mb-1">100%</div>
            <div className="text-xs sm:text-sm uppercase tracking-wider text-stone-400 font-semibold">Data Privacy</div>
          </div>
        </div>
      </section>

      {/* Become a Tutor CTA Strip (from source content) */}
      <section className="py-14 bg-teal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1.5">Tutoring already? List yourself here.</h2>
            <p className="text-teal-100 text-sm max-w-md">
              Set your subjects, area and rate. Students in your neighbourhood find you first.
            </p>
          </div>
          <Link
            to="/register"
            className="whitespace-nowrap bg-white hover:bg-amber-50 text-teal-800 px-7 py-3 rounded-full font-semibold text-sm transition-all duration-300 shadow-md hover:-translate-y-0.5"
          >
            Become a tutor
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-8 text-xs sm:text-sm text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-semibold text-stone-700">TutorLink Nepal</span>
          <div className="flex space-x-6">
            <span className="hover:text-teal-700 cursor-pointer transition-colors duration-200">Find a Tutor</span>
            <span className="hover:text-teal-700 cursor-pointer transition-colors duration-200">Become a Tutor</span>
            <span className="hover:text-teal-700 cursor-pointer transition-colors duration-200">Contact</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 text-center sm:text-left text-[11px] text-stone-400">
          Built for students and tutors across Nepal. Distances shown are approximate straight-line estimates.
        </div>
      </footer>
    </div>
  );
}