import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Trophy,
  MapPin,
  FileSpreadsheet,
  Users,
  Search,
  Bell,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Shield,
  LayoutDashboard,
  Calendar,
  PlusCircle,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import GlobalSearch from './GlobalSearch';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isOrganizer, isOperator, isPlayer } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Live Scores', path: '/matches', icon: Activity, badge: 'LIVE' },
    { name: 'Book Turfs', path: '/turfs', icon: MapPin },
    { name: 'Scorecards', path: '/scorecards', icon: FileSpreadsheet },
    { name: 'Athletes', path: '/players', icon: Users },
    { name: 'Leagues', path: '/competitions', icon: Trophy }
  ];

  const getDashboardPath = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isOperator) return '/operator/dashboard';
    if (isOrganizer) return '/organizer/dashboard';
    if (isPlayer) return '/player/dashboard';
    return '/dashboard';
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Admin</span>;
      case 'operator':
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Turf Operator</span>;
      case 'organizer':
        return <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Organizer</span>;
      case 'player':
        return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Player</span>;
      default:
        return <span className="bg-slate-700/50 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Member</span>;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-sports-dark/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-base md:text-lg tracking-tight text-white flex items-center gap-1.5 font-display">
                BEYOND THE SCORE
              </div>
              <div className="text-[10px] tracking-widest uppercase font-semibold text-orange-400 -mt-1 hidden sm:block">
                Sports Ecosystem
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-slate-800 text-orange-400 border border-slate-700'
                      : 'text-slate-300 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Tools: Search, Notification, Profile */}
          <div className="flex items-center space-x-2.5">
            {/* Quick Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition border border-transparent hover:border-slate-700"
              title="Global Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notification Bell (if logged in) */}
            {isAuthenticated && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition relative border border-transparent hover:border-slate-700"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-orange-500 rounded-full ring-2 ring-sports-dark" />
                  )}
                </button>
                {notifOpen && <NotificationDropdown onClose={() => setNotifOpen(false)} />}
              </div>
            )}

            {/* User Profile / Auth State */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-700/80 transition"
                >
                  <img
                    src={
                      user?.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                    }
                    alt={user?.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-600"
                  />
                  <span className="hidden md:block text-xs font-semibold text-slate-200 max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-sports-dark border border-slate-700/90 rounded-xl shadow-2xl py-2 z-50 divide-y divide-slate-800">
                    <div className="px-4 py-3">
                      <div className="text-sm font-semibold text-white truncate">{user?.name}</div>
                      <div className="text-xs text-slate-400 truncate">{user?.email}</div>
                      <div className="mt-2">{getRoleBadge(user?.role)}</div>
                    </div>

                    <div className="py-1">
                      <Link
                        to={getDashboardPath()}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-orange-400 transition"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Role Dashboard</span>
                      </Link>

                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-orange-400 transition"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>My Sports Hub</span>
                      </Link>

                      <Link
                        to="/bookings/my"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-orange-400 transition"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>My Turf Bookings</span>
                      </Link>

                      <Link
                        to="/scorecards/create"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-orange-400 transition"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Create Scorecard</span>
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-orange-400 transition"
                      >
                        <UserIcon className="w-4 h-4" />
                        <span>Profile & Settings</span>
                      </Link>
                    </div>

                    {isAdmin && (
                      <div className="py-1">
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-400 hover:bg-slate-800 transition"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Admin Control Center</span>
                        </Link>
                      </div>
                    )}

                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:text-white transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-orange-600 hover:bg-orange-500 text-white transition shadow-md shadow-orange-600/30"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-orange-400" />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {!isAuthenticated && (
              <div className="pt-3 border-t border-slate-800 flex gap-2">
                <Link
                  to="/login"
                  className="flex-1 py-2 text-center text-xs font-semibold rounded-lg bg-slate-800 text-slate-200"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="flex-1 py-2 text-center text-xs font-semibold rounded-lg bg-orange-600 text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Global Search Modal Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-16 md:pt-24 animate-in fade-in">
          <div className="w-full max-w-2xl relative">
            <GlobalSearch onClose={() => setSearchOpen(false)} />
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute -top-10 right-0 text-slate-400 hover:text-white flex items-center gap-1 text-xs"
            >
              <X className="w-5 h-5" /> Esc to close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
