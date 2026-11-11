import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Search, Trophy, Users, ArrowRight, Loader2 } from 'lucide-react';
import api from '../../services/api';

const TeamsList = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sportFilter, setSportFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchTeams = async () => {
    setLoading(true);
    try {
      let url = '/teams';
      const params = [];
      if (sportFilter !== 'all') params.push(`sport=${sportFilter}`);
      if (search.trim()) params.push(`search=${encodeURIComponent(search.trim())}`);
      if (params.length > 0) url += `?${params.join('&')}`;

      const res = await api.get(url);
      if (res.data.success) {
        setTeams(res.data.teams);
      }
    } catch (err) {
      console.error('Failed to load teams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [sportFilter]);

  const sports = ['all', 'cricket', 'football', 'basketball'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
            Franchises & Clubs
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-wide uppercase">
            Registered Teams & Rosters
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse competing teams, track win-loss records, and discover star captains and managers.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-850 p-3 rounded-xl border border-slate-750">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {sports.map((sp) => (
            <button
              key={sp}
              onClick={() => setSportFilter(sp)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap capitalize transition ${
                sportFilter === sp
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {sp === 'all' ? 'All Sports' : sp}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchTeams();
          }}
          className="relative max-w-xs w-full"
        >
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search teams by name or city..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </form>
      </div>

      {/* Teams Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          <Loader2 className="w-6 h-6 text-amber-500 animate-spin mx-auto mb-2" />
          Loading sports clubs and rosters...
        </div>
      ) : teams.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-xs">
          No teams found matching this criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((tm) => (
            <div
              key={tm._id}
              className="bg-slate-850 border border-slate-750 hover:border-amber-500/50 rounded-2xl p-6 transition flex flex-col justify-between group shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={
                        tm.logo ||
                        'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100'
                      }
                      alt={tm.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-slate-700 bg-slate-900 group-hover:border-amber-500 transition"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded">
                        {tm.sport}
                      </span>
                      <h3 className="font-bold text-base text-white mt-1 group-hover:text-amber-400 transition">
                        {tm.name}
                      </h3>
                      <p className="text-xs text-slate-400">{tm.city || 'Regional Club'}</p>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-750">
                    {tm.shortName}
                  </span>
                </div>

                {/* Record Matrix */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Played</span>
                    <span className="font-bold text-white text-sm">{tm.stats?.matches || 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Wins</span>
                    <span className="font-bold text-emerald-400 text-sm">{tm.stats?.wins || 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Losses</span>
                    <span className="font-bold text-red-400 text-sm">{tm.stats?.losses || 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Points</span>
                    <span className="font-bold text-amber-400 text-sm">{tm.stats?.points || 0}</span>
                  </div>
                </div>

                {/* Captain / Coach */}
                <div className="text-xs text-slate-400 space-y-1">
                  {tm.captain && (
                    <div>
                      Captain: <b className="text-white font-medium">{tm.captain}</b>
                    </div>
                  )}
                  {tm.coach && (
                    <div>
                      Head Coach: <b className="text-slate-300 font-medium">{tm.coach}</b>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Official Franchise</span>
                <Link
                  to={`/matches?search=${encodeURIComponent(tm.name)}`}
                  className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1"
                >
                  View Matches <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamsList;
