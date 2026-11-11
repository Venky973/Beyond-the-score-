import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, CheckCircle2, AlertCircle, X, Loader2, DollarSign } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const SlotPickerModal = ({ turf, onClose, onBookingSuccess }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSport, setSelectedSport] = useState(turf.supportedSports?.[0] || 'Football');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successBooking, setSuccessBooking] = useState(null);

  // Fetch slots whenever turf or date changes
  useEffect(() => {
    const fetchSlots = async () => {
      setLoadingSlots(true);
      setErrorMsg('');
      setSelectedSlot(null);
      try {
        const res = await api.get(`/turfs/${turf._id}/slots?date=${selectedDate}`);
        if (res.data.success) {
          setSlots(res.data.slots);
        }
      } catch (err) {
        console.error('Failed to load slots:', err);
        setErrorMsg('Could not fetch slot availability. Please try again.');
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [turf._id, selectedDate]);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnUrl: `/turfs/${turf._id}` } });
      return;
    }

    if (!selectedSlot) {
      setErrorMsg('Please select an available time slot.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await api.post('/bookings', {
        turfId: turf._id,
        sport: selectedSport,
        bookingDate: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        notes
      });

      if (res.data.success) {
        setSuccessBooking(res.data.booking);
        if (onBookingSuccess) onBookingSuccess(res.data.booking);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Booking reservation failed. Please check slot availability.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-sports-dark border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400 block mb-1">
            Reserve Turf Slot
          </span>
          <h2 className="text-xl font-bold text-white">{turf.name}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {turf.address}, {turf.city} • <span className="text-emerald-400 font-semibold">${turf.rentalPricePerHour}/hour</span>
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successBooking ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Booking Confirmed!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Your reservation request for <b className="text-white">{selectedDate}</b> from{' '}
              <b className="text-white">{successBooking.startTime} to {successBooking.endTime}</b> has been received.
              Reference ID: <span className="font-mono text-orange-400 font-bold">{successBooking.bookingId}</span>
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => navigate(`/bookings/${successBooking._id}`)}
                className="px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold transition"
              >
                View Booking Details
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Date and Sport Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange-400" /> Choose Booking Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Sport
                </label>
                <select
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  {turf.supportedSports?.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Slots Matrix */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" /> Select 1-Hour Time Slot
                </span>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-600" />
                    Available
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    Selected
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-900/60" />
                    Booked
                  </span>
                </div>
              </div>

              {loadingSlots ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  <Loader2 className="w-5 h-5 text-orange-500 animate-spin mx-auto mb-2" />
                  Loading available turf slots...
                </div>
              ) : slots.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs bg-slate-900 rounded-lg border border-slate-800">
                  No slots configured for this date.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto p-1">
                  {slots.map((s, idx) => {
                    const isAvailable = s.status === 'available';
                    const isSelected =
                      selectedSlot?.startTime === s.startTime &&
                      selectedSlot?.endTime === s.endTime;

                    let btnClass = 'bg-slate-850 hover:bg-slate-800 border-slate-700 text-slate-200 cursor-pointer';
                    if (!isAvailable) {
                      btnClass = 'bg-slate-900/50 border-slate-850 text-slate-600 cursor-not-allowed line-through';
                    }
                    if (isSelected) {
                      btnClass = 'bg-orange-600 border-orange-500 text-white font-bold ring-2 ring-orange-500/30';
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => setSelectedSlot(s)}
                        className={`p-2.5 rounded-lg border text-xs font-mono transition flex flex-col items-center justify-center ${btnClass}`}
                      >
                        <span>{s.startTime} - {s.endTime}</span>
                        <span className="text-[10px] font-sans opacity-80 mt-0.5">
                          {isAvailable ? `$${s.price}` : s.status.toUpperCase()}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Booking Notes / Requests (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Need football bibs, referee, or ball pump"
                rows={2}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Price Summary & Submit */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">Total Due</span>
                <span className="text-xl font-bold text-white font-mono">
                  ${selectedSlot ? turf.rentalPricePerHour : 0}
                </span>
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!selectedSlot || submitting}
                  onClick={handleBooking}
                  className="px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-orange-600/30"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {submitting ? 'Confirming Slot...' : 'Confirm Reservation'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotPickerModal;
