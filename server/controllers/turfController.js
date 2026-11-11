import Turf from '../models/Turf.js';
import TurfAvailability from '../models/TurfAvailability.js';
import Booking from '../models/Booking.js';
import AdminActivity from '../models/AdminActivity.js';

// Haversine distance in KM
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // 1 decimal place
};

// @desc    Get all turfs with location, filters, and sorting
// @route   GET /api/turfs
// @access  Public
export const getTurfs = async (req, res, next) => {
  try {
    const {
      lat,
      lng,
      radius = 50, // default max 50km
      sport,
      minPrice,
      maxPrice,
      facility,
      search,
      sort = 'recommended'
    } = req.query;

    const filter = { status: 'approved' };

    if (sport && sport !== 'all') {
      filter.supportedSports = { $in: [new RegExp(sport, 'i')] };
    }

    if (minPrice || maxPrice) {
      filter.rentalPricePerHour = {};
      if (minPrice) filter.rentalPricePerHour.$gte = Number(minPrice);
      if (maxPrice) filter.rentalPricePerHour.$lte = Number(maxPrice);
    }

    if (facility && facility !== 'all') {
      filter.facilities = { $in: [new RegExp(facility, 'i')] };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    let turfs = await Turf.find(filter)
      .populate('operator', 'name email phone')
      .lean();

    const userLat = lat ? parseFloat(lat) : null;
    const userLng = lng ? parseFloat(lng) : null;

    // Attach calculated distance to each turf
    turfs = turfs.map((turf) => {
      let distance = null;
      if (userLat !== null && userLng !== null && turf.location?.coordinates) {
        const [turfLng, turfLat] = turf.location.coordinates;
        distance = calculateHaversineDistance(userLat, userLng, turfLat, turfLng);
      }
      return {
        ...turf,
        distance // in km
      };
    });

    // If user provided location and requested radius filter
    if (userLat !== null && userLng !== null && radius) {
      turfs = turfs.filter(
        (t) => t.distance === null || t.distance <= parseFloat(radius)
      );
    }

    // Sorting logic
    if (sort === 'nearest' && userLat !== null && userLng !== null) {
      turfs.sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));
    } else if (sort === 'price_asc') {
      turfs.sort((a, b) => a.rentalPricePerHour - b.rentalPricePerHour);
    } else if (sort === 'price_desc') {
      turfs.sort((a, b) => b.rentalPricePerHour - a.rentalPricePerHour);
    } else if (sort === 'rating') {
      turfs.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'newest') {
      turfs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      // Recommended: high rating, verified first
      turfs.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    res.status(200).json({
      success: true,
      count: turfs.length,
      turfs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get turf by ID
// @route   GET /api/turfs/:id
// @access  Public
export const getTurfById = async (req, res, next) => {
  try {
    const turf = await Turf.findById(req.params.id).populate(
      'operator',
      'name email phone'
    );

    if (!turf) {
      return res.status(404).json({ success: false, message: 'Turf facility not found' });
    }

    res.status(200).json({
      success: true,
      turf
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new turf
// @route   POST /api/turfs
// @access  Private (Operator, Admin)
export const createTurf = async (req, res, next) => {
  try {
    const {
      name,
      address,
      city,
      state,
      zipCode,
      latitude,
      longitude,
      supportedSports,
      rentalPricePerHour,
      operatingHours,
      facilities,
      images,
      description,
      contactPhone,
      contactEmail
    } = req.body;

    if (!name || !address || !city || !rentalPricePerHour) {
      return res.status(400).json({
        success: false,
        message: 'Name, address, city, and rental price per hour are required'
      });
    }

    const lat = latitude ? parseFloat(latitude) : 28.6139;
    const lng = longitude ? parseFloat(longitude) : 77.2090;

    const turf = await Turf.create({
      name,
      operator: req.user._id,
      address,
      city,
      state: state || '',
      zipCode: zipCode || '',
      location: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      supportedSports: Array.isArray(supportedSports) && supportedSports.length > 0
        ? supportedSports
        : ['Football', 'Cricket'],
      rentalPricePerHour: Number(rentalPricePerHour),
      operatingHours: operatingHours || {
        open: '06:00',
        close: '23:00',
        daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      facilities: Array.isArray(facilities) && facilities.length > 0
        ? facilities
        : ['Floodlights', 'Changing Rooms', 'Drinking Water', 'Free Parking'],
      images: Array.isArray(images) && images.length > 0 ? images : [],
      description: description || '',
      contactPhone: contactPhone || req.user.phone || '',
      contactEmail: contactEmail || req.user.email || '',
      // Admins auto-approve; operators start in 'pending' for verification
      isVerified: req.user.role === 'admin',
      status: req.user.role === 'admin' ? 'approved' : 'pending'
    });

    res.status(201).json({
      success: true,
      message:
        req.user.role === 'admin'
          ? 'Turf created and approved'
          : 'Turf registered successfully! It is now pending verification by an administrator.',
      turf
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update turf details
// @route   PUT /api/turfs/:id
// @access  Private (Operator, Admin)
export const updateTurf = async (req, res, next) => {
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) {
      return res.status(404).json({ success: false, message: 'Turf not found' });
    }

    if (
      req.user.role !== 'admin' &&
      turf.operator.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are only authorized to edit your own facilities'
      });
    }

    const {
      name,
      address,
      city,
      state,
      zipCode,
      latitude,
      longitude,
      supportedSports,
      rentalPricePerHour,
      operatingHours,
      facilities,
      images,
      description,
      contactPhone,
      contactEmail
    } = req.body;

    if (name) turf.name = name;
    if (address) turf.address = address;
    if (city) turf.city = city;
    if (state !== undefined) turf.state = state;
    if (zipCode !== undefined) turf.zipCode = zipCode;
    if (rentalPricePerHour !== undefined) turf.rentalPricePerHour = Number(rentalPricePerHour);
    if (operatingHours) turf.operatingHours = operatingHours;
    if (supportedSports) turf.supportedSports = supportedSports;
    if (facilities) turf.facilities = facilities;
    if (images) turf.images = images;
    if (description !== undefined) turf.description = description;
    if (contactPhone !== undefined) turf.contactPhone = contactPhone;
    if (contactEmail !== undefined) turf.contactEmail = contactEmail;

    if (latitude !== undefined && longitude !== undefined) {
      turf.location = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      };
    }

    await turf.save();

    res.status(200).json({
      success: true,
      message: 'Turf facility updated successfully',
      turf
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get operator's registered turfs
// @route   GET /api/turfs/my-turfs
// @access  Private (Operator, Admin)
export const getMyTurfs = async (req, res, next) => {
  try {
    const turfs = await Turf.find({ operator: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: turfs.length,
      turfs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available and booked slots for a turf on a specific date
// @route   GET /api/turfs/:id/slots
// @access  Public
export const getTurfSlots = async (req, res, next) => {
  try {
    const { date } = req.query; // YYYY-MM-DD
    if (!date) {
      return res.status(400).json({ success: false, message: 'Query parameter "date" (YYYY-MM-DD) is required' });
    }

    const turf = await Turf.findById(req.params.id);
    if (!turf) {
      return res.status(404).json({ success: false, message: 'Turf not found' });
    }

    const openHour = parseInt(turf.operatingHours?.open || '06:00', 10);
    const closeHour = parseInt(turf.operatingHours?.close || '23:00', 10);

    // Existing active bookings for that date
    const bookings = await Booking.find({
      turf: turf._id,
      bookingDate: date,
      status: { $in: ['pending', 'confirmed'] }
    });

    // Custom blocked slots by operator
    const availability = await TurfAvailability.findOne({
      turf: turf._id,
      date
    });

    const slots = [];

    for (let h = openHour; h < closeHour; h++) {
      const startTime = `${String(h).padStart(2, '0')}:00`;
      const endTime = `${String(h + 1).padStart(2, '0')}:00`;

      // Check if slot overlaps with any active booking
      const isBooked = bookings.some((b) => {
        // Slot falls between b.startTime and b.endTime
        return startTime < b.endTime && endTime > b.startTime;
      });

      // Check if slot is blocked by operator
      const isBlocked = availability?.blockedSlots?.some((b) => {
        return startTime < b.endTime && endTime > b.startTime;
      }) || availability?.isFullyBlocked;

      let status = 'available';
      if (isBooked) status = 'booked';
      if (isBlocked) status = 'blocked';

      slots.push({
        startTime,
        endTime,
        duration: 1,
        price: turf.rentalPricePerHour,
        status
      });
    }

    res.status(200).json({
      success: true,
      date,
      operatingHours: turf.operatingHours,
      slots
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Block or unblock slots for a date (operator maintenance)
// @route   POST /api/turfs/:id/block-slots
// @access  Private (Operator, Admin)
export const manageBlockedSlots = async (req, res, next) => {
  try {
    const { date, blockedSlots, isFullyBlocked } = req.body;
    const turf = await Turf.findById(req.params.id);

    if (!turf) {
      return res.status(404).json({ success: false, message: 'Turf not found' });
    }

    if (
      req.user.role !== 'admin' &&
      turf.operator.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Only the facility operator can block availability slots'
      });
    }

    let availability = await TurfAvailability.findOne({ turf: turf._id, date });

    if (!availability) {
      availability = new TurfAvailability({
        turf: turf._id,
        date,
        blockedSlots: blockedSlots || [],
        isFullyBlocked: Boolean(isFullyBlocked)
      });
    } else {
      if (blockedSlots !== undefined) availability.blockedSlots = blockedSlots;
      if (isFullyBlocked !== undefined) availability.isFullyBlocked = Boolean(isFullyBlocked);
    }

    await availability.save();

    res.status(200).json({
      success: true,
      message: 'Availability updated successfully',
      availability
    });
  } catch (error) {
    next(error);
  }
};
