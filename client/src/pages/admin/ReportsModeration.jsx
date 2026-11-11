import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, ChevronLeft, Loader2 } from 'lucide-react';
import api from '../../services/api';

const ReportsModeration = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('pending');
  const [processingId, setProcessingId] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/reports?status=${status}`);
      if (res.data.success) {
        setReports(res.data.reports);
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [status]);

  const handleResolve = async (reportId, action) => {
    setProcessingId(reportId);
    try {
      const res = await api.put(`/admin/reports/${reportId}`, {
        status: action === 'resolve' ? 'resolved' : 'dismissed',
        resolutionNotes: `Action taken by administrator (${action})`
      });
      if (res.data.success) {
        setReports((prev) => prev.filter((r) => r._id !== reportId));
      }
    } catch (err) {
      console.error('Resolve report error:', err);
      alert('Failed to update report');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition mb-2"
          >
            <ChevronLeft className="w-4 h-4" /> Admin Console
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-wide uppercase">
            Content Moderation & Safety
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Investigate reported custom scorecards, turf reviews, and platform conduct violations.
          </p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 max-w-xs">
        {['pending', 'resolved', 'dismissed'].map((st) => (
          <button
            key={st}
            onClick={() => setStatus(st)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
              status === st ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          <Loader2 className="w-5 h-5 text-orange-500 animate-spin mx-auto mb-2" />
          Loading reports...
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-xs space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-white">No Flagged Items</h3>
          <p>No content violations are currently under review in this queue.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <div
              key={r._id}
              className="bg-slate-850 border border-slate-750 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950/40 border border-red-500/30 px-2 py-0.5 rounded">
                    Reported {r.targetType}
                  </span>
                  <span className="text-xs text-slate-400">
                    By: {r.reporter?.name} ({r.reporter?.email})
                  </span>
                </div>

                <h4 className="font-bold text-white text-sm">Reason: {r.reason}</h4>
                {r.description && (
                  <p className="text-xs text-slate-300 italic bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    "{r.description}"
                  </p>
                )}
                <span className="text-[10px] text-slate-500 block">
                  Reported on {new Date(r.createdAt).toLocaleString()}
                </span>
              </div>

              {status === 'pending' && (
                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    disabled={processingId === r._id}
                    onClick={() => handleResolve(r._id, 'resolve')}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase"
                  >
                    Take Action & Resolve
                  </button>
                  <button
                    disabled={processingId === r._id}
                    onClick={() => handleResolve(r._id, 'dismiss')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsModeration;
