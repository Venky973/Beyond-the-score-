import React from 'react';
import { Shield, Clock, Award, Activity } from 'lucide-react';

const FootballScoreboard = ({ match }) => {
  const details = match.sportDetails || {};
  const possession = details.possession || [50, 50];
  const shots = details.shots || [0, 0];
  const shotsOnTarget = details.shotsOnTarget || [0, 0];
  const corners = details.corners || [0, 0];
  const fouls = details.fouls || [0, 0];
  const goals = details.goals || [];
  const cards = details.cards || [];

  return (
    <div className="space-y-4">
      {/* Possession Bar */}
      <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
        <div className="flex justify-between text-xs font-semibold mb-1">
          <span className="text-orange-400">{match.teamA.name}: {possession[0]}%</span>
          <span className="text-slate-400 uppercase tracking-wider text-[11px]">Possession</span>
          <span className="text-sky-400">{possession[1]}% :{match.teamB.name}</span>
        </div>
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
          <div
            className="bg-orange-500 h-full transition-all duration-500"
            style={{ width: `${possession[0]}%` }}
          />
          <div
            className="bg-sky-500 h-full transition-all duration-500"
            style={{ width: `${possession[1]}%` }}
          />
        </div>
      </div>

      {/* Match Stats Grid */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div className="bg-slate-850 p-2 rounded-lg border border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase">Shots</span>
          <span className="font-bold text-white text-sm">
            {shots[0]} - {shots[1]}
          </span>
        </div>
        <div className="bg-slate-850 p-2 rounded-lg border border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase">On Target</span>
          <span className="font-bold text-emerald-400 text-sm">
            {shotsOnTarget[0]} - {shotsOnTarget[1]}
          </span>
        </div>
        <div className="bg-slate-850 p-2 rounded-lg border border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase">Corners</span>
          <span className="font-bold text-white text-sm">
            {corners[0]} - {corners[1]}
          </span>
        </div>
        <div className="bg-slate-850 p-2 rounded-lg border border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase">Fouls</span>
          <span className="font-bold text-amber-400 text-sm">
            {fouls[0]} - {fouls[1]}
          </span>
        </div>
      </div>

      {/* Goals & Scorers */}
      {goals.length > 0 && (
        <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-orange-400" /> Goalscorers
          </div>
          <div className="space-y-1.5">
            {goals.map((g, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-800/60"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-white">{g.player}</span>
                  {g.assist && <span className="text-slate-400">(ast. {g.assist})</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">
                    {g.team === 'teamA' ? match.teamA.shortName || match.teamA.name : match.teamB.shortName || match.teamB.name}
                  </span>
                  <span className="font-bold text-orange-400">{g.minute}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cards */}
      {cards.length > 0 && (
        <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-400" /> Disciplinary
          </div>
          <div className="flex flex-wrap gap-2">
            {cards.map((c, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 text-xs bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700/80"
              >
                <span
                  className={`w-2.5 h-3.5 rounded-sm ${
                    c.card === 'red' ? 'bg-red-500' : 'bg-amber-400'
                  }`}
                />
                <span className="text-slate-200 font-medium">{c.player}</span>
                <span className="text-slate-500 font-mono text-[10px]">{c.minute}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FootballScoreboard;
