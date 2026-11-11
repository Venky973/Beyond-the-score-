import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trophy, ChevronLeft, Plus, AlertCircle, Loader2 } from 'lucide-react';
import api from '../../services/api';

const CreateMatch = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [sport, setSport] = useState('football');
  const [category, setCategory] = useState('local');
  const [competitionName, setCompetitionName] = useState('City League Series');
  const [venue, setVenue] = useState('');
  const [scheduledAt, setScheduledAt] = useState(
    new Date(Date.now() + 2 * 3600 * 1000).toISOString().slice(0, 16)
  );

  const [teamAName, setTeamAName] = useState('');
  const [teamAShort, setTeamAShort] = useState('');
  const [teamALogo, setTeamALogo] = useState('');

  const [teamBName, setTeamBName] = useState('');
  const [teamBShort, setTeamBShort] = useState('');
  const [teamBLogo, setTeamBLogo] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !teamAName.trim() || !teamBName.trim() || !venue.trim()) {
      setErrorMsg('Title, venue, and both team names are required.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await api.post('/matches', {
        title,
        sport,
        category,
        competitionName,
        venue,
        scheduledAt,
        teamA: {
          name: teamAName,
          shortName: teamAShort || teamAName.slice(0, 3).toUpperCase(),
          logo: teamALogo
        },
        teamB: {
          name: teamBName,
          shortName: teamBShort || teamBName.slice(0, 3).toUpperCase(),
          logo: teamBLogo
        }
      });

      if (res.data.success) {
        navigate(`/matches/${res.data.match._id}`);
      }
    } catch (err) {
      console.error('Create match error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to create match fixture.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <Link
          to="/organizer/dashboard"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition mb-2"
        >
          <ChevronLeft className="w-4 h-4" /> Organizer Dashboard
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-wide">
          Schedule Official Match
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Create an official fixture on Beyond The Score that you can live-score and broadcast to fans.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Match Info */}
        <div className="bg-slate-850 p-6 rounded-2xl border border-slate-750 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-orange-400">
            Fixture Specifications
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Match Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Metro Invitational Semi-Final"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Sport *</label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              >
                <option value="cricket">Cricket</option>
                <option value="football">Football</option>
                <option value="basketball">Basketball</option>
                <option value="tennis">Tennis</option>
                <option value="badminton">Badminton</option>
                <option value="volleyball">Volleyball</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Competition Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              >
                <option value="international">International</option>
                <option value="national">National</option>
                <option value="domestic">Domestic Tournament</option>
                <option value="state">State-Level Competition</option>
                <option value="local">Local League</option>
                <option value="amateur">Amateur League</option>
                <option value="friendly">Friendly Match</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tournament / Competition Name
              </label>
              <input
                type="text"
                value={competitionName}
                onChange={(e) => setCompetitionName(e.target.value)}
                placeholder="e.g. Premier Super Cup 2026"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Venue / Stadium *
              </label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Central Football Complex, Pitch A"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Scheduled Date & Kick-off Time
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Participating Teams */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Team A */}
          <div className="bg-slate-850 p-5 rounded-xl border border-slate-750 space-y-3">
            <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              Team A (Home Side)
            </h4>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Team Name *
              </label>
              <input
                type="text"
                required
                value={teamAName}
                onChange={(e) => setTeamAName(e.target.value)}
                placeholder="e.g. Apex Strikers"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Short Name (3-4 Chars)
              </label>
              <input
                type="text"
                value={teamAShort}
                onChange={(e) => setTeamAShort(e.target.value)}
                placeholder="e.g. APX"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white uppercase font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Logo Image URL
              </label>
              <input
                type="text"
                value={teamALogo}
                onChange={(e) => setTeamALogo(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Team B */}
          <div className="bg-slate-850 p-5 rounded-xl border border-slate-750 space-y-3">
            <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
              Team B (Away Side)
            </h4>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Team Name *
              </label>
              <input
                type="text"
                required
                value={teamBName}
                onChange={(e) => setTeamBName(e.target.value)}
                placeholder="e.g. Thunderbolts SC"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Short Name (3-4 Chars)
              </label>
              <input
                type="text"
                value={teamBShort}
                onChange={(e) => setTeamBShort(e.target.value)}
                placeholder="e.g. TB"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white uppercase font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Logo Image URL
              </label>
              <input
                type="text"
                value={teamBLogo}
                onChange={(e) => setTeamBLogo(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/organizer/dashboard')}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-orange-600/30"
          >
            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Schedule & Open Match Scorer
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMatch;
