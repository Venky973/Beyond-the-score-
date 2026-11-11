import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  MapPin,
  Calendar,
  FileSpreadsheet,
  Users,
  Activity,
  ArrowRight,
  Shield,
  Zap,
  Star,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import MatchCard from '../../components/scoring/MatchCard';
import TurfCard from '../../components/turf/TurfCard';
import PlayerCard from '../../components/player/PlayerCard';

const Home = () => {
  const { socket } = useSocket();
  const [liveMatches, setLiveMatches] = useState([]);
  const [featuredTurfs, setFeaturedTurfs] = useState([]);
  const [featuredPlayers, setFeaturedPlayers] = useState([]);
  const [selectedSport, setSelectedSport] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [matchesRes, turfsRes, playersRes] = await Promise.all([
          api.get('/matches?limit=6'),
          api.get('/turfs?limit=3&sort=rating'),
          api.get('/players?limit=4')
        ]);

        if (matchesRes.data.success) setLiveMatches(matchesRes.data.matches);
        if (turfsRes.data.success) setFeaturedTurfs(turfsRes.data.turfs);
        if (playersRes.data.success) setFeaturedPlayers(playersRes.data.players);
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Listen to live WebSocket score broadcast
  useEffect(() => {
    if (!socket) return;

    const handleFeedUpdate = (data) => {
      setLiveMatches((prev) =>
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

    return () => {
      socket.off('liveFeedUpdated', handleFeedUpdate);
    };
  }, [socket]);

  const sportsList = [
    { id: 'all', name: 'All Sports' },
    { id: 'cricket', name: 'Cricket' },
    { id: 'football', name: 'Football' },
    { id: 'basketball', name: 'Basketball' },
    { id: 'tennis', name: 'Tennis' },
    { id: 'badminton', name: 'Badminton' }
  ];

  const filteredMatches =
    selectedSport === 'all'
      ? liveMatches
      : liveMatches.filter((m) => m.sport?.toLowerCase() === selectedSport);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sports-dark via-slate-900 to-slate-950 pt-12 pb-20 border-b border-slate-800">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-orange-600/30 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-emerald-600/20 rounded-full blur-[140px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs font-semibold text-orange-400 shadow-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span>Next-Gen Sports Technology System</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-display tracking-tight leading-[1.08]">
              WHERE THE MATCH NEVER ENDS{' '}
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                BEYOND THE SCORE
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Track live multi-sport matches with real-time ball-by-ball commentary, discover and book
              premier sports turfs near you, build custom grassroot scorecards, and compare athlete
              metrics on a unified platform.
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link
                to="/matches"
                className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-orange-600/30 flex items-center gap-2"
              >
                <Activity className="w-4 h-4" /> Live Scoreboards
              </Link>
              <Link
                to="/turfs"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-600/30 flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" /> Book Sports Turf
              </Link>
              <Link
                to="/scorecards/create"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4 text-orange-400" /> Create Custom Scorecard
              </Link>
            </div>

            {/* Platform Stats Row */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto text-center border-t border-slate-800/80">
              <div>
                <span className="font-display text-2xl font-bold text-white block">6+</span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Major Sports</span>
              </div>
              <div>
                <span className="font-display text-2xl font-bold text-orange-400 block">&lt; 100ms</span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Socket Latency</span>
              </div>
              <div>
                <span className="font-display text-2xl font-bold text-emerald-400 block">100%</span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Conflict-Free Slots</span>
              </div>
              <div>
                <span className="font-display text-2xl font-bold text-white block">Public & Unlisted</span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">Shareable URLs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live & Upcoming Matches Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-live-dot" />
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display uppercase tracking-wider">
                Live & Featured Encounters
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Real-time scores broadcasted over WebSockets with sport-specific scoring models.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sport filter tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {sportsList.map((sp) => (
                <button
                  key={sp.id}
                  onClick={() => setSelectedSport(sp.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    selectedSport === sp.id
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {sp.name}
                </button>
              ))}
            </div>

            <Link
              to="/matches"
              className="hidden md:flex items-center gap-1 text-xs font-semibold text-orange-400 hover:text-orange-300"
            >
              All Matches <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Matches Grid */}
        {filteredMatches.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
            No active matches in this sport right now. Check upcoming fixtures.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMatches.map((match) => (
              <MatchCard key={match._id} match={match} />
            ))}
          </div>
        )}
      </section>

      {/* Turf Facility Discovery Highlight */}
      <section className="bg-slate-900/60 border-y border-slate-800 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                Location-Based Facility Discovery
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display uppercase tracking-wider">
                Discover Verified Sports Turfs
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Browse synthetic turf pitches, floodlit cricket nets, and indoor courts with real-time hourly slot booking.
              </p>
            </div>

            <Link
              to="/turfs"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 font-semibold text-xs transition"
            >
              <MapPin className="w-4 h-4" /> Explore All Turfs
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTurfs.map((turf) => (
              <TurfCard key={turf._id} turf={turf} />
            ))}
          </div>
        </div>
      </section>

      {/* Custom Scorecard Module Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-sports-dark via-slate-900 to-slate-850 border border-slate-700/80 rounded-2xl p-8 lg:p-12 shadow-2xl relative overflow-hidden">
          <div className="max-w-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-950/40 border border-orange-500/30 px-3 py-1 rounded-full inline-block">
              For Players, Friends & Amateur Clubs
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
              CREATE & SHARE CUSTOM MATCH SCORECARDS
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Playing a friendly box cricket game, a 5-a-side weekend football derby, or a pickup
              basketball battle? Build custom sport-tailored scorecards in under 2 minutes and share public links with your friends.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Cricket, Football & Hoops</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Public Share Links</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Player Milestone Records</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>No Official Registration Needed</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <Link
                to="/scorecards/create"
                className="px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-md shadow-orange-600/30"
              >
                Create Scorecard Now
              </Link>
              <Link
                to="/scorecards/public"
                className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
              >
                Browse Public Matches
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Athletes & Head-to-Head Comparison */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 block mb-1">
              Athlete Analytics
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display uppercase tracking-wider">
              Featured Players & Form Records
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Deep career statistics, form indicators, and same-sport comparative metrics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/players/compare"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-orange-400 text-xs font-semibold transition"
            >
              <Trophy className="w-3.5 h-3.5" /> Head-to-Head Compare
            </Link>
            <Link
              to="/players"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white"
            >
              View Directory <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredPlayers.map((player) => (
            <PlayerCard key={player._id} player={player} />
          ))}
        </div>
      </section>

      {/* Platform Features / Why Beyond The Score */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-white font-display uppercase tracking-wider">
            Engineered For The Whole Sports Lifecycle
          </h2>
          <p className="text-xs text-slate-400 mt-1.5">
            Beyond The Score integrates all stakeholders into one unified, secure MERN technology stack.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-850 p-5 rounded-xl border border-slate-800 space-y-2.5">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Live Sports Scorer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official organizers control ball-by-ball, goals, and quarter progression, broadcasting changes in milliseconds.
            </p>
          </div>

          <div className="bg-slate-850 p-5 rounded-xl border border-slate-800 space-y-2.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Geo-Turf Discovery</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Browser Geolocation detection calculates exact distance to turf arenas with instantaneous hourly reservation locks.
            </p>
          </div>

          <div className="bg-slate-850 p-5 rounded-xl border border-slate-800 space-y-2.5">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Head-to-Head Compare</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Strict same-sport player comparison engine analyzes batting average, strike rates, goal conversion, and form.
            </p>
          </div>

          <div className="bg-slate-850 p-5 rounded-xl border border-slate-800 space-y-2.5">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Role-Based Control</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              5 authenticated roles with isolated dashboards for Fans, Players, Organizers, Turf Operators, and Administrators.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
