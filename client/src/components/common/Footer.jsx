import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Shield, MapPin, Activity, Heart, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-sports-dark border-t border-slate-800 text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-lg text-white font-display tracking-wider">
                BEYOND THE SCORE
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-400 max-w-sm">
              The premier integrated sports management system. Powering live real-time scoreboards,
              location-based sports turf discovery and booking, deep player analytics, and custom
              grassroots scorecard sharing.
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-850 border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Sports Engines Active
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-850 border border-slate-800">
                Socket.IO v4 Sync
              </span>
            </div>
          </div>

          {/* Sports Coverage */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Sports Coverage
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/matches?sport=cricket" className="hover:text-orange-400 transition">
                  Cricket Scores & Ball-by-Ball
                </Link>
              </li>
              <li>
                <Link to="/matches?sport=football" className="hover:text-orange-400 transition">
                  Football & Goals Timeline
                </Link>
              </li>
              <li>
                <Link to="/matches?sport=basketball" className="hover:text-orange-400 transition">
                  Basketball & Quarter Analytics
                </Link>
              </li>
              <li>
                <Link to="/matches?sport=badminton" className="hover:text-orange-400 transition">
                  Badminton Tournaments
                </Link>
              </li>
              <li>
                <Link to="/matches?sport=tennis" className="hover:text-orange-400 transition">
                  Tennis Grand Sets
                </Link>
              </li>
            </ul>
          </div>

          {/* Turfs & Facilities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Turfs & Arenas
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/turfs" className="hover:text-emerald-400 transition">
                  Discover Nearby Facilities
                </Link>
              </li>
              <li>
                <Link to="/turfs?sport=Football" className="hover:text-emerald-400 transition">
                  5-a-Side & 7-a-Side Pitches
                </Link>
              </li>
              <li>
                <Link to="/turfs?sport=Cricket" className="hover:text-emerald-400 transition">
                  Box Cricket Nets
                </Link>
              </li>
              <li>
                <Link to="/operator/register-turf" className="hover:text-emerald-400 transition flex items-center gap-1">
                  List Your Turf Arena <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link to="/bookings/my" className="hover:text-emerald-400 transition">
                  Manage Reservations
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Creators */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Community & Hub
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/scorecards/create" className="hover:text-orange-400 transition">
                  Create Custom Scorecard
                </Link>
              </li>
              <li>
                <Link to="/scorecards/public" className="hover:text-orange-400 transition">
                  Community Match Archives
                </Link>
              </li>
              <li>
                <Link to="/players/compare" className="hover:text-orange-400 transition">
                  Head-to-Head Athlete Compare
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-orange-400 transition">
                  Platform Architecture
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-400 transition">
                  Support & Verification
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} Beyond The Score. Full-Stack MERN Sports Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-400 transition">Privacy Policy</Link>
            <Link to="/about" className="hover:text-slate-400 transition">Terms of Service</Link>
            <Link to="/contact" className="hover:text-slate-400 transition">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
