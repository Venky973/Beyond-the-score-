import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, Trophy, MapPin, User, Shield, Calendar } from 'lucide-react';
import api from '../../services/api';

const GlobalSearch = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query.trim())}`);
        if (res.data.success) {
          setResults(res.data.results);
        }
      } catch (err) {
        console.error('Search query error:', err);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const hasAnyResults =
    results &&
    (results.matches?.length > 0 ||
      results.turfs?.length > 0 ||
      results.players?.length > 0 ||
      results.teams?.length > 0 ||
      results.competitions?.length > 0);

  return (
    <div className="relative w-full max-w-2xl bg-sports-dark border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden z-50">
      {/* Search Input Bar */}
      <div className="flex items-center px-4 py-3 border-b border-slate-800 bg-slate-900/90">
        <Search className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search matches, sports turfs, players, teams, leagues..."
          className="w-full bg-transparent text-slate-100 placeholder-slate-400 focus:outline-none text-sm md:text-base"
        />
        {loading && <Loader2 className="w-4 h-4 text-orange-500 animate-spin mr-2" />}
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults(null);
            }}
            className="text-slate-400 hover:text-slate-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      <div className="max-h-[65vh] overflow-y-auto p-4 space-y-4">
        {loading && !results && (
          <div className="py-8 text-center text-slate-400 text-sm">
            Searching sports database...
          </div>
        )}

        {!loading && query && !hasAnyResults && (
          <div className="py-8 text-center text-slate-400 text-sm">
            No matches found for <span className="text-white font-medium">"{query}"</span>.
          </div>
        )}

        {/* Matches */}
        {results?.matches?.length > 0 && (
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-orange-400 mb-2 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" /> Matches & Scores
            </div>
            <div className="space-y-1.5">
              {results.matches.map((m) => (
                <div
                  key={m._id}
                  onClick={() => handleSelect(`/matches/${m._id}`)}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-850 hover:bg-slate-800 cursor-pointer transition border border-slate-800/80"
                >
                  <div>
                    <div className="text-sm font-medium text-white">{m.title}</div>
                    <div className="text-xs text-slate-400">
                      {m.sport.toUpperCase()} • {m.venue}
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-semibold uppercase ${
                      m.status === 'live'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : m.status === 'upcoming'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Turfs */}
        {results?.turfs?.length > 0 && (
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Sports Turfs & Arenas
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {results.turfs.map((t) => (
                <div
                  key={t._id}
                  onClick={() => handleSelect(`/turfs/${t._id}`)}
                  className="p-2.5 rounded-lg bg-slate-850 hover:bg-slate-800 cursor-pointer transition border border-slate-800/80 flex items-center gap-3"
                >
                  <img
                    src={t.images?.[0] || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=100'}
                    alt={t.name}
                    className="w-12 h-12 rounded object-cover flex-shrink-0"
                  />
                  <div className="overflow-hidden">
                    <div className="text-sm font-medium text-white truncate">{t.name}</div>
                    <div className="text-xs text-slate-400 truncate">{t.city} • ${t.rentalPricePerHour}/hr</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Players */}
        {results?.players?.length > 0 && (
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-sky-400 mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Athletes & Players
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {results.players.map((p) => (
                <div
                  key={p._id}
                  onClick={() => handleSelect(`/players/${p._id}`)}
                  className="p-2.5 rounded-lg bg-slate-850 hover:bg-slate-800 cursor-pointer transition border border-slate-800/80 flex items-center gap-3"
                >
                  <img
                    src={p.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={p.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-slate-700"
                  />
                  <div className="overflow-hidden">
                    <div className="text-sm font-medium text-white truncate">{p.name}</div>
                    <div className="text-xs text-slate-400 capitalize truncate">
                      {p.sport} • {p.position}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Teams & Competitions */}
        {results?.teams?.length > 0 && (
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Teams
            </div>
            <div className="flex flex-wrap gap-2">
              {results.teams.map((tm) => (
                <div
                  key={tm._id}
                  onClick={() => handleSelect(`/teams/${tm._id}`)}
                  className="px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 cursor-pointer transition border border-slate-800 text-xs text-slate-200 flex items-center gap-2"
                >
                  <span className="font-semibold text-white">{tm.name}</span>
                  <span className="text-slate-400 capitalize">({tm.sport})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearch;
