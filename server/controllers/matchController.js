import Match from '../models/Match.js';
import MatchEvent from '../models/MatchEvent.js';
import Competition from '../models/Competition.js';
import Follow from '../models/Follow.js';
import { emitScoreUpdate, emitMatchEvent } from '../services/socketService.js';
import { sendNotification } from '../services/notificationService.js';

// @desc    Get matches with filtering & pagination
// @route   GET /api/matches
// @access  Public
export const getMatches = async (req, res, next) => {
  try {
    const { sport, status, category, competition, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (sport && sport !== 'all') {
      query.sport = sport.toLowerCase();
    }

    if (status && status !== 'all') {
      query.status = status.toLowerCase();
    }

    if (category && category !== 'all') {
      query.category = category.toLowerCase();
    }

    if (competition) {
      query.competition = competition;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'teamA.name': { $regex: search, $options: 'i' } },
        { 'teamB.name': { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const matches = await Match.find(query)
      .sort({
        status: 1, // 'completed' is later, 'live' and 'upcoming' first depending on sort
        scheduledAt: status === 'completed' ? -1 : 1
      })
      .skip(skip)
      .limit(Number(limit))
      .populate('competition', 'name category season');

    const total = await Match.countDocuments(query);

    res.status(200).json({
      success: true,
      count: matches.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      matches
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get live matches for quick ticker / marquee
// @route   GET /api/matches/live
// @access  Public
export const getLiveMatches = async (req, res, next) => {
  try {
    const { sport } = req.query;
    const query = { status: 'live' };
    if (sport && sport !== 'all') {
      query.sport = sport.toLowerCase();
    }

    const matches = await Match.find(query)
      .sort({ updatedAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: matches.length,
      matches
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get match by ID with timeline & events
// @route   GET /api/matches/:id
// @access  Public
export const getMatchById = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('competition')
      .populate('organizer', 'name email');

    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    const events = await MatchEvent.find({ match: match._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      match,
      events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new match
// @route   POST /api/matches
// @access  Private (Organizer, Admin)
export const createMatch = async (req, res, next) => {
  try {
    const {
      title,
      sport,
      competition,
      competitionName,
      category,
      teamA,
      teamB,
      venue,
      scheduledAt,
      sportDetails
    } = req.body;

    if (!title || !sport || !teamA?.name || !teamB?.name || !venue) {
      return res.status(400).json({
        success: false,
        message: 'Title, sport, both team names, and venue are required'
      });
    }

    const match = await Match.create({
      title,
      sport: sport.toLowerCase(),
      competition: competition || undefined,
      competitionName: competitionName || 'Exhibition League',
      category: category || 'local',
      teamA: {
        name: teamA.name,
        shortName: teamA.shortName || teamA.name.slice(0, 3).toUpperCase(),
        logo: teamA.logo || '',
        score: teamA.score || 0,
        scoreDisplay: teamA.scoreDisplay || '0'
      },
      teamB: {
        name: teamB.name,
        shortName: teamB.shortName || teamB.name.slice(0, 3).toUpperCase(),
        logo: teamB.logo || '',
        score: teamB.score || 0,
        scoreDisplay: teamB.scoreDisplay || '0'
      },
      venue,
      scheduledAt: scheduledAt || Date.now(),
      status: 'upcoming',
      matchProgress: 'Upcoming',
      sportDetails: sportDetails || {},
      organizer: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Match created successfully',
      match
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update match status or details
// @route   PUT /api/matches/:id
// @access  Private (Organizer, Admin)
export const updateMatch = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    // Role check: Only the organizer of the match or an Admin can edit
    if (
      req.user.role !== 'admin' &&
      match.organizer &&
      match.organizer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this match'
      });
    }

    const allowedFields = [
      'title',
      'venue',
      'scheduledAt',
      'status',
      'matchProgress',
      'category',
      'competitionName',
      'sportDetails',
      'result'
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        match[field] = req.body[field];
      }
    });

    if (req.body.teamA) {
      match.teamA = { ...match.teamA.toObject(), ...req.body.teamA };
    }
    if (req.body.teamB) {
      match.teamB = { ...match.teamB.toObject(), ...req.body.teamB };
    }

    await match.save();

    // Broadcast updated match
    emitScoreUpdate(match._id, match);

    res.status(200).json({
      success: true,
      message: 'Match updated successfully',
      match
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update live score for a match (real-time scorer)
// @route   PUT /api/matches/:id/score
// @access  Private (Organizer, Admin)
export const updateScore = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    if (
      req.user.role !== 'admin' &&
      match.organizer &&
      match.organizer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to score this match'
      });
    }

    const {
      teamAScore,
      teamAScoreDisplay,
      teamBScore,
      teamBScoreDisplay,
      matchProgress,
      status,
      sportDetails,
      event
    } = req.body;

    if (teamAScore !== undefined) match.teamA.score = teamAScore;
    if (teamAScoreDisplay !== undefined) match.teamA.scoreDisplay = teamAScoreDisplay;

    if (teamBScore !== undefined) match.teamB.score = teamBScore;
    if (teamBScoreDisplay !== undefined) match.teamB.scoreDisplay = teamBScoreDisplay;

    if (matchProgress !== undefined) match.matchProgress = matchProgress;
    if (status !== undefined) match.status = status;
    if (sportDetails !== undefined) match.sportDetails = sportDetails;

    await match.save();

    // If an associated event was also submitted (e.g. "GOAL - 78'", "WICKET - Over 14.2")
    if (event && event.description) {
      await MatchEvent.create({
        match: match._id,
        time: event.time || match.matchProgress,
        eventType: event.eventType || 'score',
        team: event.team || 'teamA',
        player: event.player || '',
        description: event.description,
        scoreSnapshot: `${match.teamA.scoreDisplay} - ${match.teamB.scoreDisplay}`
      });

      emitMatchEvent(match._id, event);
    }

    // Broadcast live score update via WebSockets
    emitScoreUpdate(match._id, match);

    res.status(200).json({
      success: true,
      message: 'Score updated and broadcasted successfully',
      match
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add match timeline event
// @route   POST /api/matches/:id/events
// @access  Private (Organizer, Admin)
export const addMatchEvent = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    const { time, eventType, team, player, description } = req.body;

    const event = await MatchEvent.create({
      match: match._id,
      time: time || match.matchProgress,
      eventType: eventType || 'point',
      team: team || 'teamA',
      player: player || '',
      description: description || 'Match Event Recorded',
      scoreSnapshot: `${match.teamA.scoreDisplay} - ${match.teamB.scoreDisplay}`
    });

    emitMatchEvent(match._id, event);

    res.status(201).json({
      success: true,
      event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Declare match result & finalize
// @route   PUT /api/matches/:id/result
// @access  Private (Organizer, Admin)
export const declareResult = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    const { winner, margin, summary } = req.body;

    match.status = 'completed';
    match.matchProgress = 'Final';
    match.result = {
      winner: winner || 'draw',
      margin: margin || '',
      summary: summary || 'Match finished'
    };

    await match.save();

    // Broadcast final score
    emitScoreUpdate(match._id, match);

    // Notify users who follow this match or these teams
    const followers = await Follow.find({
      targetType: 'match',
      targetId: match._id
    });

    followers.forEach((f) => {
      sendNotification({
        recipient: f.user,
        title: `Match Ended: ${match.title}`,
        message: `${match.result.margin || match.result.summary}`,
        type: 'match',
        link: `/matches/${match._id}`
      });
    });

    res.status(200).json({
      success: true,
      message: 'Match result declared and archived',
      match
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete match
// @route   DELETE /api/matches/:id
// @access  Private (Organizer, Admin)
export const deleteMatch = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    if (
      req.user.role !== 'admin' &&
      match.organizer &&
      match.organizer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this match'
      });
    }

    await MatchEvent.deleteMany({ match: match._id });
    await match.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Match and associated events deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
