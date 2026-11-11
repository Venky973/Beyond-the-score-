import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ShieldCheck, Clock, Calendar, Check, ArrowRight } from 'lucide-react';
import SlotPickerModal from './SlotPickerModal';

const TurfCard = ({ turf, userCoords }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const defaultImg =
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&auto=format&fit=crop&q=80';
  const imgUrl = turf.images?.[0] || defaultImg;

  return (
    <>
      <div className="bg-slate-850 border border-slate-700/80 hover:border-emerald-500/50 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:shadow-black/40 flex flex-col group">
        {/* Image & Badges */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-900">
          <img
            src={imgUrl}
            alt={turf.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {turf.isVerified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-bold shadow-md">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified
              </span>
            )}
            {turf.distance !== null && turf.distance !== undefined && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/90 text-orange-400 border border-orange-500/30 text-[11px] font-bold shadow-md">
                <MapPin className="w-3 h-3" /> {turf.distance} km away
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/90 text-amber-400 text-xs font-bold border border-slate-700">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>{turf.rating || 4.8}</span>
            <span className="text-[10px] text-slate-400">({turf.totalReviews || 12})</span>
          </div>

          {/* Price Tag */}
          <div className="absolute bottom-3 right-3 bg-slate-900/90 text-white px-3 py-1 rounded-lg border border-slate-700 text-xs font-bold">
            <span className="text-emerald-400 text-sm">${turf.rentalPricePerHour}</span>
            <span className="text-slate-400 font-normal"> / hour</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition line-clamp-1">
              {turf.name}
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span>{turf.address}, {turf.city}</span>
            </p>

            {/* Supported Sports */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {turf.supportedSports?.slice(0, 3).map((sp) => (
                <span
                  key={sp}
                  className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-medium text-slate-300 border border-slate-700"
                >
                  {sp}
                </span>
              ))}
            </div>

            {/* Facilities / Amenities */}
            {turf.facilities?.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-400">
                {turf.facilities.slice(0, 3).map((f) => (
                  <span key={f} className="inline-flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-400" /> {f}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Operating hours & Action Buttons */}
          <div className="pt-3 border-t border-slate-850 flex items-center justify-between gap-2">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{turf.operatingHours?.open || '06:00'} - {turf.operatingHours?.close || '23:00'}</span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={`/turfs/${turf._id}`}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold transition"
              >
                Details
              </Link>
              <button
                onClick={() => setModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20"
              >
                Book Slot
              </button>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <SlotPickerModal
          turf={turf}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

export default TurfCard;
