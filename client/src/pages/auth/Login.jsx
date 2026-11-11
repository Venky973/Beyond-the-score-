import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Trophy, Mail, Lock, LogIn, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await login(email, password);
      if (data.user?.role === 'admin') navigate('/admin/dashboard');
      else if (data.user?.role === 'operator') navigate('/operator/dashboard');
      else if (data.user?.role === 'organizer') navigate('/organizer/dashboard');
      else if (data.user?.role === 'player') navigate('/dashboard');
      else navigate(from);
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg(err.response?.data?.message || err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-click test credentials helper
  const quickFill = (testEmail) => {
    setEmail(testEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-sports-dark border border-slate-700/80 p-8 rounded-2xl shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto shadow-lg shadow-orange-500/20">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white font-display uppercase tracking-wide">
            Sign In To Beyond The Score
          </h2>
          <p className="text-xs text-slate-400">
            Enter your credentials to manage scorecards, turf slots, or platform operations.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1-Click Test Credentials Buttons */}
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Demo 1-Click Credentials (password: password123)
          </span>
          <div className="flex flex-wrap justify-center gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => quickFill('admin@beyondthescore.com')}
              className="px-2.5 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/30 font-semibold hover:bg-red-500/20"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => quickFill('operator@beyondthescore.com')}
              className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold hover:bg-emerald-500/20"
            >
              Turf Operator
            </button>
            <button
              type="button"
              onClick={() => quickFill('organizer@beyondthescore.com')}
              className="px-2.5 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30 font-semibold hover:bg-purple-500/20"
            >
              Organizer
            </button>
            <button
              type="button"
              onClick={() => quickFill('player@beyondthescore.com')}
              className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 font-semibold hover:bg-blue-500/20"
            >
              Player
            </button>
            <button
              type="button"
              onClick={() => quickFill('user@beyondthescore.com')}
              className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 font-semibold hover:bg-slate-750"
            >
              General Fan
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-300">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] text-orange-400 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign In
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-orange-400 font-bold hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
