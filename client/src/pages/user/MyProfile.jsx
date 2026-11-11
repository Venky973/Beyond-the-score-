import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const MyProfile = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [preferredSports, setPreferredSports] = useState(
    user?.preferredSports || ['Cricket', 'Football']
  );

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  const sportsOptions = ['Cricket', 'Football', 'Basketball', 'Tennis', 'Badminton', 'Volleyball'];

  const toggleSport = (sport) => {
    if (preferredSports.includes(sport)) {
      setPreferredSports(preferredSports.filter((s) => s !== sport));
    } else {
      setPreferredSports([...preferredSports, sport]);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg({ type: '', text: '' });
    try {
      const res = await api.put('/auth/profile', {
        name,
        phone,
        bio,
        avatar,
        preferredSports
      });
      if (res.data.success) {
        updateUser(res.data.user);
        setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (err) {
      console.error('Update profile error:', err);
      setProfileMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile.'
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    setSavingPassword(true);
    setPasswordMsg({ type: '', text: '' });
    try {
      const res = await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      if (res.data.success) {
        setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error('Password change error:', err);
      setPasswordMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to change password.'
      });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-400 block mb-1">
          Account Settings
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-wide uppercase">
          My Profile & Preferences
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Update personal information, sports preferences, and account security credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Overview */}
        <div className="bg-sports-dark border border-slate-700/80 rounded-2xl p-6 text-center space-y-4 shadow-xl">
          <img
            src={
              avatar ||
              user?.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
            }
            alt={user?.name}
            className="w-28 h-28 rounded-2xl object-cover mx-auto border-2 border-orange-500 shadow-lg"
          />

          <div>
            <h3 className="text-lg font-bold text-white">{user?.name}</h3>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <span className="mt-2 inline-block bg-orange-600/20 text-orange-400 border border-orange-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
              Role: {user?.role}
            </span>
          </div>

          <div className="text-xs text-slate-500 pt-3 border-t border-slate-800">
            Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString([], { month: 'short', year: 'numeric' })}
          </div>
        </div>

        {/* Right Columns: Edit Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Form */}
          <form
            onSubmit={handleProfileSubmit}
            className="bg-slate-850 p-6 rounded-2xl border border-slate-750 space-y-4 shadow-xl"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-orange-400" /> Personal Details
            </h3>

            {profileMsg.text && (
              <div
                className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                  profileMsg.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}
              >
                {profileMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  placeholder="+1 555-0100"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Avatar Photo URL
                </label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Biography</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  placeholder="Tell other sports enthusiasts about yourself..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                />
              </div>
            </div>

            {/* Preferred Sports */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Preferred Sports Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {sportsOptions.map((sp) => {
                  const isChecked = preferredSports.includes(sp);
                  return (
                    <button
                      key={sp}
                      type="button"
                      onClick={() => toggleSport(sp)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                        isChecked
                          ? 'bg-orange-600 border-orange-500 text-white'
                          : 'bg-slate-900 border-slate-750 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {sp}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-md shadow-orange-600/20"
              >
                {savingProfile && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
            </div>
          </form>

          {/* Change Password Form */}
          <form
            onSubmit={handlePasswordSubmit}
            className="bg-slate-850 p-6 rounded-2xl border border-slate-750 space-y-4 shadow-xl"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" /> Change Security Password
            </h3>

            {passwordMsg.text && (
              <div
                className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                  passwordMsg.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}
              >
                {passwordMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingPassword}
                className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-md shadow-emerald-600/20"
              >
                {savingPassword && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
