import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, Mail, Lock, User, Phone, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [preferredSports, setPreferredSports] = useState(['Cricket', 'Football']);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const sportsOptions = ['Cricket', 'Football', 'Basketball', 'Tennis', 'Badminton', 'Volleyball'];

  const toggleSport = (sp) => {
    if (preferredSports.includes(sp)) {
      setPreferredSports(preferredSports.filter((s) => s !== sp));
    } else {
      setPreferredSports([...preferredSports, sp]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const data = await register({
        name,
        email,
        phone,
        password,
        role,
        preferredSports
      });

      if (data.user?.role === 'operator') navigate('/operator/dashboard');
      else if (data.user?.role === 'organizer') navigate('/organizer/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setErrorMsg(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-6 bg-sports-dark border border-slate-700/80 p-8 rounded-2xl shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto shadow-lg shadow-orange-500/20">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white font-display uppercase tracking-wide">
            Join Beyond The Score
          </h2>
          <p className="text-xs text-slate-400">
            Create an account to discover turfs, create custom scorecards, and track your sports career.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Marcus Stone"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="marcus@example.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555-0199"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Primary User Role *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-semibold"
              >
                <option value="user">Sports Fan / General User</option>
                <option value="player">Athlete / Player</option>
                <option value="organizer">Team / Tournament Organizer</option>
                <option value="operator">Turf Arena Operator</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Confirm Password *
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
          </div>

          {/* Preferred sports */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Preferred Sports
            </label>
            <div className="flex flex-wrap gap-2">
              {sportsOptions.map((sp) => {
                const isSelected = preferredSports.includes(sp);
                return (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => toggleSport(sp)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                      isSelected
                        ? 'bg-orange-600 border-orange-500 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {sp}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 mt-4"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Free Account
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-3 border-t border-slate-800">
          Already registered?{' '}
          <Link to="/login" className="text-orange-400 font-bold hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
