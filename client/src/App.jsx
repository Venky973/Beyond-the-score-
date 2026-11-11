import React from 'react';
import { Routes, Route } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import Home from './pages/home/Home';
import MatchesList from './pages/matches/MatchesList';
import MatchDetail from './pages/matches/MatchDetail';
import TurfDiscovery from './pages/turfs/TurfDiscovery';
import TurfDetail from './pages/turfs/TurfDetail';
import PlayersList from './pages/players/PlayersList';
import PlayerDetail from './pages/players/PlayerDetail';
import PlayerComparison from './pages/players/PlayerComparison';
import ScorecardsList from './pages/scorecards/ScorecardsList';
import ScorecardDetail from './pages/scorecards/ScorecardDetail';
import CreateScorecard from './pages/scorecards/CreateScorecard';
import CompetitionsList from './pages/competitions/CompetitionsList';
import TeamsList from './pages/teams/TeamsList';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import NotFound from './pages/public/NotFound';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// User Dashboard & Bookings
import UserDashboard from './pages/user/UserDashboard';
import MyBookings from './pages/user/MyBookings';
import BookingDetail from './pages/user/BookingDetail';
import MyProfile from './pages/user/MyProfile';

// Organizer Pages
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import CreateMatch from './pages/organizer/CreateMatch';
import CreateCompetition from './pages/organizer/CreateCompetition';

// Turf Operator Pages
import OperatorDashboard from './pages/operator/OperatorDashboard';
import RegisterTurf from './pages/operator/RegisterTurf';
import BookingRequests from './pages/operator/BookingRequests';
import AvailabilityManager from './pages/operator/AvailabilityManager';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import TurfApprovals from './pages/admin/TurfApprovals';
import BookingManagement from './pages/admin/BookingManagement';
import ReportsModeration from './pages/admin/ReportsModeration';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="matches" element={<MatchesList />} />
        <Route path="matches/:id" element={<MatchDetail />} />
        <Route path="turfs" element={<TurfDiscovery />} />
        <Route path="turfs/:id" element={<TurfDetail />} />
        <Route path="players" element={<PlayersList />} />
        <Route path="players/:id" element={<PlayerDetail />} />
        <Route path="players/compare" element={<PlayerComparison />} />
        <Route path="scorecards" element={<ScorecardsList />} />
        <Route path="scorecards/public" element={<ScorecardsList />} />
        <Route path="scorecards/:id" element={<ScorecardDetail />} />
        <Route path="scorecards/share/:id" element={<ScorecardDetail />} />
        <Route path="competitions" element={<CompetitionsList />} />
        <Route path="teams" element={<TeamsList />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />

        {/* Auth Routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />

        {/* Protected Authenticated User Routes */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="player/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="bookings/my"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="bookings/:id"
          element={
            <ProtectedRoute>
              <BookingDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="scorecards/create"
          element={
            <ProtectedRoute>
              <CreateScorecard />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />

        {/* Organizer Routes */}
        <Route
          path="organizer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['organizer', 'admin']}>
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="organizer/create-match"
          element={
            <ProtectedRoute allowedRoles={['organizer', 'admin']}>
              <CreateMatch />
            </ProtectedRoute>
          }
        />
        <Route
          path="organizer/create-competition"
          element={
            <ProtectedRoute allowedRoles={['organizer', 'admin']}>
              <CreateCompetition />
            </ProtectedRoute>
          }
        />

        {/* Turf Operator Routes */}
        <Route
          path="operator/dashboard"
          element={
            <ProtectedRoute allowedRoles={['operator', 'admin']}>
              <OperatorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="operator/register-turf"
          element={
            <ProtectedRoute allowedRoles={['operator', 'admin']}>
              <RegisterTurf />
            </ProtectedRoute>
          }
        />
        <Route
          path="operator/bookings"
          element={
            <ProtectedRoute allowedRoles={['operator', 'admin']}>
              <BookingRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="operator/availability"
          element={
            <ProtectedRoute allowedRoles={['operator', 'admin']}>
              <AvailabilityManager />
            </ProtectedRoute>
          }
        />

        {/* Administrator Routes */}
        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/turfs"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <TurfApprovals />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/bookings"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <BookingManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/reports"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ReportsModeration />
            </ProtectedRoute>
          }
        />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
