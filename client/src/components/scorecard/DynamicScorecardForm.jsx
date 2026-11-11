import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  Save,
  Share2,
  Globe,
  Lock,
  EyeOff,
  AlertCircle,
  Loader2
} from 'lucide-react';
import api from '../../services/api';

const DynamicScorecardForm = ({ initialData, isEdit = false }) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState(initialData?.title || '');
  const [sport, setSport] = useState(initialData?.sport || 'cricket');
  const [matchType, setMatchType] = useState(initialData?.matchType || 'friendly');
  const [venue, setVenue] = useState(initialData?.venue || '');
  const [matchDate, setMatchDate] = useState(
    initialData?.matchDate
      ? new Date(initialData.matchDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [duration, setDuration] = useState(initialData?.duration || '2 Hours');
  const [visibility, setVisibility] = useState(initialData?.visibility || 'public');
  const [notes, setNotes] = useState(initialData?.notes || '');

  // Teams
  const [teamAName, setTeamAName] = useState(initialData?.teamA?.name || 'Home Team');
  const [teamAScore, setTeamAScore] = useState(initialData?.teamA?.scoreDisplay || '0');
  const [teamAPlayers, setTeamAPlayers] = useState(
    initialData?.teamA?.players || [{ name: '', role: 'Batsman', stats: {} }]
  );

  const [teamBName, setTeamBName] = useState(initialData?.teamB?.name || 'Away Team');
  const [teamBScore, setTeamBScore] = useState(initialData?.teamB?.scoreDisplay || '0');
  const [teamBPlayers, setTeamBPlayers] = useState(
    initialData?.teamB?.players || [{ name: '', role: 'Batsman', stats: {} }]
  );

  // Result
  const [winner, setWinner] = useState(initialData?.result?.winner || 'teamA');
  const [margin, setMargin] = useState(initialData?.result?.margin || '');
  const [resultSummary, setResultSummary] = useState(initialData?.result?.summary || '');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Player row helpers
  const addPlayerA = () => {
    setTeamAPlayers([...teamAPlayers, { name: '', role: 'Player', stats: {} }]);
  };
  const removePlayerA = (idx) => {
    setTeamAPlayers(teamAPlayers.filter((_, i) => i !== idx));
  };
  const updatePlayerA = (idx, field, val) => {
    const updated = [...teamAPlayers];
    updated[idx][field] = val;
    setTeamAPlayers(updated);
  };

  const addPlayerB = () => {
    setTeamBPlayers([...teamBPlayers, { name: '', role: 'Player', stats: {} }]);
  };
  const removePlayerB = (idx) => {
    setTeamBPlayers(teamBPlayers.filter((_, i) => i !== idx));
  };
  const updatePlayerB = (idx, field, val) => {
    const updated = [...teamBPlayers];
    updated[idx][field] = val;
    setTeamBPlayers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !teamAName.trim() || !teamBName.trim()) {
      setErrorMsg('Match title and both team names are required');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const payload = {
      title,
      sport,
      matchType,
      venue,
      matchDate,
      duration,
      visibility,
      notes,
      teamA: {
        name: teamAName,
        scoreDisplay: teamAScore,
        players: teamAPlayers.filter((p) => p.name.trim() !== '')
      },
      teamB: {
        name: teamBName,
        scoreDisplay: teamBScore,
        players: teamBPlayers.filter((p) => p.name.trim() !== '')
      },
      result: {
        winner,
        margin,
        summary: resultSummary
      }
    };

    try {
      if (isEdit && initialData?._id) {
        const res = await api.put(`/scorecards/${initialData._id}`, payload);
        if (res.data.success) {
          navigate(`/scorecards/${initialData._id}`);
        }
      } else {
        const res = await api.post('/scorecards', payload);
        if (res.data.success) {
          navigate(`/scorecards/${res.data.scorecard._id}`);
        }
      }
    } catch (err) {
      console.error('Scorecard save error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to save scorecard.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Basic Match Metadata */}
      <div className="bg-slate-850 p-6 rounded-xl border border-slate-750 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-orange-400">
          1. Match Overview & Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Match Title / Tournament Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Saturday Box Cricket Cup - Quarter Final"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Sport *
            </label>
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
            >
              <option value="cricket">Cricket</option>
              <option value="football">Football / Soccer</option>
              <option value="basketball">Basketball</option>
              <option value="badminton">Badminton</option>
              <option value="tennis">Tennis</option>
              <option value="volleyball">Volleyball</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Match Category
            </label>
            <select
              value={matchType}
              onChange={(e) => setMatchType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
            >
              <option value="friendly">Friendly Match</option>
              <option value="practice">Practice Game</option>
              <option value="local_tournament">Local Tournament</option>
              <option value="amateur">Amateur League</option>
              <option value="personal">Personal Activity</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Venue / Ground
            </label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. KickOff Arena Turf 1 or Riverdale Ground"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Date Played
            </label>
            <input
              type="date"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Visibility Setting
            </label>
            <div className="flex gap-2">
              {[
                { val: 'public', label: 'Public', icon: Globe },
                { val: 'unlisted', label: 'Unlisted (Link only)', icon: EyeOff },
                { val: 'private', label: 'Private (Only Me)', icon: Lock }
              ].map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setVisibility(opt.val)}
                    className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
                      visibility === opt.val
                        ? 'bg-orange-600 border-orange-500 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Match Duration
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 1.5 Hours, 90 mins"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Teams & Scoring Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Team A Box */}
        <div className="bg-slate-850 p-5 rounded-xl border border-slate-750 space-y-4">
          <div className="border-b border-slate-800 pb-2 flex justify-between items-center">
            <h4 className="text-sm font-bold text-white">Team A Information</h4>
            <span className="text-[10px] text-orange-400 font-mono font-bold uppercase">Side A</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Team Name *</label>
            <input
              type="text"
              required
              value={teamAName}
              onChange={(e) => setTeamAName(e.target.value)}
              placeholder="e.g. Horizon CC"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Final Score ({sport === 'cricket' ? 'e.g. 142/6 (16.0)' : sport === 'football' ? 'Goals' : 'Points'})
            </label>
            <input
              type="text"
              value={teamAScore}
              onChange={(e) => setTeamAScore(e.target.value)}
              placeholder="e.g. 142/6 or 3 or 94"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 font-mono text-sm font-bold text-white"
            />
          </div>

          {/* Players Roster */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-300">Player Performances</span>
              <button
                type="button"
                onClick={addPlayerA}
                className="text-[11px] text-orange-400 hover:text-orange-300 flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3 h-3" /> Add Player
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {teamAPlayers.map((p, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) => updatePlayerA(idx, 'name', e.target.value)}
                    placeholder="Player Name"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={p.role}
                    onChange={(e) => updatePlayerA(idx, 'role', e.target.value)}
                    placeholder="Role"
                    className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300"
                  />
                  {teamAPlayers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePlayerA(idx)}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team B Box */}
        <div className="bg-slate-850 p-5 rounded-xl border border-slate-750 space-y-4">
          <div className="border-b border-slate-800 pb-2 flex justify-between items-center">
            <h4 className="text-sm font-bold text-white">Team B Information</h4>
            <span className="text-[10px] text-sky-400 font-mono font-bold uppercase">Side B</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Team Name *</label>
            <input
              type="text"
              required
              value={teamBName}
              onChange={(e) => setTeamBName(e.target.value)}
              placeholder="e.g. Titan Warriors"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Final Score ({sport === 'cricket' ? 'e.g. 138/9 (16.0)' : sport === 'football' ? 'Goals' : 'Points'})
            </label>
            <input
              type="text"
              value={teamBScore}
              onChange={(e) => setTeamBScore(e.target.value)}
              placeholder="e.g. 138/9 or 1 or 88"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 font-mono text-sm font-bold text-white"
            />
          </div>

          {/* Players Roster */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-300">Player Performances</span>
              <button
                type="button"
                onClick={addPlayerB}
                className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3 h-3" /> Add Player
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {teamBPlayers.map((p, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) => updatePlayerB(idx, 'name', e.target.value)}
                    placeholder="Player Name"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={p.role}
                    onChange={(e) => updatePlayerB(idx, 'role', e.target.value)}
                    placeholder="Role"
                    className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300"
                  />
                  {teamBPlayers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePlayerB(idx)}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Match Result & Notes */}
      <div className="bg-slate-850 p-6 rounded-xl border border-slate-750 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
          3. Match Outcome & Notes
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Winner Declared
            </label>
            <select
              value={winner}
              onChange={(e) => setWinner(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
            >
              <option value="teamA">{teamAName || 'Team A'}</option>
              <option value="teamB">{teamBName || 'Team B'}</option>
              <option value="draw">Match Tied / Draw</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Winning Margin
            </label>
            <input
              type="text"
              value={margin}
              onChange={(e) => setMargin(e.target.value)}
              placeholder="e.g. Won by 4 runs or Won 3-1"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Match Highlights / Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe memorable turning points, individual player milestones, or ground conditions"
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate('/scorecards')}
          className="px-5 py-2.5 text-xs font-semibold text-slate-400 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-7 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-orange-600/30"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          <Save className="w-4 h-4" />
          <span>{isEdit ? 'Update Scorecard' : 'Publish & Save Scorecard'}</span>
        </button>
      </div>
    </form>
  );
};

export default DynamicScorecardForm;
