import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Users,
  MapPin,
  Calendar,
  Activity,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Loader2
} from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const [statsRes, logsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/activity-logs')
        ]);
        if (statsRes.data.success) setStats(statsRes.data.stats);
        if (logsRes.data.success) setRecentLogs(logsRes.data.logs);
      } catch (err) {
        console.error('Failed to load admin metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400 text-xs">
        <Loader2 className="w-6 h-6 text-red-500 animate-spin mx-auto mb-2" />
        Loading system telemetry & platform metrics...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-red-400 block mb-1">
            System Administration & Moderation
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-wide uppercase">
            Platform Master Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Oversee user accounts, review pending turf listings, monitor live fixtures, and investigate reports.
          </p>
        </div>

        {/* Quick Nav Links */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/turfs"
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
          >
            <FileCheck className="w-4 h-4" /> Turf Approvals ({stats?.pendingTurfApprovals || 0})
          </Link>
          <Link
            to="/admin/users"
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5"
          >
            <Users className="w-4 h-4 text-sky-400" /> Users ({stats?.totalUsers || 0})
          </Link>
          <Link
            to="/admin/bookings"
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4 text-orange-400" /> Bookings
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-slate-850 p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Users
          </span>
          <span className="text-2xl font-black text-white font-display mt-1 block">
            {stats?.totalUsers || 0}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            {stats?.totalPlayers || 0} Players
          </span>
        </div>

        <div className="bg-slate-850 p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
            Approved Turfs
          </span>
          <span className="text-2xl font-black text-emerald-400 font-display mt-1 block">
            {stats?.approvedTurfs || 0}
          </span>
          <span className="text-[10px] text-amber-400 font-semibold block mt-0.5">
            {stats?.pendingTurfApprovals || 0} Pending Review
          </span>
        </div>

        <div className="bg-slate-850 p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block">
            Total Bookings
          </span>
          <span className="text-2xl font-black text-sky-400 font-display mt-1 block">
            {stats?.totalBookings || 0}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            {stats?.activeBookings || 0} Active Slots
          </span>
        </div>

        <div className="bg-slate-850 p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-live-dot" /> Live Matches
          </span>
          <span className="text-2xl font-black text-red-400 font-display mt-1 block">
            {stats?.liveMatches || 0}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            {stats?.completedMatches || 0} Completed
          </span>
        </div>

        <div className="bg-slate-850 p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
            Scorecards
          </span>
          <span className="text-2xl font-black text-purple-400 font-display mt-1 block">
            {stats?.totalScorecards || 0}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Grassroots Published</span>
        </div>

        <div className="bg-slate-850 p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 block">
            Platform Revenue
          </span>
          <span className="text-2xl font-black text-white font-display mt-1 block">
            ${stats?.totalRevenue || 0}
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">Verified Rentals</span>
        </div>
      </div>

      {/* 2-Column Section: Pending Turfs & System Activity Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Approvals */}
        <div className="bg-slate-850 p-6 rounded-2xl border border-slate-750 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" /> Turfs Awaiting Approval
            </h3>
            <Link to="/admin/turfs" className="text-xs text-orange-400 hover:underline">
              Review Queue →
            </Link>
          </div>

          {stats?.pendingTurfApprovals === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              All registered turfs have been reviewed and approved!
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-slate-300 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">
                  {stats?.pendingTurfApprovals} new facility registrations pending
                </span>
                <span>Check location coordinates, operator credentials, and pricing limits.</span>
              </div>
              <Link
                to="/admin/turfs"
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase"
              >
                Inspect
              </Link>
            </div>
          )}
        </div>

        {/* Audit Activity Logs */}
        <div className="bg-slate-850 p-6 rounded-2xl border border-slate-750 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400" /> Administrative Audit Trail
            </h3>
            <span className="text-[11px] text-slate-400">{recentLogs.length} Events</span>
          </div>

          {recentLogs.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No administrative action events recorded yet.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {recentLogs.map((log) => (
                <div
                  key={log._id}
                  className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-mono text-orange-400 uppercase text-[10px]">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-300">{log.details}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
