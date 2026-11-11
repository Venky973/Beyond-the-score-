import React from 'react';
import CricketScoreboard from './CricketScoreboard';
import FootballScoreboard from './FootballScoreboard';
import BasketballScoreboard from './BasketballScoreboard';

const SportScoreboard = ({ match }) => {
  if (!match) return null;

  const sport = match.sport?.toLowerCase();

  if (sport === 'cricket') {
    return <CricketScoreboard match={match} />;
  }

  if (sport === 'football') {
    return <FootballScoreboard match={match} />;
  }

  if (sport === 'basketball') {
    return <BasketballScoreboard match={match} />;
  }

  // Generic Racket / Sets breakdown for Tennis, Badminton, Volleyball
  const details = match.sportDetails || {};
  const sets = details.sets || [];

  return (
    <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800 text-xs space-y-3">
      <div className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
        {match.sport.toUpperCase()} Match Progress
      </div>
      {sets.length > 0 ? (
        <div className="flex gap-3">
          {sets.map((s, idx) => (
            <div key={idx} className="bg-slate-850 p-2.5 rounded border border-slate-700/80 text-center">
              <span className="text-[10px] text-slate-400 block">Set {idx + 1}</span>
              <span className="font-bold text-white text-sm">
                {s.teamA} - {s.teamB}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-slate-400">
          Match is in progress. Current Score: <b className="text-white">{match.teamA.scoreDisplay}</b> - <b className="text-white">{match.teamB.scoreDisplay}</b>
        </div>
      )}
    </div>
  );
};

export default SportScoreboard;
