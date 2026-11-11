import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Search, ChevronLeft, MapPin, Loader2 } from 'lucide-react';
import api from '../../services/api';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');
  const [date, setDate] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let url = '/admin/bookings?limit=50';
      if (status !== 'all') url += `&status=${status}`;
      if (date) url += `&date=${date}`;

      const res = await api.get(url);
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Failed to load admin bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [status, date]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition mb-2"
          >
            <ChevronLeft className="w-4 h-4" /> Admin Console
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-wide uppercase">
            Global Booking Registry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Audit platform reservations across all sports facilities and resolve booking disputes.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-850 p-4 rounded-xl border border-slate-750">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap capitalize transition ${
                status === st
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st === 'all' ? 'All Statuses' : st}
            </button>
          ))}
        </div>

        <div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-850 rounded-2xl border border-slate-750 overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            <Loader2 className="w-5 h-5 text-orange-500 animate-spin mx-auto mb-2" />
            Loading reservations...
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">No bookings found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Ref ID</th>
                  <th className="py-3 px-4">Turf Facility</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Date & Slot</th>
                  <th className="py-3 px-4">Sport</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-orange-400">
                      #{b.bookingId}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      {b.turf?.name} <span className="text-slate-400 text-[11px] font-normal">({b.turf?.city})</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-white font-medium">{b.user?.name}</div>
                      <div className="text-[11px] text-slate-400">{b.user?.email}</div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <div>{b.bookingDate}</div>
                      <div className="text-emerald-400 text-[11px]">{b.startTime} - {b.endTime}</div>
                    </td>
                    <td className="py-3 px-4">{b.sport}</td>
                    <td className="py-3 px-4 font-mono font-bold text-white">${b.rentalPrice}</td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : b.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingManagement;
