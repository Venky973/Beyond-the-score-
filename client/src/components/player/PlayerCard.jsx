import React from 'react';
import { Link } from 'react-router-dom';
import { User, Trophy, ArrowRight, Activity } from 'lucide-react';

const PlayerCard = ({ player }) => {
  const sport = player.sport?.toLowerCase();

  return (
    <div className="bg-slate-850 border border-slate-700/80 hover:border-orange-500/50 rounded-xl p-4 transition-all duration-200 hover:shadow-xl hover:shadow-black/40 flex flex-col justify-between group">
      <div>
        {/* Header: Photo & Info */}
        <div className="flex items-start gap-3.5">
          <img
            src={
              player.avatar ||
              player.user?.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
            }
            alt={player.name}
            className="w-14 h-14 rounded-xl object-cover border border-slate-700 group-hover:border-orange-500/60 transition"
          />
          <div className="flex-1 overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-950/40 border border-orange-500/30 px-2 py-0.5 rounded">
              {player.sport}
            </span>
            <h3 className="font-bold text-base text-white mt-1 group-hover:text-orange-400 transition truncate">
              {player.name}
            </h3>
            <p className="text-xs text-slate-400 truncate">
              {player.position} • {player.teamName || 'Independent'}
            </p>
          </div>
        </div>

        {/* Stats Preview Matrix */}
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            <span className="text-[10px] uppercase text-slate-400 block">Matches</span>
            <span className="font-bold text-white text-sm">{player.matchesPlayed || 0}</span>
          </div>

          {sport === 'cricket' && (
            <>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400 block">Runs</span>
                <span className="font-bold text-orange-400 text-sm">
                  {player.cricketStats?.runs || 0}
                </span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400 block">Avg</span>
                <span className="font-bold text-emerald-400 text-sm">
                  {player.cricketStats?.battingAvg || 0}
                </span>
              </div>
            </>
          )}

          {sport === 'football' && (
            <>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400 block">Goals</span>
                <span className="font-bold text-orange-400 text-sm">
                  {player.footballStats?.goals || 0}
                </span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400 block">Assists</span>
                <span className="font-bold text-emerald-400 text-sm">
                  {player.footballStats?.assists || 0}
                </span>
              </div>
            </>
          )}

          {sport === 'basketball' && (
            <>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400 block">Points</span>
                <span className="font-bold text-orange-400 text-sm">
                  {player.basketballStats?.points || 0}
                </span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400 block">Rebounds</span>
                <span className="font-bold text-sky-400 text-sm">
                  {player.basketballStats?.rebounds || 0}
                </span>
              </div>
            </>
          )}

          {sport !== 'cricket' && sport !== 'football' && sport !== 'basketball' && (
            <>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400 block">Wins</span>
                <span className="font-bold text-emerald-400 text-sm">{player.wins || 0}</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400 block">Losses</span>
                <span className="font-bold text-red-400 text-sm">{player.losses || 0}</span>
              </div>
            </>
          )}
        </div>

        {/* Form Indicator */}
        {player.recentForm?.length > 0 && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800/80 text-xs">
            <span className="text-slate-400 text-[11px]">Form:</span>
            <div className="flex items-center gap-1">
              {player.recentForm.slice(0, 5).map((f, i) => (
                <span
                  key={i}
                  className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                    f === 'W'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : f === 'D'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-red-500/20 text-red-400 border border-red-500/40'
                  }`}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <Link
          to={`/players/${player._id}`}
          className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition"
        >
          Career Statistics <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          to={`/players/compare?player1Id=${player._id}`}
          className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition"
        >
          Compare
        </Link>
      </div>
    </div>
  );
};

export default PlayerCard;
