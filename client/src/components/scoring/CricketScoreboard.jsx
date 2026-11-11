import React from 'react';
import { Target, Activity, Award } from 'lucide-react';

const CricketScoreboard = ({ match }) => {
  const details = match.sportDetails || {};
  const batsmen = details.batsmen || [];
  const bowlers = details.bowlers || [];
  const recentBalls = details.recentBalls || [];

  return (
    <div className="space-y-4">
      {/* Target & Rates Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs">
        <div>
          <span className="text-slate-400 block">Current Run Rate</span>
          <span className="text-white font-bold text-sm">{details.crr || '8.25'}</span>
        </div>
        <div>
          <span className="text-slate-400 block">Target Score</span>
          <span className="text-orange-400 font-bold text-sm">
            {details.target ? `${details.target} Runs` : '1st Innings in progress'}
          </span>
        </div>
        {details.rrr && (
          <div>
            <span className="text-slate-400 block">Req. Run Rate</span>
            <span className="text-red-400 font-bold text-sm">{details.rrr}</span>
          </div>
        )}
        {details.runsNeeded !== undefined && (
          <div>
            <span className="text-slate-400 block">Equation</span>
            <span className="text-emerald-400 font-bold text-sm">
              Need {details.runsNeeded} off {details.ballsRemaining || 12} balls
            </span>
          </div>
        )}
      </div>

      {/* Recent Balls Strip */}
      {recentBalls.length > 0 && (
        <div className="flex items-center gap-2 bg-slate-850 p-2.5 rounded-lg border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            This Over:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {recentBalls.map((ball, idx) => {
              let bg = 'bg-slate-800 text-slate-200 border-slate-700';
              if (ball === '4') bg = 'bg-blue-600/30 text-blue-300 border-blue-500/40 font-bold';
              if (ball === '6') bg = 'bg-emerald-600/30 text-emerald-300 border-emerald-500/40 font-bold';
              if (ball === 'W') bg = 'bg-red-600 text-white font-extrabold';
              return (
                <span
                  key={idx}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${bg}`}
                >
                  {ball}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Batsmen Table */}
      {batsmen.length > 0 && (
        <div className="overflow-x-auto">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-orange-400" /> Batter at Crease
          </div>
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900/60 text-slate-400 font-medium border-b border-slate-800">
              <tr>
                <th className="py-2 px-3">Batter</th>
                <th className="py-2 px-3 text-right">R</th>
                <th className="py-2 px-3 text-right">B</th>
                <th className="py-2 px-3 text-right">4s</th>
                <th className="py-2 px-3 text-right">6s</th>
                <th className="py-2 px-3 text-right">SR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {batsmen.map((b, i) => (
                <tr key={i} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-semibold text-slate-100 flex items-center gap-1.5">
                    {b.name} {b.onStrike && <span className="text-orange-400 font-bold">*</span>}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-white">{b.runs}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">{b.balls}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{b.fours || 0}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{b.sixes || 0}</td>
                  <td className="py-2.5 px-3 text-right text-orange-400 font-medium">
                    {b.strikeRate || Math.round(((b.runs || 0) / (b.balls || 1)) * 100)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Active Bowlers Table */}
      {bowlers.length > 0 && (
        <div className="overflow-x-auto pt-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-emerald-400" /> Bowler
          </div>
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-900/60 text-slate-400 font-medium border-b border-slate-800">
              <tr>
                <th className="py-2 px-3">Bowler</th>
                <th className="py-2 px-3 text-right">O</th>
                <th className="py-2 px-3 text-right">M</th>
                <th className="py-2 px-3 text-right">R</th>
                <th className="py-2 px-3 text-right">W</th>
                <th className="py-2 px-3 text-right">ECON</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {bowlers.map((bw, i) => (
                <tr key={i} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-semibold text-slate-100">{bw.name}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{bw.overs}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">{bw.maidens || 0}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{bw.runs}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-400">{bw.wickets}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400 font-medium">{bw.economy || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CricketScoreboard;
