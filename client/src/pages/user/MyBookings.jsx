import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, AlertCircle, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import api from '../../services/api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let url = '/bookings/my-bookings';
      if (filterStatus !== 'all') url += `?status=${filterStatus}`;
      const res = await api.get(url);
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking reservation?')) return;
    setCancellingId(bookingId);
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, {
        status: 'cancelled',
        cancellationReason: 'Cancelled by player via dashboard'
      });
      if (res.data.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: 'cancelled' } : b))
        );
      }
    } catch (err) {
      console.error('Cancel booking error:', err);
      alert(err.response?.data?.message || 'Failed to cancel reservation');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            Reservations
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-wide uppercase">
            My Turf Bookings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track your upcoming match slots, past reservations, and confirmation statuses.
          </p>
        </div>

        <Link
          to="/turfs"
          className="self-start sm:self-auto px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-md shadow-emerald-600/20"
        >
          Book Another Turf
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 max-w-md">
        {[
          { id: 'all', label: 'All' },
          { id: 'pending', label: 'Pending' },
          { id: 'confirmed', label: 'Confirmed' },
          { id: 'completed', label: 'Completed' },
          { id: 'cancelled', label: 'Cancelled' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterStatus === tab.id
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          <Loader2 className="w-5 h-5 text-emerald-500 animate-spin mx-auto mb-2" />
          Loading your reservations...
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-xs space-y-2">
          <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="font-semibold text-slate-300">No bookings found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-slate-850 border border-slate-750 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-orange-400">
                    #{b.bookingId}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      b.status === 'confirmed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : b.status === 'pending'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : b.status === 'cancelled'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {b.status}
                  </span>
                  <span className="text-slate-400 text-xs font-medium">• {b.sport}</span>
                </div>

                <h3 className="text-base font-bold text-white">{b.turf?.name}</h3>

                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span>{b.turf?.address}, {b.turf?.city}</span>
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <b>{b.bookingDate}</b>
                  </span>
                  <span className="flex items-center gap-1 font-mono text-emerald-400 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    {b.startTime} - {b.endTime} ({b.durationHours} hrs)
                  </span>
                  <span className="font-mono font-bold text-white">
                    Total: ${b.rentalPrice}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2.5 self-end md:self-center">
                <Link
                  to={`/bookings/${b._id}`}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  View Slip
                </Link>

                {(b.status === 'pending' || b.status === 'confirmed') && (
                  <button
                    disabled={cancellingId === b._id}
                    onClick={() => handleCancelBooking(b._id)}
                    className="px-3.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold transition"
                  >
                    {cancellingId === b._id ? 'Cancelling...' : 'Cancel'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
