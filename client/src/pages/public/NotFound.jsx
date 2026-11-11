import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ChevronLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
        <Trophy className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-white font-display">404 - OUT OF BOUNDS</h1>
      <p className="text-xs sm:text-sm text-slate-400 max-w-md">
        The sports fixture, facility, or scorecard you are looking for does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition"
      >
        Return to Home Pitch
      </Link>
    </div>
  );
};

export default NotFound;
