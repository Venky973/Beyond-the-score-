import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, Shield, ChevronLeft, Check, Ban, Loader2 } from 'lucide-react';
import api from '../../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('all');
  const [search, setSearch] = useState('');
  const [togglingId, setTogglingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let url = '/admin/users?limit=50';
      if (role !== 'all') url += `&role=${role}`;
      if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;

      const res = await api.get(url);
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const handleToggleStatus = async (userId) => {
    setTogglingId(userId);
    try {
      const res = await api.put(`/admin/users/${userId}/toggle-status`);
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isActive: res.data.user.isActive } : u))
        );
      }
    } catch (err) {
      console.error('Toggle status error:', err);
      alert(err.response?.data?.message || 'Failed to toggle status');
    } finally {
      setTogglingId(null);
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
            User Account Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Search users, filter by assigned permissions, and manage account activation states.
          </p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-850 p-4 rounded-xl border border-slate-750">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'user', 'player', 'organizer', 'operator', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap capitalize transition ${
                role === r
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {r === 'all' ? 'All Roles' : r}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchUsers();
          }}
          className="relative max-w-xs w-full"
        >
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
          />
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-slate-850 rounded-2xl border border-slate-750 overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            <Loader2 className="w-5 h-5 text-red-500 animate-spin mx-auto mb-2" />
            Loading registered accounts...
          </div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            u.avatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'
                          }
                          alt=""
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <div className="font-bold text-white">{u.name}</div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold uppercase text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-750">
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {u.phone || '—'}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          u.isActive
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {u.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {u.role !== 'admin' && (
                        <button
                          disabled={togglingId === u._id}
                          onClick={() => handleToggleStatus(u._id)}
                          className={`px-3 py-1 rounded text-xs font-semibold transition ${
                            u.isActive
                              ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {togglingId === u._id
                            ? '...'
                            : u.isActive
                            ? 'Suspend'
                            : 'Activate'}
                        </button>
                      )}
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

export default UserManagement;
