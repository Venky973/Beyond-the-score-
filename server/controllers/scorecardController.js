import Scorecard from '../models/Scorecard.js';

const generateShareCode = () => {
  return Math.random().toString(36).substring(2, 8) + Date.now().toString(36).substring(4);
};

// @desc    Create a custom scorecard
// @route   POST /api/scorecards
// @access  Private
export const createScorecard = async (req, res, next) => {
  try {
    const {
      title,
      sport,
      matchType,
      venue,
      matchDate,
      duration,
      visibility,
      teamA,
      teamB,
      sportData,
      result,
      notes,
      status
    } = req.body;

    if (!title || !sport || !teamA?.name || !teamB?.name) {
      return res.status(400).json({
        success: false,
        message: 'Title, sport, and both team names are required'
      });
    }

    const shareCode = generateShareCode();

    const scorecard = await Scorecard.create({
      title,
      sport: sport.toLowerCase(),
      matchType: matchType || 'friendly',
      venue: venue || 'Community Sports Ground',
      matchDate: matchDate || Date.now(),
      duration: duration || '2 Hours',
      visibility: visibility || 'public',
      shareCode,
      creator: req.user._id,
      teamA: {
        name: teamA.name,
        scoreDisplay: teamA.scoreDisplay || '0',
        scoreDetails: teamA.scoreDetails || {},
        players: Array.isArray(teamA.players) ? teamA.players : []
      },
      teamB: {
        name: teamB.name,
        scoreDisplay: teamB.scoreDisplay || '0',
        scoreDetails: teamB.scoreDetails || {},
        players: Array.isArray(teamB.players) ? teamB.players : []
      },
      sportData: sportData || {},
      result: result || { winner: '', margin: '', summary: '' },
      notes: notes || '',
      status: status || 'completed'
    });

    res.status(201).json({
      success: true,
      message: 'Custom scorecard created successfully',
      scorecard
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's scorecards
// @route   GET /api/scorecards/my-scorecards
// @access  Private
export const getMyScorecards = async (req, res, next) => {
  try {
    const { sport } = req.query;
    const query = { creator: req.user._id };
    if (sport && sport !== 'all') {
      query.sport = sport.toLowerCase();
    }

    const scorecards = await Scorecard.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: scorecards.length,
      scorecards
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public scorecard by share code (NO LOGIN REQUIRED)
// @route   GET /api/scorecards/share/:code
// @access  Public
export const getScorecardByShareCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const scorecard = await Scorecard.findOne({ shareCode: code }).populate(
      'creator',
      'name avatar'
    );

    if (!scorecard) {
      return res.status(404).json({ success: false, message: 'Scorecard not found' });
    }

    if (scorecard.visibility === 'private') {
      return res.status(403).json({
        success: false,
        message: 'This scorecard is marked as private by the owner'
      });
    }

    res.status(200).json({
      success: true,
      scorecard
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public scorecards listing
// @route   GET /api/scorecards/public
// @access  Public
export const getPublicScorecards = async (req, res, next) => {
  try {
    const { sport, search } = req.query;
    const query = { visibility: 'public' };

    if (sport && sport !== 'all') {
      query.sport = sport.toLowerCase();
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'teamA.name': { $regex: search, $options: 'i' } },
        { 'teamB.name': { $regex: search, $options: 'i' } }
      ];
    }

    const scorecards = await Scorecard.find(query)
      .populate('creator', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(30);

    res.status(200).json({
      success: true,
      count: scorecards.length,
      scorecards
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get scorecard by ID
// @route   GET /api/scorecards/:id
// @access  Public (if public/unlisted) or Private (if private)
export const getScorecardById = async (req, res, next) => {
  try {
    const scorecard = await Scorecard.findById(req.params.id).populate(
      'creator',
      'name email avatar'
    );

    if (!scorecard) {
      return res.status(404).json({ success: false, message: 'Scorecard not found' });
    }

    if (scorecard.visibility === 'private') {
      // Check if current user is owner
      if (!req.user || scorecard.creator._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'This scorecard is private'
        });
      }
    }

    res.status(200).json({
      success: true,
      scorecard
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update custom scorecard
// @route   PUT /api/scorecards/:id
// @access  Private (Creator only)
export const updateScorecard = async (req, res, next) => {
  try {
    const scorecard = await Scorecard.findById(req.params.id);
    if (!scorecard) {
      return res.status(404).json({ success: false, message: 'Scorecard not found' });
    }

    if (scorecard.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are only authorized to edit scorecards you created'
      });
    }

    const fields = [
      'title',
      'sport',
      'matchType',
      'venue',
      'matchDate',
      'duration',
      'visibility',
      'teamA',
      'teamB',
      'sportData',
      'result',
      'notes',
      'status'
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        scorecard[field] = req.body[field];
      }
    });

    await scorecard.save();

    res.status(200).json({
      success: true,
      message: 'Scorecard updated successfully',
      scorecard
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete custom scorecard
// @route   DELETE /api/scorecards/:id
// @access  Private (Creator only)
export const deleteScorecard = async (req, res, next) => {
  try {
    const scorecard = await Scorecard.findById(req.params.id);
    if (!scorecard) {
      return res.status(404).json({ success: false, message: 'Scorecard not found' });
    }

    if (scorecard.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are only authorized to delete your own scorecards'
      });
    }

    await scorecard.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Scorecard deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
