import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, MapPin, Shield, Plus, ArrowRight, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CompetitionsList = () => {
  const { isOrganizer, isAdmin } = useAuth();
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sportFilter, setSportFilter] = useState('all');

  useEffect(() => {
    const fetchCompetitions = async () => {
      setLoading(true);
      try {
        let url = '/competitions';
        if (sportFilter !== 'all') url += `?sport=${sportFilter}`;
        const res = await api.get(url);
        if (res.data.success) {
          setCompetitions(res.data.competitions);
        }
      } catch (err) {
        console.error('Failed to load competitions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, [sportFilter]);

  const sports = ['all', 'cricket', 'football', 'basketball', 'tennis', 'badminton'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block mb-1">
            Tournament Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-wide uppercase">
            Official Competitions & Leagues
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse international, national, domestic, and state-level sporting tournaments.
          </p>
        </div>

        {(isOrganizer || isAdmin) && (
          <Link
            to="/organizer/create-competition"
            className="self-start sm:self-auto px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-md shadow-orange-600/30"
          >
            <Plus className="w-4 h-4" /> Create League
          </Link>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {sports.map((sp) => (
          <button
            key={sp}
            onClick={() => setSportFilter(sp)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap capitalize transition ${
              sportFilter === sp
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {sp === 'all' ? 'All Sports' : sp}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          <Loader2 className="w-6 h-6 text-purple-500 animate-spin mx-auto mb-2" />
          Loading tournaments & leagues...
        </div>
      ) : competitions.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-xs space-y-2">
          <Trophy className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="font-semibold text-slate-300">No competitions found for this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitions.map((c) => (
            <div
              key={c._id}
              className="bg-slate-850 border border-slate-750 hover:border-purple-500/50 rounded-2xl p-6 transition flex flex-col justify-between group shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950/40 border border-purple-500/30 px-2 py-0.5 rounded">
                    {c.sport} • {c.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">{c.season}</span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition line-clamp-1">
                  {c.name}
                </h3>

                {c.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>
                )}

                {c.venue && (
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span>{c.venue}</span>
                  </p>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">
                  Status: <b className="text-emerald-400">{c.status}</b>
                </span>
                <Link
                  to={`/matches?competition=${c._id}`}
                  className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1"
                >
                  View Fixtures <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompetitionsList;
