import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Trophy, ChevronRight, Activity } from 'lucide-react';

const MatchCard = ({ match }) => {
  const isLive = match.status === 'live';
  const isUpcoming = match.status === 'upcoming';
  const isCompleted = match.status === 'completed';

  return (
    <Link
      to={`/matches/${match._id}`}
      className="block group bg-slate-850 hover:bg-slate-800 border border-slate-700/80 hover:border-orange-500/50 rounded-xl p-4 transition-all duration-200 shadow-lg shadow-black/20"
    >
      {/* Header: Sport, Status, Time/Progress */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            {match.sport}
          </span>
          <span className="text-slate-400 truncate max-w-[150px] sm:max-w-[200px]">
            {match.competitionName || match.competition?.name || 'League Match'}
          </span>
        </div>

        {isLive && (
          <div className="flex items-center gap-1.5 bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-live-dot" />
            LIVE • {match.matchProgress}
          </div>
        )}

        {isUpcoming && (
          <div className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded text-[10px] font-semibold">
            {new Date(match.scheduledAt).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}

        {isCompleted && (
          <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
            Completed
          </div>
        )}
      </div>

      {/* Teams & Scores Area */}
      <div className="py-4 space-y-3">
        {/* Team A */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={
                match.teamA.logo ||
                'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=100'
              }
              alt={match.teamA.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-700 bg-slate-900"
            />
            <span className="font-semibold text-sm md:text-base text-white group-hover:text-orange-400 transition">
              {match.teamA.name}
            </span>
          </div>
          <span className="font-mono font-bold text-base md:text-lg text-white">
            {isUpcoming ? '-' : match.teamA.scoreDisplay || '0'}
          </span>
        </div>

        {/* Team B */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={
                match.teamB.logo ||
                'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100'
              }
              alt={match.teamB.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-700 bg-slate-900"
            />
            <span className="font-semibold text-sm md:text-base text-white group-hover:text-orange-400 transition">
              {match.teamB.name}
            </span>
          </div>
          <span className="font-mono font-bold text-base md:text-lg text-white">
            {isUpcoming ? '-' : match.teamB.scoreDisplay || '0'}
          </span>
        </div>
      </div>

      {/* Result summary or Venue */}
      <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 truncate max-w-[280px]">
          {isCompleted && match.result?.margin ? (
            <span className="text-orange-400 font-medium truncate">{match.result.margin}</span>
          ) : (
            <>
              <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span className="truncate">{match.venue}</span>
            </>
          )}
        </div>
        <span className="text-slate-500 group-hover:text-orange-400 flex items-center gap-0.5 transition font-medium">
          Details <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
};

export default MatchCard;
