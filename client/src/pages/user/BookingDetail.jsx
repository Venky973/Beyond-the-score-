import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Clock,
  Phone,
  Mail,
  Receipt,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Printer
} from 'lucide-react';
import api from '../../services/api';

const BookingDetail = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${id}`);
        if (res.data.success) {
          setBooking(res.data.booking);
        }
      } catch (err) {
        console.error('Failed to load booking:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400 text-xs">
        <Loader2 className="w-6 h-6 text-emerald-500 animate-spin mx-auto mb-2" />
        Loading booking reservation voucher...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-3">
        <h2 className="text-xl font-bold text-white">Booking Not Found</h2>
        <Link to="/bookings/my" className="text-emerald-400 text-xs hover:underline inline-block">
          Return to My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/bookings/my"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ChevronLeft className="w-4 h-4" /> My Bookings
        </Link>

        <button
          onClick={() => window.print()}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition flex items-center gap-1.5"
        >
          <Printer className="w-3.5 h-3.5" /> Print Receipt
        </button>
      </div>

      {/* Booking Receipt Card */}
      <div className="bg-sports-dark border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 text-xs gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
              Official Reservation Voucher
            </span>
            <span className="font-mono text-base font-bold text-white">
              Ref: #{booking.bookingId}
            </span>
          </div>

          <span
            className={`self-start sm:self-auto text-xs font-bold uppercase px-3 py-1 rounded-full ${
              booking.status === 'confirmed'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : booking.status === 'pending'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}
          >
            Status: {booking.status}
          </span>
        </div>

        {/* Facility Details */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">{booking.turf?.name}</h2>
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span>{booking.turf?.address}, {booking.turf?.city}</span>
          </p>
        </div>

        {/* Booking Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Sport</span>
            <span className="font-bold text-white mt-0.5 block">{booking.sport}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Date</span>
            <span className="font-bold text-white mt-0.5 block">{booking.bookingDate}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Reserved Slot</span>
            <span className="font-bold font-mono text-emerald-400 mt-0.5 block">
              {booking.startTime} - {booking.endTime}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Total Cost</span>
            <span className="font-bold font-mono text-white text-sm mt-0.5 block">
              ${booking.rentalPrice}
            </span>
          </div>
        </div>

        {/* Operator Notes or Cancellation reason if any */}
        {booking.operatorNotes && (
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-750 text-xs">
            <span className="font-bold text-slate-300 block mb-1">Operator Remarks</span>
            <p className="text-slate-400">{booking.operatorNotes}</p>
          </div>
        )}

        {booking.cancellationReason && (
          <div className="bg-red-950/20 border border-red-500/30 p-4 rounded-xl text-xs text-red-300">
            <span className="font-bold block mb-1">Cancellation Reason</span>
            <p>{booking.cancellationReason}</p>
          </div>
        )}

        {/* Contact Strip */}
        <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span>Booked by: </span>
            <span className="text-white font-semibold">{booking.user?.name}</span> (
            {booking.user?.email})
          </div>
          <div className="text-[11px] text-slate-500">
            Created on {new Date(booking.createdAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
