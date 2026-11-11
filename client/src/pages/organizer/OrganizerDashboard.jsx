import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Sliders,
  Plus,
  Calendar,
  Activity,
  Shield,
  ArrowRight,
  Loader2
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizerData = async () => {
      try {
        const [mRes, cRes] = await Promise.all([
          api.get('/matches?limit=20'),
          api.get('/competitions')
        ]);
        if (mRes.data.success) setMatches(mRes.data.matches);
        if (cRes.data.success) setCompetitions(cRes.data.competitions);
      } catch (err) {
        console.error('Failed to load organizer data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizerData();
  }, []);

  const liveMatches = matches.filter((m) => m.status === 'live');
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming');
  const completedMatches = matches.filter((m) => m.status === 'completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block mb-1">
            Tournament Director & Match Official Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-wide uppercase">
            Organizer Management Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage sporting tournaments, schedule fixtures, and operate real-time live score consoles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/organizer/create-competition"
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Trophy className="w-4 h-4 text-purple-400" /> New Competition
          </Link>
          <Link
            to="/organizer/create-match"
            className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-md shadow-orange-600/20"
          >
            <Plus className="w-4 h-4" /> Schedule Match
          </Link>
        </div>
      </div>

      {/* Analytics Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-850 p-5 rounded-xl border border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Active Competitions
          </span>
          <span className="text-3xl font-black text-white font-display mt-1 block">
            {competitions.length}
          </span>
        </div>
        <div className="bg-slate-850 p-5 rounded-xl border border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-red-400 block flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-live-dot" /> Live Matches
          </span>
          <span className="text-3xl font-black text-white font-display mt-1 block">
            {liveMatches.length}
          </span>
        </div>
        <div className="bg-slate-850 p-5 rounded-xl border border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400 block">
            Upcoming Fixtures
          </span>
          <span className="text-3xl font-black text-white font-display mt-1 block">
            {upcomingMatches.length}
          </span>
        </div>
        <div className="bg-slate-850 p-5 rounded-xl border border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
            Completed Games
          </span>
          <span className="text-3xl font-black text-white font-display mt-1 block">
            {completedMatches.length}
          </span>
        </div>
      </div>

      {/* Matches Overview Table */}
      <div className="bg-slate-850 rounded-2xl border border-slate-750 overflow-hidden shadow-xl space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-orange-400" /> Managed Fixtures & Scorer Links
          </h3>
          <Link to="/matches" className="text-xs text-orange-400 hover:underline">
            View Public Board →
          </Link>
        </div>

        {matches.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No fixtures created yet. Schedule your first match above.
          </div>
        ) : (
          <div className="divide-y divide-slate-800 text-xs">
            {matches.map((m) => (
              <div
                key={m._id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/40 px-2 rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {m.sport}
                    </span>
                    <span className="font-bold text-white text-sm">
                      {m.teamA.name} vs {m.teamB.name}
                    </span>
                  </div>
                  <div className="text-slate-400 text-xs flex items-center gap-3">
                    <span>Score: <b className="text-orange-400 font-mono">{m.teamA.scoreDisplay}</b> - <b className="text-sky-400 font-mono">{m.teamB.scoreDisplay}</b></span>
                    <span>•</span>
                    <span>{m.matchProgress}</span>
                    <span>•</span>
                    <span>{m.venue}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      m.status === 'live'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : m.status === 'upcoming'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {m.status}
                  </span>

                  <Link
                    to={`/matches/${m._id}`}
                    className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition flex items-center gap-1 shadow-md shadow-orange-600/20"
                  >
                    <Sliders className="w-3.5 h-3.5" /> Scorer Console
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
