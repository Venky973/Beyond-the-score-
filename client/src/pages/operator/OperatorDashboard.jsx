import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  DollarSign,
  Plus,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Loader2
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

const OperatorDashboard = () => {
  const { user } = useAuth();
  const { socket } = useSocket();

  const [turfs, setTurfs] = useState([]);
  const [bookingData, setBookingData] = useState({ analytics: {}, bookings: [] });
  const [loading, setLoading] = useState(true);

  const fetchOperatorData = async () => {
    try {
      const [tRes, bRes] = await Promise.all([
        api.get('/turfs/my-turfs'),
        api.get('/bookings/operator')
      ]);

      if (tRes.data.success) setTurfs(tRes.data.turfs);
      if (bRes.data.success) setBookingData(bRes.data);
    } catch (err) {
      console.error('Failed to load operator data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperatorData();
  }, []);

  // Real-time socket updates for incoming bookings
  useEffect(() => {
    if (!socket) return;

    const handleOperatorBooking = () => {
      fetchOperatorData();
    };

    socket.on('operatorBookingUpdated', handleOperatorBooking);
    return () => socket.off('operatorBookingUpdated', handleOperatorBooking);
  }, [socket]);

  const analytics = bookingData.analytics || {};
  const pendingRequests = bookingData.bookings?.filter((b) => b.status === 'pending') || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            Sports Facility Management System
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-wide uppercase">
            Turf Operator Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your registered sports arenas, approve player reservations, and monitor real rental earnings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/operator/availability"
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-750 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4 text-emerald-400" /> Slot Availability
          </Link>
          <Link
            to="/operator/register-turf"
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" /> Register New Facility
          </Link>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-850 p-5 rounded-xl border border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            My Facilities
          </span>
          <span className="text-3xl font-black text-white font-display mt-1 block">
            {turfs.length}
          </span>
        </div>

        <div className="bg-slate-850 p-5 rounded-xl border border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
            Pending Requests
          </span>
          <span className="text-3xl font-black text-amber-400 font-display mt-1 block">
            {analytics.pendingBookings || 0}
          </span>
        </div>

        <div className="bg-slate-850 p-5 rounded-xl border border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
            Confirmed Bookings
          </span>
          <span className="text-3xl font-black text-emerald-400 font-display mt-1 block">
            {analytics.confirmedBookings || 0}
          </span>
        </div>

        <div className="bg-slate-850 p-5 rounded-xl border border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-white block">
            Recorded Revenue
          </span>
          <span className="text-3xl font-black text-white font-display mt-1 block">
            ${analytics.totalRevenue || 0}
          </span>
        </div>
      </div>

      {/* Pending Booking Requests Banner */}
      {pendingRequests.length > 0 && (
        <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">
                You have {pendingRequests.length} incoming booking requests waiting for review!
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Review dates and time slots to confirm or decline player reservations.
              </p>
            </div>
          </div>

          <Link
            to="/operator/bookings"
            className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition whitespace-nowrap"
          >
            Review Requests Now →
          </Link>
        </div>
      )}

      {/* My Facilities Section */}
      <div className="bg-slate-850 p-6 rounded-2xl border border-slate-750 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" /> My Registered Sports Arenas
          </h3>
          <Link to="/operator/register-turf" className="text-xs text-emerald-400 hover:underline">
            + Add Another Turf
          </Link>
        </div>

        {turfs.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs space-y-2">
            <p>You haven't listed any sports facilities yet.</p>
            <Link
              to="/operator/register-turf"
              className="inline-block px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs"
            >
              Register Facility Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {turfs.map((t) => (
              <div
                key={t._id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      t.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {t.status === 'approved' ? 'Live & Verified' : 'Pending Verification'}
                  </span>
                  <span className="font-mono font-bold text-white text-xs">
                    ${t.rentalPricePerHour}/hr
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm line-clamp-1">{t.name}</h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {t.address}, {t.city}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{t.supportedSports?.join(', ')}</span>
                  <Link
                    to={`/turfs/${t._id}`}
                    className="text-emerald-400 font-semibold hover:underline"
                  >
                    Public View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OperatorDashboard;
