import User from '../models/User.js';
import Turf from '../models/Turf.js';
import Booking from '../models/Booking.js';
import Match from '../models/Match.js';
import Team from '../models/Team.js';
import Report from '../models/Report.js';
import Scorecard from '../models/Scorecard.js';
import AdminActivity from '../models/AdminActivity.js';
import { sendNotification } from '../services/notificationService.js';

// @desc    Get complete platform statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalPlayers = await User.countDocuments({ role: 'player' });
    const totalOrganizers = await User.countDocuments({ role: 'organizer' });
    const totalOperators = await User.countDocuments({ role: 'operator' });

    const totalTurfs = await Turf.countDocuments({});
    const pendingTurfApprovals = await Turf.countDocuments({ status: 'pending' });
    const approvedTurfs = await Turf.countDocuments({ status: 'approved' });

    const totalBookings = await Booking.countDocuments({});
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const activeBookings = await Booking.countDocuments({ status: { $in: ['pending', 'confirmed'] } });

    const liveMatches = await Match.countDocuments({ status: 'live' });
    const completedMatches = await Match.countDocuments({ status: 'completed' });
    const upcomingMatches = await Match.countDocuments({ status: 'upcoming' });

    const pendingReports = await Report.countDocuments({ status: 'pending' });
    const totalScorecards = await Scorecard.countDocuments({});

    // Calculate revenue from completed/confirmed bookings
    const revenueAgg = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$rentalPrice' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalPlayers,
        totalOrganizers,
        totalOperators,
        totalTurfs,
        pendingTurfApprovals,
        approvedTurfs,
        totalBookings,
        completedBookings,
        activeBookings,
        liveMatches,
        completedMatches,
        upcomingMatches,
        pendingReports,
        totalScorecards,
        totalRevenue
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with search, role filter & pagination
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 25 } = req.query;
    const query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const users = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle activate / suspend user account
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (Admin)
export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot deactivate an administrator account' });
    }

    user.isActive = !user.isActive;
    await user.save();

    await AdminActivity.create({
      admin: req.user._id,
      action: user.isActive ? 'ACTIVATED_USER' : 'SUSPENDED_USER',
      targetType: 'User',
      targetId: user._id.toString(),
      details: `${user.name} (${user.email}) marked as ${user.isActive ? 'Active' : 'Suspended'}`
    });

    res.status(200).json({
      success: true,
      message: `Account for ${user.name} has been ${user.isActive ? 'activated' : 'suspended'}`,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get turfs pending admin approval
// @route   GET /api/admin/turf-approvals
// @access  Private (Admin)
export const getTurfApprovals = async (req, res, next) => {
  try {
    const turfs = await Turf.find({ status: 'pending' })
      .populate('operator', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: turfs.length,
      turfs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject turf facility
// @route   PUT /api/admin/turf-approvals/:id
// @access  Private (Admin)
export const reviewTurfApproval = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved or rejected' });
    }

    const turf = await Turf.findById(req.params.id);
    if (!turf) {
      return res.status(404).json({ success: false, message: 'Turf not found' });
    }

    turf.status = status;
    turf.isVerified = status === 'approved';
    await turf.save();

    // Log admin activity
    await AdminActivity.create({
      admin: req.user._id,
      action: status === 'approved' ? 'APPROVED_TURF' : 'REJECTED_TURF',
      targetType: 'Turf',
      targetId: turf._id.toString(),
      details: `${turf.name} in ${turf.city} was ${status}`
    });

    // Notify Turf Operator
    await sendNotification({
      recipient: turf.operator,
      title: `Turf Registration ${status.toUpperCase()}`,
      message:
        status === 'approved'
          ? `Congratulations! Your turf "${turf.name}" has been approved and is now live for bookings.`
          : `Your turf submission "${turf.name}" was declined. Reason: ${rejectionReason || 'Facility does not meet minimum listing standards.'}`,
      type: 'system',
      link: `/operator/my-turfs`
    });

    res.status(200).json({
      success: true,
      message: `Turf facility has been ${status}`,
      turf
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings across the platform
// @route   GET /api/admin/bookings
// @access  Private (Admin)
export const getAllBookings = async (req, res, next) => {
  try {
    const { status, date, search, page = 1, limit = 25 } = req.query;
    const query = {};

    if (status && status !== 'all') query.status = status;
    if (date) query.bookingDate = date;

    const skip = (Number(page) - 1) * Number(limit);
    const bookings = await Booking.find(query)
      .populate('turf', 'name city operator rentalPricePerHour')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get content moderation reports
// @route   GET /api/admin/reports
// @access  Private (Admin)
export const getReports = async (req, res, next) => {
  try {
    const { status = 'pending' } = req.query;
    const query = {};
    if (status !== 'all') query.status = status;

    const reports = await Report.find(query)
      .populate('reporter', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resolve or dismiss report
// @route   PUT /api/admin/reports/:id
// @access  Private (Admin)
export const handleReport = async (req, res, next) => {
  try {
    const { status, resolutionNotes } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    report.status = status || 'resolved';
    report.resolutionNotes = resolutionNotes || '';
    await report.save();

    res.status(200).json({
      success: true,
      message: `Report marked as ${report.status}`,
      report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin activity audit logs
// @route   GET /api/admin/activity-logs
// @access  Private (Admin)
export const getActivityLogs = async (req, res, next) => {
  try {
    const logs = await AdminActivity.find({})
      .populate('admin', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    next(error);
  }
};
