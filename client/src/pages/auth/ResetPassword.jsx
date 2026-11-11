import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, ChevronLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [token, setToken] = useState(searchParams.get('token') || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setLoading(true);
    setMsg({ type: '', text: '' });
    try {
      const res = await api.post('/auth/reset-password', {
        token,
        newPassword
      });
      if (res.data.success) {
        setMsg({ type: 'success', text: res.data.message });
        setTimeout(() => navigate('/login'), 2500);
      }
    } catch (err) {
      console.error('Reset error:', err);
      setMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to reset password.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-sports-dark border border-slate-700/80 p-8 rounded-2xl shadow-2xl">
        <Link
          to="/login"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Login
        </Link>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-emerald-400">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white font-display uppercase tracking-wide">
            Enter New Password
          </h2>
          <p className="text-xs text-slate-400">
            Choose a secure replacement password of at least 6 characters.
          </p>
        </div>

        {msg.text && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              msg.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}
          >
            {msg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{msg.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Reset Security Token *
            </label>
            <input
              type="text"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="reset-xxxx"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              New Password *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Confirm New Password *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Reset Password & Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
