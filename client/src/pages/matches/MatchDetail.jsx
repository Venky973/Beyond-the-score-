import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Trophy,
  MapPin,
  Calendar,
  Clock,
  Shield,
  Heart,
  Share2,
  Sliders,
  ChevronLeft,
  Activity,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import SportScoreboard from '../../components/scoring/SportScoreboard';
import MatchScorerConsole from '../../components/scoring/MatchScorerConsole';

const MatchDetail = () => {
  const { id } = useParams();
  const { socket } = useSocket();
  const { user, isOrganizer, isAdmin } = useAuth();

  const [match, setMatch] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [scorerConsoleOpen, setScorerConsoleOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch initial match & events
  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const res = await api.get(`/matches/${id}`);
        if (res.data.success) {
          setMatch(res.data.match);
          setEvents(res.data.events || []);
        }
      } catch (err) {
        console.error('Match load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [id]);

  // Join and listen to Socket.IO match room
  useEffect(() => {
    if (!socket || !id) return;

    socket.emit('joinMatch', id);

    const handleScoreUpdate = (updatedMatch) => {
      if (updatedMatch._id === id) {
        setMatch(updatedMatch);
      }
    };

    const handleEventAdded = (newEvent) => {
      setEvents((prev) => [newEvent, ...prev]);
    };

    socket.on('matchScoreUpdated', handleScoreUpdate);
    socket.on('matchEventAdded', handleEventAdded);

    return () => {
      socket.emit('leaveMatch', id);
      socket.off('matchScoreUpdated', handleScoreUpdate);
      socket.off('matchEventAdded', handleEventAdded);
    };
  }, [socket, id]);

  const handleToggleFollow = async () => {
    try {
      const res = await api.post('/follows/toggle', {
        targetType: 'match',
        targetId: id
      });
      if (res.data.success) {
        setIsFollowing(res.data.isFollowing);
      }
    } catch (err) {
      console.error('Follow error:', err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400 text-xs">
        Loading match details and scoreboard...
      </div>
    );
  }

  if (!match) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-3">
        <h2 className="text-xl font-bold text-white">Match Not Found</h2>
        <p className="text-slate-400 text-xs">This fixture may have been deleted or archived.</p>
        <Link to="/matches" className="text-orange-400 text-xs hover:underline inline-block">
          Return to Matches List
        </Link>
      </div>
    );
  }

  const isLive = match.status === 'live';
  const isCompleted = match.status === 'completed';
  const canScore = isAdmin || (isOrganizer && (match.organizer?._id === user?._id || match.organizer === user?._id));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & Action controls */}
      <div className="flex items-center justify-between">
        <Link
          to="/matches"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ChevronLeft className="w-4 h-4" /> All Matches
        </Link>

        <div className="flex items-center gap-2">
          {canScore && (
            <button
              onClick={() => setScorerConsoleOpen(!scorerConsoleOpen)}
              className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-orange-600/20"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{scorerConsoleOpen ? 'Hide Scorer' : 'Open Scorer Console'}</span>
            </button>
          )}

          <button
            onClick={handleShare}
            className="p-2 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs transition"
            title="Share Match Link"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {copied && (
            <span className="text-[11px] text-emerald-400 font-bold">Link Copied!</span>
          )}

          <button
            onClick={handleToggleFollow}
            className={`p-2 rounded-lg border transition ${
              isFollowing
                ? 'bg-red-500/20 border-red-500/40 text-red-400'
                : 'bg-slate-850 hover:bg-slate-800 border-slate-700 text-slate-400 hover:text-red-400'
            }`}
            title="Follow Match Updates"
          >
            <Heart className={`w-4 h-4 ${isFollowing ? 'fill-red-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Organizer Scorer Console (if toggled open) */}
      {scorerConsoleOpen && canScore && (
        <MatchScorerConsole match={match} onUpdate={(updated) => setMatch(updated)} />
      )}

      {/* Main Scoreboard Showcase Banner */}
      <div className="bg-sports-dark border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-slate-800 text-xs text-slate-400 gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
              {match.sport}
            </span>
            <span className="text-white font-medium">
              {match.competitionName || 'Independent Series'}
            </span>
            <span>•</span>
            <span className="capitalize">{match.category}</span>
          </div>

          {isLive && (
            <div className="flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-live-dot" />
              LIVE IN PLAY • {match.matchProgress}
            </div>
          )}

          {isCompleted && (
            <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase">
              Match Completed
            </div>
          )}
        </div>

        {/* Head-to-Head Visual Area */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-7 items-center gap-6 text-center">
          {/* Team A */}
          <div className="md:col-span-3 flex flex-col items-center space-y-3">
            <img
              src={
                match.teamA.logo ||
                'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=120'
              }
              alt={match.teamA.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-slate-700 bg-slate-900 shadow-lg"
            />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              {match.teamA.name}
            </h2>
            <div className="font-mono text-3xl sm:text-4xl font-extrabold text-orange-400">
              {match.teamA.scoreDisplay}
            </div>
          </div>

          {/* VS Divider */}
          <div className="md:col-span-1 flex flex-col items-center justify-center">
            <span className="text-slate-600 font-display text-2xl font-black">VS</span>
            <span className="text-[11px] text-slate-400 font-mono mt-1">
              {match.matchProgress}
            </span>
          </div>

          {/* Team B */}
          <div className="md:col-span-3 flex flex-col items-center space-y-3">
            <img
              src={
                match.teamB.logo ||
                'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120'
              }
              alt={match.teamB.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-slate-700 bg-slate-900 shadow-lg"
            />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              {match.teamB.name}
            </h2>
            <div className="font-mono text-3xl sm:text-4xl font-extrabold text-sky-400">
              {match.teamB.scoreDisplay}
            </div>
          </div>
        </div>

        {/* Result banner if completed */}
        {isCompleted && match.result?.margin && (
          <div className="mt-4 p-3 rounded-xl bg-orange-950/40 border border-orange-500/30 text-center">
            <span className="text-sm font-bold text-orange-400 block">{match.result.margin}</span>
            {match.result.summary && (
              <span className="text-xs text-slate-300 mt-1 block">{match.result.summary}</span>
            )}
          </div>
        )}

        {/* Venue & Time Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-slate-500" />
            <span>{match.venue}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>
              {new Date(match.scheduledAt).toLocaleDateString([], {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Sport-Specific Full Scoreboard */}
      <div className="bg-slate-850 p-6 rounded-2xl border border-slate-750">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-orange-400" /> In-Depth Match Details & Statistics
        </h3>
        <SportScoreboard match={match} />
      </div>

      {/* Match Commentary / Event Timeline */}
      <div className="bg-slate-850 p-6 rounded-2xl border border-slate-750 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" /> Real-Time Commentary Timeline
          </h3>
          <span className="text-[11px] text-slate-400">
            {events.length} Recorded Key Events
          </span>
        </div>

        {events.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No commentary events recorded yet for this match.
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((evt) => (
              <div
                key={evt._id || Math.random()}
                className="flex items-start gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs"
              >
                <span className="font-mono font-bold text-orange-400 bg-slate-800 px-2 py-0.5 rounded flex-shrink-0">
                  {evt.time}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white uppercase text-[11px]">
                      {evt.eventType.replace('_', ' ')}
                    </span>
                    {evt.scoreSnapshot && (
                      <span className="font-mono text-slate-400 text-[10px]">
                        [{evt.scoreSnapshot}]
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300 mt-0.5">{evt.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchDetail;
