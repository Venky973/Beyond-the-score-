import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Users, Search, ArrowRight, Trophy } from 'lucide-react';
import api from '../../services/api';
import PlayerCard from '../../components/player/PlayerCard';

const PlayersList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSport = searchParams.get('sport') || 'all';

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      let url = `/players?limit=40`;
      if (currentSport !== 'all') url += `&sport=${currentSport}`;
      if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;

      const res = await api.get(url);
      if (res.data.success) {
        setPlayers(res.data.players);
      }
    } catch (err) {
      console.error('Failed to load players:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [currentSport]);

  const sports = [
    { id: 'all', name: 'All Sports' },
    { id: 'cricket', name: 'Cricket' },
    { id: 'football', name: 'Football' },
    { id: 'basketball', name: 'Basketball' },
    { id: 'tennis', name: 'Tennis' }
  ];

  const handleSportChange = (sport) => {
    const params = new URLSearchParams(searchParams);
    if (sport === 'all') params.delete('sport');
    else params.set('sport', sport);
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400 block mb-1">
            Athlete Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-wide uppercase">
            Player Profiles & Career Statistics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse registered athletes, analyze their individual performance history, and perform head-to-head comparisons.
          </p>
        </div>

        <Link
          to="/players/compare"
          className="self-start md:self-auto px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-md shadow-orange-600/30"
        >
          <Trophy className="w-4 h-4" /> Head-to-Head Compare
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-850 p-3 rounded-xl border border-slate-750">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {sports.map((sp) => (
            <button
              key={sp.id}
              onClick={() => handleSportChange(sp.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                currentSport === sp.id
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {sp.name}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchPlayers();
          }}
          className="relative max-w-xs w-full"
        >
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by player name or team..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
          />
        </form>
      </div>

      {/* Players Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          Loading athletes and verified player records...
        </div>
      ) : players.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-xs space-y-2">
          <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="font-semibold text-slate-300">No players found matching this criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {players.map((p) => (
            <PlayerCard key={p._id} player={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayersList;
