import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trophy, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const CreateCompetition = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [sport, setSport] = useState('cricket');
  const [category, setCategory] = useState('domestic');
  const [season, setSeason] = useState('2026');
  const [venue, setVenue] = useState('');
  const [description, setDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Competition name is required.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await api.post('/competitions', {
        name,
        sport,
        category,
        season,
        venue,
        description
      });
      if (res.data.success) {
        navigate('/organizer/dashboard');
      }
    } catch (err) {
      console.error('Create competition error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to create competition.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <Link
          to="/organizer/dashboard"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition mb-2"
        >
          <ChevronLeft className="w-4 h-4" /> Organizer Dashboard
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-wide">
          Create Tournament / League
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Organize an official sporting competition, register participating clubs, and schedule ties.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-slate-850 p-6 rounded-2xl border border-slate-750 space-y-4 shadow-xl"
      >
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Competition Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Metro Super Cricket Trophy 2026"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Sport</label>
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
            >
              <option value="cricket">Cricket</option>
              <option value="football">Football</option>
              <option value="basketball">Basketball</option>
              <option value="badminton">Badminton</option>
              <option value="tennis">Tennis</option>
              <option value="volleyball">Volleyball</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tier / Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
            >
              <option value="national">National League</option>
              <option value="domestic">Domestic Division</option>
              <option value="state">State Tournament</option>
              <option value="local">Local Cup</option>
              <option value="amateur">Amateur Series</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Season / Year</label>
            <input
              type="text"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Venue</label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. National Sports Complex"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Tournament Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe rules, prize pool, or tournament structure..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
          />
        </div>

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
            Save & Publish Competition
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCompetition;
