import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Mail, ChevronLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '', token: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '', token: '' });

    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        setMsg({
          type: 'success',
          text: res.data.message,
          token: res.data.resetToken
        });
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to process request.'
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
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-orange-400">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white font-display uppercase tracking-wide">
            Reset Password
          </h2>
          <p className="text-xs text-slate-400">
            Enter your registered account email to generate a password recovery token.
          </p>
        </div>

        {msg.text && (
          <div
            className={`p-3.5 rounded-xl text-xs ${
              msg.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}
          >
            <p>{msg.text}</p>
            {msg.token && (
              <div className="mt-3 pt-2 border-t border-emerald-500/20">
                <Link
                  to={`/reset-password?token=${msg.token}`}
                  className="font-bold underline text-white hover:text-emerald-300"
                >
                  Click here to proceed to Password Reset Form →
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Registered Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Generate Reset Token
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
