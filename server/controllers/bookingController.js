import Booking from '../models/Booking.js';
import Turf from '../models/Turf.js';
import TurfAvailability from '../models/TurfAvailability.js';
import { sendNotification } from '../services/notificationService.js';
import { emitBookingUpdate } from '../services/socketService.js';

// Helper: parse HH:mm to minutes from midnight
const timeToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
};

// @desc    Create a new turf booking with conflict check
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res, next) => {
  try {
    const { turfId, sport, bookingDate, startTime, endTime, notes } = req.body;

    if (!turfId || !sport || !bookingDate || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Turf, sport, booking date, start time, and end time are required'
      });
    }

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    if (endMinutes <= startMinutes) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time'
      });
    }

    const durationHours = (endMinutes - startMinutes) / 60;

    // Fetch turf
    const turf = await Turf.findById(turfId);
    if (!turf) {
      return res.status(404).json({ success: false, message: 'Turf facility not found' });
    }

    if (turf.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'This turf is currently not accepting reservations'
      });
    }

    // Operating hours check
    const openMinutes = timeToMinutes(turf.operatingHours?.open || '06:00');
    const closeMinutes = timeToMinutes(turf.operatingHours?.close || '23:00');

    if (startMinutes < openMinutes || endMinutes > closeMinutes) {
      return res.status(400).json({
        success: false,
        message: `Booking must be within operating hours (${turf.operatingHours.open} - ${turf.operatingHours.close})`
      });
    }

    // Check operator blocked slots
    const availability = await TurfAvailability.findOne({ turf: turfId, date: bookingDate });
    if (availability) {
      if (availability.isFullyBlocked) {
        return res.status(400).json({
          success: false,
          message: 'This facility is completely closed for maintenance on this date'
        });
      }

      const isBlocked = availability.blockedSlots.some((slot) => {
        const sM = timeToMinutes(slot.startTime);
        const eM = timeToMinutes(slot.endTime);
        return startMinutes < eM && endMinutes > sM;
      });

      if (isBlocked) {
        return res.status(400).json({
          success: false,
          message: 'The requested time slot has been blocked by the turf operator for maintenance'
        });
      }
    }

    // CRITICAL: Prevent double bookings / check overlapping active reservations
    const overlappingBooking = await Booking.findOne({
      turf: turfId,
      bookingDate,
      status: { $in: ['pending', 'confirmed'] },
      $expr: {
        $and: [
          { $lt: ['$startTime', endTime] },
          { $gt: ['$endTime', startTime] }
        ]
      }
    });

    if (overlappingBooking) {
      return res.status(409).json({
        success: false,
        message: 'The selected time slot has already been reserved by another player. Please select another slot.'
      });
    }

    // Calculate rental price
    const rentalPrice = Math.round(durationHours * turf.rentalPricePerHour);

    // Generate unique booking ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `BTS-${new Date().getFullYear()}-${randomSuffix}`;

    const booking = await Booking.create({
      bookingId,
      turf: turf._id,
      user: req.user._id,
      sport,
      bookingDate,
      startTime,
      endTime,
      durationHours,
      rentalPrice,
      notes: notes || '',
      status: 'pending'
    });

    // Notify Turf Operator
    await sendNotification({
      recipient: turf.operator,
      title: 'New Booking Request',
      message: `New booking request #${bookingId} for ${turf.name} on ${bookingDate} (${startTime} - ${endTime})`,
      type: 'booking',
      link: `/operator/bookings`
    });

    // Notify User
    await sendNotification({
      recipient: req.user._id,
      title: 'Booking Request Submitted',
      message: `Your booking #${bookingId} at ${turf.name} is received and pending operator confirmation.`,
      type: 'booking',
      link: `/bookings/${booking._id}`
    });

    // Realtime socket update
    emitBookingUpdate(req.user._id.toString(), turf.operator.toString(), booking);

    res.status(201).json({
      success: true,
      message: 'Booking reserved successfully! The operator will confirm your slot.',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's personal bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getUserBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { user: req.user._id };

    if (status && status !== 'all') {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('turf', 'name address city rentalPricePerHour images contactPhone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get operator's bookings across all their turfs
// @route   GET /api/bookings/operator
// @access  Private (Operator, Admin)
export const getOperatorBookings = async (req, res, next) => {
  try {
    let turfIds;

    if (req.user.role === 'admin') {
      const allTurfs = await Turf.find({}).select('_id');
      turfIds = allTurfs.map((t) => t._id);
    } else {
      const myTurfs = await Turf.find({ operator: req.user._id }).select('_id');
      turfIds = myTurfs.map((t) => t._id);
    }

    const { status, date } = req.query;
    const query = { turf: { $in: turfIds } };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (date) {
      query.bookingDate = date;
    }

    const bookings = await Booking.find(query)
      .populate('turf', 'name address city')
      .populate('user', 'name email phone avatar')
      .sort({ bookingDate: -1, startTime: -1 });

    // Analytics summary
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
    const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
    const completedBookings = bookings.filter((b) => b.status === 'completed').length;
    const totalRevenue = bookings
      .filter((b) => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum, b) => sum + (b.rentalPrice || 0), 0);

    res.status(200).json({
      success: true,
      analytics: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        totalRevenue
      },
      bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking details by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('turf')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking record not found' });
    }

    // Access check: User who booked, operator of turf, or admin
    const isOwner = booking.user._id.toString() === req.user._id.toString();
    const isOperator = booking.turf.operator.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isOperator && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Accept / Reject / Cancel / Complete)
// @route   PUT /api/bookings/:id/status
// @access  Private
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, operatorNotes, cancellationReason } = req.body;
    const booking = await Booking.findById(req.params.id).populate('turf');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const isUser = booking.user.toString() === req.user._id.toString();
    const isOperator = booking.turf.operator.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isUser && !isOperator && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this booking' });
    }

    // User can only cancel their own pending/confirmed booking
    if (isUser && !isOperator && !isAdmin) {
      if (status !== 'cancelled') {
        return res.status(400).json({
          success: false,
          message: 'Users are only authorized to cancel their reservations'
        });
      }
      booking.status = 'cancelled';
      booking.cancellationReason = cancellationReason || 'Cancelled by player';
    } else {
      // Operator or Admin
      const validStatuses = ['pending', 'confirmed', 'rejected', 'cancelled', 'completed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status value' });
      }

      booking.status = status;
      if (operatorNotes !== undefined) booking.operatorNotes = operatorNotes;
      if (cancellationReason !== undefined) booking.cancellationReason = cancellationReason;
    }

    await booking.save();

    // Notify user about status change
    let statusMessage = `Your booking #${booking.bookingId} status is now: ${booking.status.toUpperCase()}`;
    if (booking.status === 'confirmed') {
      statusMessage = `Great news! Your booking #${booking.bookingId} at ${booking.turf.name} has been CONFIRMED.`;
    } else if (booking.status === 'rejected') {
      statusMessage = `Booking #${booking.bookingId} at ${booking.turf.name} was declined. ${booking.operatorNotes || ''}`;
    }

    await sendNotification({
      recipient: booking.user,
      title: `Booking Update: ${booking.status.toUpperCase()}`,
      message: statusMessage,
      type: 'booking',
      link: `/bookings/${booking._id}`
    });

    emitBookingUpdate(booking.user.toString(), booking.turf.operator.toString(), booking);

    res.status(200).json({
      success: true,
      message: `Booking marked as ${booking.status}`,
      booking
    });
  } catch (error) {
    next(error);
  }
};
