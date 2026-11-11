import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileSpreadsheet, Plus, Share2, Globe, Lock, EyeOff, Search } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ScorecardsList = () => {
  const { isAuthenticated } = useAuth();
  const [tab, setTab] = useState(isAuthenticated ? 'my' : 'public');
  const [scorecards, setScorecards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchScorecards = async () => {
    setLoading(true);
    try {
      const endpoint = tab === 'my' ? '/scorecards/my-scorecards' : '/scorecards/public';
      const res = await api.get(endpoint);
      if (res.data.success) {
        setScorecards(res.data.scorecards);
      }
    } catch (err) {
      console.error('Failed to load scorecards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScorecards();
  }, [tab]);

  const filtered = scorecards.filter((sc) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      sc.title.toLowerCase().includes(q) ||
      sc.teamA?.name.toLowerCase().includes(q) ||
      sc.teamB?.name.toLowerCase().includes(q) ||
      sc.sport.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400 block mb-1">
            Grassroots & Custom Fixtures
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-wide uppercase">
            Custom Match Scorecards
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build and publish dynamic scorecards for friendly fixtures, community leagues, and amateur tournaments.
          </p>
        </div>

        <Link
          to="/scorecards/create"
          className="self-start md:self-auto px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-md shadow-orange-600/30"
        >
          <Plus className="w-4 h-4" /> Create Scorecard
        </Link>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          {isAuthenticated && (
            <button
              onClick={() => setTab('my')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                tab === 'my'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              My Scorecards
            </button>
          )}
          <button
            onClick={() => setTab('public')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              tab === 'public'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Public Community Matches
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scorecards..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          Loading custom match scorecards...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-xs space-y-3">
          <FileSpreadsheet className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="font-semibold text-slate-300">No scorecards found.</p>
          <Link
            to="/scorecards/create"
            className="inline-block px-4 py-2 rounded-lg bg-orange-600 text-white text-xs font-bold"
          >
            Create Your First Scorecard
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((sc) => (
            <Link
              key={sc._id}
              to={`/scorecards/${sc._id}`}
              className="block bg-slate-850 hover:bg-slate-800 border border-slate-700/80 hover:border-orange-500/50 rounded-xl p-5 transition group shadow-lg"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {sc.sport}
                </span>
                <span className="text-slate-400 capitalize">{sc.matchType.replace('_', ' ')}</span>
              </div>

              <div className="py-3">
                <h3 className="font-bold text-base text-white group-hover:text-orange-400 transition line-clamp-1">
                  {sc.title}
                </h3>
                <div className="mt-3 flex items-center justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-xs">
                  <div className="truncate pr-2">
                    <span className="text-white font-semibold">{sc.teamA.name}: </span>
                    <span className="text-orange-400 font-bold">{sc.teamA.scoreDisplay}</span>
                  </div>
                  <div className="truncate pl-2 border-l border-slate-800">
                    <span className="text-white font-semibold">{sc.teamB.name}: </span>
                    <span className="text-sky-400 font-bold">{sc.teamB.scoreDisplay}</span>
                  </div>
                </div>
              </div>

              {sc.result?.margin && (
                <p className="text-xs text-emerald-400 font-medium truncate mt-1">
                  {sc.result.margin}
                </p>
              )}

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>{new Date(sc.matchDate).toLocaleDateString()}</span>
                <span className="flex items-center gap-1 font-semibold text-orange-400">
                  View Full Scorecard →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScorecardsList;
