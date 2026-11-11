import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  User,
  Phone,
  Mail,
  Loader2,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';

const BookingRequests = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [processingId, setProcessingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let url = '/bookings/operator';
      if (filterStatus !== 'all') url += `?status=${filterStatus}`;
      const res = await api.get(url);
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Failed to load operator bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    let operatorNotes = '';
    if (newStatus === 'rejected') {
      operatorNotes = prompt('Please provide reason for declining this reservation (optional):') || '';
    }

    setProcessingId(bookingId);
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, {
        status: newStatus,
        operatorNotes
      });
      if (res.data.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus, operatorNotes } : b))
        );
      }
    } catch (err) {
      console.error('Update status error:', err);
      alert(err.response?.data?.message || 'Failed to update booking status');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <Link
            to="/operator/dashboard"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition mb-2"
          >
            <ChevronLeft className="w-4 h-4" /> Operator Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-wide uppercase">
            Facility Booking Requests
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review incoming player reservation requests, accept slots, or decline conflicting schedules.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 max-w-md">
        {[
          { id: 'all', label: 'All' },
          { id: 'pending', label: 'Pending' },
          { id: 'confirmed', label: 'Confirmed' },
          { id: 'completed', label: 'Completed' },
          { id: 'rejected', label: 'Rejected' }
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

      {/* Bookings Table / Cards */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          <Loader2 className="w-5 h-5 text-emerald-500 animate-spin mx-auto mb-2" />
          Loading reservation requests...
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-xs space-y-2">
          <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="font-semibold text-slate-300">No booking records found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-slate-850 border border-slate-750 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg"
            >
              <div className="space-y-2 flex-1">
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
                        : b.status === 'rejected' || b.status === 'cancelled'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-slate-750 text-slate-300'
                    }`}
                  >
                    {b.status}
                  </span>
                  <span className="text-white font-bold text-sm">• {b.turf?.name}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                  <span className="flex items-center gap-1 text-slate-400">
                    <User className="w-3.5 h-3.5" />
                    <b className="text-white">{b.user?.name}</b> ({b.user?.email})
                  </span>
                  {b.user?.phone && (
                    <span className="flex items-center gap-1 text-slate-400">
                      <Phone className="w-3.5 h-3.5" /> {b.user.phone}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                  <span className="flex items-center gap-1 font-semibold text-white">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" /> {b.bookingDate}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-emerald-400 font-semibold">
                    <Clock className="w-3.5 h-3.5" /> {b.startTime} - {b.endTime}
                  </span>
                  <span className="font-mono font-bold text-white">
                    Fee: ${b.rentalPrice}
                  </span>
                  <span className="text-slate-400">Sport: {b.sport}</span>
                </div>

                {b.notes && (
                  <p className="text-xs text-slate-400 italic bg-slate-900 p-2 rounded">
                    Player Note: "{b.notes}"
                  </p>
                )}
              </div>

              {/* Action Buttons for Operator */}
              <div className="flex items-center gap-2 self-end md:self-center">
                {b.status === 'pending' && (
                  <>
                    <button
                      disabled={processingId === b._id}
                      onClick={() => handleUpdateStatus(b._id, 'confirmed')}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-md shadow-emerald-600/20"
                    >
                      Accept Slot
                    </button>
                    <button
                      disabled={processingId === b._id}
                      onClick={() => handleUpdateStatus(b._id, 'rejected')}
                      className="px-3.5 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition"
                    >
                      Decline
                    </button>
                  </>
                )}

                {b.status === 'confirmed' && (
                  <button
                    disabled={processingId === b._id}
                    onClick={() => handleUpdateStatus(b._id, 'completed')}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                  >
                    Mark Completed
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

export default BookingRequests;
