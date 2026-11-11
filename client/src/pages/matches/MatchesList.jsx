import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Trophy, Activity, Calendar, CheckCircle, Search, Filter, Plus } from 'lucide-react';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import MatchCard from '../../components/scoring/MatchCard';

const MatchesList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { socket } = useSocket();
  const { isOrganizer, isAdmin } = useAuth();

  const currentTab = searchParams.get('status') || 'live';
  const currentSport = searchParams.get('sport') || 'all';

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');

  const fetchMatches = async () => {
    setLoading(true);
    try {
      let url = `/matches?limit=50`;
      if (currentTab !== 'all') url += `&status=${currentTab}`;
      if (currentSport !== 'all') url += `&sport=${currentSport}`;
      if (searchKeyword.trim()) url += `&search=${encodeURIComponent(searchKeyword.trim())}`;

      const res = await api.get(url);
      if (res.data.success) {
        setMatches(res.data.matches);
      }
    } catch (err) {
      console.error('Failed to load matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [currentTab, currentSport]);

  // Live Socket.IO Updates
  useEffect(() => {
    if (!socket) return;

    const handleFeedUpdate = (data) => {
      setMatches((prev) =>
        prev.map((m) =>
          m._id === data.matchId
            ? {
                ...m,
                teamA: { ...m.teamA, scoreDisplay: data.teamA.scoreDisplay },
                teamB: { ...m.teamB, scoreDisplay: data.teamB.scoreDisplay },
                matchProgress: data.matchProgress,
                status: data.status,
                result: data.result || m.result
              }
            : m
        )
      );
    };

    socket.on('liveFeedUpdated', handleFeedUpdate);
    return () => socket.off('liveFeedUpdated', handleFeedUpdate);
  }, [socket]);

  const handleTabChange = (status) => {
    const params = new URLSearchParams(searchParams);
    if (status === 'all') params.delete('status');
    else params.set('status', status);
    setSearchParams(params);
  };

  const handleSportChange = (sport) => {
    const params = new URLSearchParams(searchParams);
    if (sport === 'all') params.delete('sport');
    else params.set('sport', sport);
    setSearchParams(params);
  };

  const sports = [
    { id: 'all', name: 'All Sports' },
    { id: 'cricket', name: 'Cricket' },
    { id: 'football', name: 'Football' },
    { id: 'basketball', name: 'Basketball' },
    { id: 'badminton', name: 'Badminton' },
    { id: 'tennis', name: 'Tennis' },
    { id: 'volleyball', name: 'Volleyball' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400 block mb-1">
            Global Match Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-wide uppercase">
            Live Scores & Tournaments
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse real-time scores, upcoming fixtures, and archived match statistics.
          </p>
        </div>

        {(isOrganizer || isAdmin) && (
          <Link
            to="/organizer/create-match"
            className="self-start md:self-auto px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-md shadow-orange-600/30"
          >
            <Plus className="w-4 h-4" /> Create New Match
          </Link>
        )}
      </div>

      {/* Tabs & Filters Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'live', label: 'Live', badge: true },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'completed', label: 'Completed' },
            { id: 'all', label: 'All Matches' }
          ].map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-live-dot" />
                )}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchMatches();
          }}
          className="relative max-w-xs w-full"
        >
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Search teams or venue..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
          />
        </form>
      </div>

      {/* Sports selector pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {sports.map((sp) => (
          <button
            key={sp.id}
            onClick={() => handleSportChange(sp.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              currentSport === sp.id
                ? 'bg-slate-800 text-orange-400 border border-slate-700 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-850'
            }`}
          >
            {sp.name}
          </button>
        ))}
      </div>

      {/* Matches Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          Loading live fixtures and scoreboards...
        </div>
      ) : matches.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-xs space-y-2">
          <Trophy className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="font-semibold text-slate-300">No matches found matching your filters.</p>
          <p>Try switching tabs or selecting "All Sports" to view scheduled events.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {matches.map((m) => (
            <MatchCard key={m._id} match={m} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchesList;
