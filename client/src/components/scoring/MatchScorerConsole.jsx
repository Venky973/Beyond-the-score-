import React, { useState } from 'react';
import { Play, Square, Award, Check, RefreshCw, Send, AlertTriangle } from 'lucide-react';
import api from '../../services/api';

const MatchScorerConsole = ({ match, onUpdate }) => {
  const sport = match.sport?.toLowerCase();

  const [teamAScoreDisplay, setTeamAScoreDisplay] = useState(match.teamA.scoreDisplay || '0');
  const [teamBScoreDisplay, setTeamBScoreDisplay] = useState(match.teamB.scoreDisplay || '0');
  const [matchProgress, setMatchProgress] = useState(match.matchProgress || 'Live');
  const [status, setStatus] = useState(match.status || 'live');
  const [eventDesc, setEventDesc] = useState('');
  const [eventTeam, setEventTeam] = useState('teamA');
  const [eventType, setEventType] = useState('point');
  const [eventPlayer, setEventPlayer] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // Declare Result states
  const [finalizeOpen, setFinalizeOpen] = useState(false);
  const [winner, setWinner] = useState('teamA');
  const [margin, setMargin] = useState('');
  const [summary, setSummary] = useState('');

  const handleBroadcast = async (customEvent = null) => {
    setSaving(true);
    setMsg('');
    try {
      const payload = {
        teamAScoreDisplay,
        teamBScoreDisplay,
        matchProgress,
        status
      };

      if (customEvent) {
        payload.event = customEvent;
      } else if (eventDesc.trim()) {
        payload.event = {
          time: matchProgress,
          eventType,
          team: eventTeam,
          player: eventPlayer,
          description: eventDesc.trim()
        };
      }

      const res = await api.put(`/matches/${match._id}/score`, payload);
      if (res.data.success) {
        setMsg('Score updated and broadcasted live to all viewers!');
        setEventDesc('');
        if (onUpdate) onUpdate(res.data.match);
      }
    } catch (err) {
      console.error('Score broadcast error:', err);
      setMsg(err.response?.data?.message || 'Failed to broadcast score');
    } finally {
      setSaving(false);
    }
  };

  const handleFinalize = async () => {
    setSaving(true);
    try {
      const res = await api.put(`/matches/${match._id}/result`, {
        winner,
        margin,
        summary
      });
      if (res.data.success) {
        setFinalizeOpen(false);
        setMsg('Match finalized and archived!');
        if (onUpdate) onUpdate(res.data.match);
      }
    } catch (err) {
      console.error('Finalize error:', err);
      setMsg('Failed to finalize match');
    } finally {
      setSaving(false);
    }
  };

  // Quick Action Buttons per sport
  const handleCricketQuickAction = (action) => {
    let desc = '';
    let type = 'point';
    if (action === '4') {
      desc = `FOUR! Boundary scored towards the fence.`;
      type = 'boundary_four';
    } else if (action === '6') {
      desc = `SIX! Huge strike clears the boundary ropes.`;
      type = 'boundary_six';
    } else if (action === 'W') {
      desc = `WICKET! Dismissal in ${matchProgress}.`;
      type = 'wicket';
    } else if (action === '1') {
      desc = `Single taken, strike rotated.`;
    }

    setEventDesc(desc);
    setEventType(type);
  };

  const handleFootballGoal = (teamKey) => {
    const teamName = teamKey === 'teamA' ? match.teamA.name : match.teamB.name;
    const currentScore = teamKey === 'teamA' ? parseInt(teamAScoreDisplay || '0') + 1 : parseInt(teamBScoreDisplay || '0') + 1;
    if (teamKey === 'teamA') setTeamAScoreDisplay(String(currentScore));
    else setTeamBScoreDisplay(String(currentScore));

    const event = {
      time: matchProgress,
      eventType: 'goal',
      team: teamKey,
      player: eventPlayer || 'Goalscorer',
      description: `GOAL! ${teamName} strikes into the back of the net!`
    };
    handleBroadcast(event);
  };

  return (
    <div className="bg-slate-900 border-2 border-orange-500/40 rounded-xl p-5 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400 bg-orange-950/40 border border-orange-500/30 px-2 py-0.5 rounded">
            Live Match Scorer Console
          </span>
          <h3 className="text-base font-bold text-white mt-1">
            {match.teamA.name} vs {match.teamB.name}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1 font-semibold uppercase"
          >
            <option value="upcoming">Upcoming</option>
            <option value="live">LIVE</option>
            <option value="completed">Completed</option>
          </select>

          <button
            onClick={() => setFinalizeOpen(true)}
            className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center gap-1"
          >
            <Award className="w-3.5 h-3.5" /> Declare Result
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs">
          {msg}
        </div>
      )}

      {/* Main Score Editor Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-850 p-4 rounded-xl border border-slate-850">
        {/* Team A */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            {match.teamA.name} Score
          </label>
          <input
            type="text"
            value={teamAScoreDisplay}
            onChange={(e) => setTeamAScoreDisplay(e.target.value)}
            placeholder="e.g. 182/4 (19.2) or 2 or 88"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-base font-mono font-bold text-white focus:outline-none focus:border-orange-500"
          />
          {sport === 'football' && (
            <button
              onClick={() => handleFootballGoal('teamA')}
              className="mt-2 w-full py-1.5 bg-orange-600/30 hover:bg-orange-600 border border-orange-500/40 text-white text-xs font-bold rounded transition"
            >
              + Goal ({match.teamA.shortName || 'A'})
            </button>
          )}
        </div>

        {/* Match Progress / Clock */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Match Progress / Clock
          </label>
          <input
            type="text"
            value={matchProgress}
            onChange={(e) => setMatchProgress(e.target.value)}
            placeholder="e.g. Over 18.2, 74', Q3 04:12"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-base font-mono font-bold text-orange-400 focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Team B */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            {match.teamB.name} Score
          </label>
          <input
            type="text"
            value={teamBScoreDisplay}
            onChange={(e) => setTeamBScoreDisplay(e.target.value)}
            placeholder="e.g. 164/5 (18.0) or 1 or 82"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-base font-mono font-bold text-white focus:outline-none focus:border-orange-500"
          />
          {sport === 'football' && (
            <button
              onClick={() => handleFootballGoal('teamB')}
              className="mt-2 w-full py-1.5 bg-sky-600/30 hover:bg-sky-600 border border-sky-500/40 text-white text-xs font-bold rounded transition"
            >
              + Goal ({match.teamB.shortName || 'B'})
            </button>
          )}
        </div>
      </div>

      {/* Sport Specific Quick Buttons */}
      {sport === 'cricket' && (
        <div>
          <span className="text-xs font-semibold text-slate-300 block mb-2">
            Cricket Quick Ball Event:
          </span>
          <div className="flex flex-wrap gap-2">
            {['Dot (0)', 'Single (1)', 'Two (2)', 'Three (3)', 'Four (4)', 'Six (6)', 'WICKET (W)', 'Wide (Wd)', 'No Ball (Nb)'].map(
              (btn) => {
                const code = btn.match(/\((.*?)\)/)?.[1] || '1';
                return (
                  <button
                    key={btn}
                    type="button"
                    onClick={() => handleCricketQuickAction(code)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold border border-slate-700 transition"
                  >
                    {btn}
                  </button>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* Timeline Event Entry */}
      <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-3">
        <span className="text-xs font-semibold text-slate-300 block">
          Add Match Event Commentary (Real-Time Timeline)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Team</label>
            <select
              value={eventTeam}
              onChange={(e) => setEventTeam(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
            >
              <option value="teamA">{match.teamA.name}</option>
              <option value="teamB">{match.teamB.name}</option>
              <option value="neutral">Neutral / General</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Player Involved</label>
            <input
              type="text"
              value={eventPlayer}
              onChange={(e) => setEventPlayer(e.target.value)}
              placeholder="e.g. Lucas Silva or Virat R."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Event Type</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
            >
              <option value="point">General Score / Point</option>
              <option value="goal">Goal</option>
              <option value="wicket">Wicket</option>
              <option value="boundary_four">Boundary (Four)</option>
              <option value="boundary_six">Boundary (Six)</option>
              <option value="card">Yellow / Red Card</option>
              <option value="sub">Substitution</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Event Description</label>
          <input
            type="text"
            value={eventDesc}
            onChange={(e) => setEventDesc(e.target.value)}
            placeholder="e.g. Splendid 25-yard curled strike into top right corner!"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
          />
        </div>
      </div>

      {/* Broadcast Action */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          disabled={saving}
          onClick={() => handleBroadcast()}
          className="px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-orange-600/30"
        >
          <Send className="w-4 h-4" />
          {saving ? 'Broadcasting...' : 'Broadcast Score Live Now'}
        </button>
      </div>

      {/* Finalize Modal */}
      {finalizeOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-sports-dark border border-slate-700 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-400" /> Declare Official Match Result
            </h4>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Winning Team
              </label>
              <select
                value={winner}
                onChange={(e) => setWinner(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="teamA">{match.teamA.name}</option>
                <option value="teamB">{match.teamB.name}</option>
                <option value="draw">Draw / Tied</option>
                <option value="no-result">No Result / Abandoned</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Margin Statement
              </label>
              <input
                type="text"
                value={margin}
                onChange={(e) => setMargin(e.target.value)}
                placeholder="e.g. Won by 24 runs OR Won 3-1"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Match Summary Notes
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief summary of outstanding performances and match outcome"
                rows={2}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setFinalizeOpen(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalize}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Confirm & Finalize
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchScorerConsole;
