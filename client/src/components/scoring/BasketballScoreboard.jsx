import React from 'react';
import { Award, Flame } from 'lucide-react';

const BasketballScoreboard = ({ match }) => {
  const details = match.sportDetails || {};
  const quarterScores = details.quarterScores || {
    teamA: [0, 0, 0, 0],
    teamB: [0, 0, 0, 0]
  };

  const topA = details.topScorerA;
  const topB = details.topScorerB;

  return (
    <div className="space-y-4">
      {/* Quarter by Quarter Breakdown Table */}
      <div className="overflow-x-auto bg-slate-900/80 p-3 rounded-lg border border-slate-800">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-orange-500" /> Quarter Breakdown
        </div>
        <table className="w-full text-xs text-center">
          <thead className="text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="text-left py-1.5">Team</th>
              <th className="py-1.5">Q1</th>
              <th className="py-1.5">Q2</th>
              <th className="py-1.5">Q3</th>
              <th className="py-1.5">Q4</th>
              <th className="py-1.5 font-bold text-white">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            <tr>
              <td className="text-left py-2 font-sans font-semibold text-white">
                {match.teamA.shortName || match.teamA.name}
              </td>
              <td className="py-2 text-slate-300">{quarterScores.teamA?.[0] || '-'}</td>
              <td className="py-2 text-slate-300">{quarterScores.teamA?.[1] || '-'}</td>
              <td className="py-2 text-slate-300">{quarterScores.teamA?.[2] || '-'}</td>
              <td className="py-2 text-slate-300">{quarterScores.teamA?.[3] || '-'}</td>
              <td className="py-2 font-bold text-orange-400 font-sans text-sm">
                {match.teamA.scoreDisplay}
              </td>
            </tr>
            <tr>
              <td className="text-left py-2 font-sans font-semibold text-white">
                {match.teamB.shortName || match.teamB.name}
              </td>
              <td className="py-2 text-slate-300">{quarterScores.teamB?.[0] || '-'}</td>
              <td className="py-2 text-slate-300">{quarterScores.teamB?.[1] || '-'}</td>
              <td className="py-2 text-slate-300">{quarterScores.teamB?.[2] || '-'}</td>
              <td className="py-2 text-slate-300">{quarterScores.teamB?.[3] || '-'}</td>
              <td className="py-2 font-bold text-sky-400 font-sans text-sm">
                {match.teamB.scoreDisplay}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Top Performers */}
      {(topA || topB) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {topA && (
            <div className="bg-slate-850 p-3 rounded-lg border border-slate-800 text-xs">
              <span className="text-[10px] uppercase font-bold text-orange-400 block mb-1">
                {match.teamA.name} Leader
              </span>
              <div className="font-semibold text-white text-sm">{topA.name}</div>
              <div className="text-slate-400 mt-1 flex gap-3">
                <span><b className="text-white">{topA.points}</b> PTS</span>
                {topA.rebounds !== undefined && <span><b className="text-white">{topA.rebounds}</b> REB</span>}
                {topA.assists !== undefined && <span><b className="text-white">{topA.assists}</b> AST</span>}
              </div>
            </div>
          )}
          {topB && (
            <div className="bg-slate-850 p-3 rounded-lg border border-slate-800 text-xs">
              <span className="text-[10px] uppercase font-bold text-sky-400 block mb-1">
                {match.teamB.name} Leader
              </span>
              <div className="font-semibold text-white text-sm">{topB.name}</div>
              <div className="text-slate-400 mt-1 flex gap-3">
                <span><b className="text-white">{topB.points}</b> PTS</span>
                {topB.rebounds !== undefined && <span><b className="text-white">{topB.rebounds}</b> REB</span>}
                {topB.assists !== undefined && <span><b className="text-white">{topB.assists}</b> AST</span>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BasketballScoreboard;
