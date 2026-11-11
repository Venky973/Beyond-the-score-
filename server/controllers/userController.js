import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Scorecard from '../models/Scorecard.js';
import Match from '../models/Match.js';
import Follow from '../models/Follow.js';
import Turf from '../models/Turf.js';

// @desc    Get complete personal user dashboard overview
// @route   GET /api/users/dashboard
// @access  Private
export const getUserDashboard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // 1. User's upcoming bookings
    const upcomingBookings = await Booking.find({
      user: user._id,
      status: { $in: ['pending', 'confirmed'] }
    })
      .populate('turf', 'name address city images rentalPricePerHour contactPhone')
      .sort({ bookingDate: 1, startTime: 1 })
      .limit(5);

    // 2. User's recent scorecards
    const recentScorecards = await Scorecard.find({ creator: user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    // 3. User's follows
    const follows = await Follow.find({ user: user._id });

    // 4. Matches in user's preferred sports
    const preferredSportsRegex = (user.preferredSports || ['Cricket', 'Football']).map(
      (s) => new RegExp(`^${s}$`, 'i')
    );

    const liveMatches = await Match.find({
      status: 'live',
      sport: { $in: preferredSportsRegex }
    })
      .sort({ updatedAt: -1 })
      .limit(6);

    const upcomingMatches = await Match.find({
      status: 'upcoming',
      sport: { $in: preferredSportsRegex }
    })
      .sort({ scheduledAt: 1 })
      .limit(6);

    // 5. Featured/Recommended Turfs in user's city or popular
    const featuredTurfs = await Turf.find({ status: 'approved' })
      .sort({ rating: -1 })
      .limit(4);

    res.status(200).json({
      success: true,
      dashboard: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          preferredSports: user.preferredSports,
          avatar: user.avatar
        },
        upcomingBookings,
        recentScorecards,
        follows,
        liveMatches,
        upcomingMatches,
        featuredTurfs
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public profile of another user / player
// @route   GET /api/users/:id
// @access  Public
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const publicScorecards = await Scorecard.find({
      creator: user._id,
      visibility: 'public'
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      user,
      publicScorecards
    });
  } catch (error) {
    next(error);
  }
};
