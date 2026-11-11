import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ShieldAlert, ChevronLeft, Plus, Trash2, Save, Loader2 } from 'lucide-react';
import api from '../../services/api';

const AvailabilityManager = () => {
  const [turfs, setTurfs] = useState([]);
  const [selectedTurfId, setSelectedTurfId] = useState('');
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const [blockedSlots, setBlockedSlots] = useState([
    { startTime: '12:00', endTime: '14:00', reason: 'Turf Grooming & Routine Maintenance' }
  ]);
  const [isFullyBlocked, setIsFullyBlocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const res = await api.get('/turfs/my-turfs');
        if (res.data.success && res.data.turfs.length > 0) {
          setTurfs(res.data.turfs);
          setSelectedTurfId(res.data.turfs[0]._id);
        }
      } catch (err) {
        console.error('Failed to load operator turfs:', err);
      }
    };

    fetchTurfs();
  }, []);

  const addBlockedSlot = () => {
    setBlockedSlots([
      ...blockedSlots,
      { startTime: '14:00', endTime: '16:00', reason: 'Internal Event / Maintenance' }
    ]);
  };

  const removeBlockedSlot = (idx) => {
    setBlockedSlots(blockedSlots.filter((_, i) => i !== idx));
  };

  const updateSlot = (idx, field, val) => {
    const updated = [...blockedSlots];
    updated[idx][field] = val;
    setBlockedSlots(updated);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedTurfId) return;

    setSubmitting(true);
    setMsg({ type: '', text: '' });
    try {
      const res = await api.post(`/turfs/${selectedTurfId}/block-slots`, {
        date: selectedDate,
        blockedSlots,
        isFullyBlocked
      });
      if (res.data.success) {
        setMsg({ type: 'success', text: 'Slot availability updated successfully!' });
      }
    } catch (err) {
      console.error('Failed to block slots:', err);
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update availability' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <Link
          to="/operator/dashboard"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition mb-2"
        >
          <ChevronLeft className="w-4 h-4" /> Operator Dashboard
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-wide">
          Manage Slot Availability
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Block off custom maintenance hours or reserve arena slots for private internal events.
        </p>
      </div>

      {msg.text && (
        <div
          className={`p-3.5 rounded-xl text-xs ${
            msg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}
        >
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-slate-850 p-6 rounded-2xl border border-slate-750 space-y-6 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Sports Turf
            </label>
            <select
              value={selectedTurfId}
              onChange={(e) => setSelectedTurfId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
            >
              {turfs.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} ({t.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Target Date
            </label>
            <input
              type="date"
              min={todayStr}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
            />
          </div>
        </div>

        {/* Fully block switch */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <input
            type="checkbox"
            id="fullBlock"
            checked={isFullyBlocked}
            onChange={(e) => setIsFullyBlocked(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded bg-slate-800 border-slate-700 focus:ring-0"
          />
          <label htmlFor="fullBlock" className="text-xs text-slate-300 cursor-pointer">
            <span className="font-bold text-white block">Facility Closed Entire Day</span>
            Mark turf as completely unavailable for player bookings on this date.
          </label>
        </div>

        {/* Custom Slot Intervals */}
        {!isFullyBlocked && (
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Blocked Slot Intervals
              </span>
              <button
                type="button"
                onClick={addBlockedSlot}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Block Interval
              </button>
            </div>

            <div className="space-y-2.5">
              {blockedSlots.map((slot, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-slate-900 p-2.5 rounded-lg border border-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateSlot(idx, 'startTime', e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                    />
                    <span className="text-xs text-slate-400">to</span>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateSlot(idx, 'endTime', e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                    />
                  </div>

                  <input
                    type="text"
                    value={slot.reason}
                    onChange={(e) => updateSlot(idx, 'reason', e.target.value)}
                    placeholder="Reason for blocking..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white w-full sm:w-auto"
                  />

                  <button
                    type="button"
                    onClick={() => removeBlockedSlot(idx)}
                    className="text-slate-500 hover:text-red-400 p-1 self-end sm:self-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-emerald-600/30"
          >
            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <Save className="w-3.5 h-3.5" /> Save Availability Overrides
          </button>
        </div>
      </form>
    </div>
  );
};

export default AvailabilityManager;
