import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Calendar,
  MapPin,
  FileSpreadsheet,
  Users,
  Activity,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import MatchCard from '../../components/scoring/MatchCard';

const UserDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/users/dashboard');
        if (res.data.success) {
          setDashboard(res.data.dashboard);
        }
      } catch (err) {
        console.error('Failed to load user dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400 text-xs">
        Loading personal sports dashboard...
      </div>
    );
  }

  const upcomingBookings = dashboard?.upcomingBookings || [];
  const recentScorecards = dashboard?.recentScorecards || [];
  const liveMatches = dashboard?.liveMatches || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sports-dark via-slate-900 to-slate-850 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={
              user?.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
            }
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-500/50 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                Personal Sports Hub
              </span>
              <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                {user?.role}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Preferred Sports:{' '}
              <span className="text-white font-medium">
                {user?.preferredSports?.join(', ') || 'Cricket, Football'}
              </span>
            </p>
          </div>
        </div>

        {/* Quick action shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/turfs"
            className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
          >
            <MapPin className="w-3.5 h-3.5" /> Book a Turf
          </Link>
          <Link
            to="/scorecards/create"
            className="px-4 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-md shadow-orange-600/20"
          >
            <Plus className="w-3.5 h-3.5" /> New Scorecard
          </Link>
        </div>
      </div>

      {/* 2-Column Section: Upcoming Bookings & Recent Scorecards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Turf Bookings */}
        <div className="bg-slate-850 p-6 rounded-2xl border border-slate-750 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" /> Upcoming Turf Reservations
            </h3>
            <Link to="/bookings/my" className="text-xs text-orange-400 hover:underline">
              View All
            </Link>
          </div>

          {upcomingBookings.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs space-y-2">
              <p>You have no active turf bookings scheduled.</p>
              <Link to="/turfs" className="text-emerald-400 font-semibold hover:underline block">
                Find available turfs nearby →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((b) => (
                <div
                  key={b._id}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-sm text-white block">{b.turf?.name}</span>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>{b.bookingDate}</span>
                      <span>•</span>
                      <span className="font-mono text-emerald-400">
                        {b.startTime} - {b.endTime}
                      </span>
                      <span>•</span>
                      <span>{b.sport}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded ${
                      b.status === 'confirmed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Custom Scorecards */}
        <div className="bg-slate-850 p-6 rounded-2xl border border-slate-750 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-orange-400" /> My Custom Scorecards
            </h3>
            <Link to="/scorecards" className="text-xs text-orange-400 hover:underline">
              View All
            </Link>
          </div>

          {recentScorecards.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs space-y-2">
              <p>You haven't recorded any custom scorecards yet.</p>
              <Link to="/scorecards/create" className="text-orange-400 font-semibold hover:underline block">
                Create friendly match scorecard →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentScorecards.map((sc) => (
                <Link
                  key={sc._id}
                  to={`/scorecards/${sc._id}`}
                  className="block p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white truncate max-w-[200px]">{sc.title}</span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase bg-slate-800 px-2 py-0.5 rounded">
                      {sc.sport}
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-mono text-slate-300 flex justify-between">
                    <span>{sc.teamA.name}: <b className="text-orange-400">{sc.teamA.scoreDisplay}</b></span>
                    <span>{sc.teamB.name}: <b className="text-sky-400">{sc.teamB.scoreDisplay}</b></span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Live Matches in Preferred Sports */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white font-display uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-500" /> Live Matches In Your Sports
          </h2>
          <Link to="/matches?status=live" className="text-xs font-semibold text-orange-400 hover:underline">
            All Live Matches →
          </Link>
        </div>

        {liveMatches.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
            No live games right now in your preferred sports categories.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {liveMatches.map((m) => (
              <MatchCard key={m._id} match={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
