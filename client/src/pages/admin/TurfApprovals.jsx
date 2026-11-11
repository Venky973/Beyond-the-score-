import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  DollarSign,
  User,
  Loader2,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';

const TurfApprovals = () => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchPendingTurfs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/turf-approvals');
      if (res.data.success) {
        setTurfs(res.data.turfs);
      }
    } catch (err) {
      console.error('Failed to load turf approvals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingTurfs();
  }, []);

  const handleReview = async (turfId, status) => {
    let rejectionReason = '';
    if (status === 'rejected') {
      rejectionReason = prompt('Reason for declining this turf listing (optional):') || '';
    }

    setProcessingId(turfId);
    try {
      const res = await api.put(`/admin/turf-approvals/${turfId}`, {
        status,
        rejectionReason
      });
      if (res.data.success) {
        setTurfs((prev) => prev.filter((t) => t._id !== turfId));
      }
    } catch (err) {
      console.error('Turf review error:', err);
      alert(err.response?.data?.message || 'Failed to review turf');
    } finally {
      setProcessingId(null);
    }
  };

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
            Turf Facility Verification Queue
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review newly registered sports grounds and verify synthetic standards, pricing, and operating rules.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          <Loader2 className="w-6 h-6 text-emerald-500 animate-spin mx-auto mb-2" />
          Loading verification requests...
        </div>
      ) : turfs.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-xs space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-white">All Clear!</h3>
          <p>There are no turf registrations currently pending admin review.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {turfs.map((t) => (
            <div
              key={t._id}
              className="bg-slate-850 border border-slate-750 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row gap-6 items-start"
            >
              <img
                src={
                  t.images?.[0] ||
                  'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400'
                }
                alt={t.name}
                className="w-full md:w-56 h-40 rounded-xl object-cover border border-slate-700 bg-slate-900 flex-shrink-0"
              />

              <div className="flex-1 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded">
                    Pending Verification
                  </span>
                  <span className="font-mono text-emerald-400 font-bold text-xs">
                    ${t.rentalPricePerHour}/hr
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">{t.name}</h3>

                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span>{t.address}, {t.city}, {t.state} {t.zipCode}</span>
                </p>

                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    Operator: <b className="text-white">{t.operator?.name}</b> ({t.operator?.email})
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">{t.description}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {t.supportedSports?.map((sp) => (
                    <span
                      key={sp}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-750 text-[10px] text-slate-300"
                    >
                      {sp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto justify-end">
                <button
                  disabled={processingId === t._id}
                  onClick={() => handleReview(t._id, 'approved')}
                  className="flex-1 md:flex-none px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-md shadow-emerald-600/20"
                >
                  Approve Facility
                </button>
                <button
                  disabled={processingId === t._id}
                  onClick={() => handleReview(t._id, 'rejected')}
                  className="flex-1 md:flex-none px-4 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TurfApprovals;
