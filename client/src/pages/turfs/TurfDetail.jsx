import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Star,
  ShieldCheck,
  Clock,
  Phone,
  Mail,
  Check,
  ChevronLeft,
  Calendar,
  Share2,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import api from '../../services/api';
import SlotPickerModal from '../../components/turf/SlotPickerModal';

const TurfDetail = () => {
  const { id } = useParams();
  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    const fetchTurf = async () => {
      try {
        const res = await api.get(`/turfs/${id}`);
        if (res.data.success) {
          setTurf(res.data.turf);
        }
      } catch (err) {
        console.error('Failed to load turf:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTurf();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400 text-xs">
        <Loader2 className="w-6 h-6 text-emerald-500 animate-spin mx-auto mb-2" />
        Loading sports facility details...
      </div>
    );
  }

  if (!turf) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-3">
        <h2 className="text-xl font-bold text-white">Turf Facility Not Found</h2>
        <p className="text-slate-400 text-xs">This facility is unavailable or has been removed.</p>
        <Link to="/turfs" className="text-emerald-400 text-xs hover:underline inline-block">
          Return to Turf Directory
        </Link>
      </div>
    );
  }

  const images = turf.images?.length > 0
    ? turf.images
    : ['https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1000'];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          to="/turfs"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ChevronLeft className="w-4 h-4" /> All Sports Turfs
        </Link>
      </div>

      {/* Main Grid: Gallery & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image Gallery & Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Photo */}
          <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl">
            <img
              src={images[activeImageIdx]}
              alt={turf.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {turf.isVerified && (
              <span className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-lg">
                <ShieldCheck className="w-4 h-4" /> Verified Turf Facility
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  className={`w-20 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition ${
                    activeImageIdx === i ? 'border-emerald-500 scale-95' : 'border-slate-850 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Facility Description */}
          <div className="bg-slate-850 p-6 rounded-2xl border border-slate-750 space-y-3">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              About This Sports Arena
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {turf.description ||
                'Championship standard sports ground equipped with superior shock pads, high lux LED floodlights for night matches, and dedicated changing amenities.'}
            </p>
          </div>

          {/* Amenities & Facilities Checklist */}
          <div className="bg-slate-850 p-6 rounded-2xl border border-slate-750 space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Provided Facilities & Amenities
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-300">
              {turf.facilities?.map((f) => (
                <div key={f} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Hours, Contact, & Booking Action */}
        <div className="space-y-6">
          <div className="bg-sports-dark border border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-5">
            <div>
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-1">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{turf.rating || 4.8}</span>
                <span className="text-slate-400 font-normal">({turf.totalReviews || 12} player reviews)</span>
              </div>
              <h1 className="text-2xl font-bold text-white">{turf.name}</h1>
              <p className="text-xs text-slate-400 mt-1 flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <span>{turf.address}, {turf.city}, {turf.state} {turf.zipCode}</span>
              </p>
            </div>

            {/* Price banner */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Rental Charges</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  ${turf.rentalPricePerHour}
                </span>
                <span className="text-xs text-slate-400"> / hour</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded">
                Instant Confirmation
              </span>
            </div>

            {/* Operating Hours */}
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> Daily Hours:
                </span>
                <span className="font-semibold text-white">
                  {turf.operatingHours?.open || '06:00'} - {turf.operatingHours?.close || '23:00'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Available Days:</span>
                <span className="font-semibold text-emerald-400">Monday - Sunday</span>
              </div>
            </div>

            {/* Supported Sports */}
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">Supported Sports</span>
              <div className="flex flex-wrap gap-1.5">
                {turf.supportedSports?.map((sp) => (
                  <span
                    key={sp}
                    className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200"
                  >
                    {sp}
                  </span>
                ))}
              </div>
            </div>

            {/* Booking CTA Button */}
            <button
              onClick={() => setModalOpen(true)}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Book Available Slot
            </button>

            {/* Contact details */}
            <div className="pt-4 border-t border-slate-800 text-xs space-y-2 text-slate-400">
              <span className="font-bold text-slate-300 block text-[11px] uppercase tracking-wider">
                Operator Contact
              </span>
              {turf.contactPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{turf.contactPhone}</span>
                </div>
              )}
              {turf.contactEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{turf.contactEmail}</span>
                </div>
              )}
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
    </div>
  );
};

export default TurfDetail;
