import PlayerProfile from '../models/PlayerProfile.js';
import User from '../models/User.js';

// @desc    Get all players with sport filter & search
// @route   GET /api/players
// @access  Public
export const getPlayers = async (req, res, next) => {
  try {
    const { sport, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (sport && sport !== 'all') {
      query.sport = sport.toLowerCase();
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
        { teamName: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const players = await PlayerProfile.find(query)
      .sort({ matchesPlayed: -1, wins: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('user', 'name avatar email');

    const total = await PlayerProfile.countDocuments(query);

    res.status(200).json({
      success: true,
      count: players.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      players
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get player by ID
// @route   GET /api/players/:id
// @access  Public
export const getPlayerById = async (req, res, next) => {
  try {
    const player = await PlayerProfile.findById(req.params.id)
      .populate('user', 'name avatar email bio')
      .populate('team');

    if (!player) {
      return res.status(404).json({ success: false, message: 'Player profile not found' });
    }

    res.status(200).json({
      success: true,
      player
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Compare two players (MUST BE SAME SPORT)
// @route   GET /api/players/compare
// @access  Public
export const comparePlayers = async (req, res, next) => {
  try {
    const { player1Id, player2Id } = req.query;

    if (!player1Id || !player2Id) {
      return res.status(400).json({
        success: false,
        message: 'Both player1Id and player2Id are required for comparison'
      });
    }

    const player1 = await PlayerProfile.findById(player1Id);
    const player2 = await PlayerProfile.findById(player2Id);

    if (!player1 || !player2) {
      return res.status(404).json({
        success: false,
        message: 'One or both player profiles could not be found'
      });
    }

    if (player1.sport.toLowerCase() !== player2.sport.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: `Cannot compare players from different sports: ${player1.name} plays ${player1.sport.toUpperCase()} while ${player2.name} plays ${player2.sport.toUpperCase()}`
      });
    }

    // Build metric comparison matrix based on sport
    const sport = player1.sport.toLowerCase();
    let metrics = [];

    if (sport === 'cricket') {
      metrics = [
        { label: 'Matches Played', p1: player1.matchesPlayed, p2: player2.matchesPlayed },
        { label: 'Total Runs', p1: player1.cricketStats.runs, p2: player2.cricketStats.runs },
        { label: 'Batting Average', p1: player1.cricketStats.battingAvg, p2: player2.cricketStats.battingAvg },
        { label: 'Strike Rate', p1: player1.cricketStats.strikeRate, p2: player2.cricketStats.strikeRate },
        { label: 'Highest Score', p1: player1.cricketStats.highestScore, p2: player2.cricketStats.highestScore },
        { label: 'Wickets Taken', p1: player1.cricketStats.wickets, p2: player2.cricketStats.wickets },
        { label: 'Bowling Economy', p1: player1.cricketStats.bowlingEconomy, p2: player2.cricketStats.bowlingEconomy, lowerIsBetter: true },
        { label: 'Half Centuries (50s)', p1: player1.cricketStats.fifties, p2: player2.cricketStats.fifties },
        { label: 'Centuries (100s)', p1: player1.cricketStats.hundreds, p2: player2.cricketStats.hundreds }
      ];
    } else if (sport === 'football') {
      metrics = [
        { label: 'Matches Played', p1: player1.matchesPlayed, p2: player2.matchesPlayed },
        { label: 'Goals', p1: player1.footballStats.goals, p2: player2.footballStats.goals },
        { label: 'Assists', p1: player1.footballStats.assists, p2: player2.footballStats.assists },
        { label: 'Shots on Target', p1: player1.footballStats.shotsOnTarget, p2: player2.footballStats.shotsOnTarget },
        { label: 'Pass Accuracy (%)', p1: player1.footballStats.passAccuracy, p2: player2.footballStats.passAccuracy },
        { label: 'Clean Sheets', p1: player1.footballStats.cleanSheets, p2: player2.footballStats.cleanSheets },
        { label: 'Yellow Cards', p1: player1.footballStats.yellowCards, p2: player2.footballStats.yellowCards, lowerIsBetter: true }
      ];
    } else if (sport === 'basketball') {
      metrics = [
        { label: 'Matches Played', p1: player1.matchesPlayed, p2: player2.matchesPlayed },
        { label: 'Total Points', p1: player1.basketballStats.points, p2: player2.basketballStats.points },
        { label: 'Rebounds', p1: player1.basketballStats.rebounds, p2: player2.basketballStats.rebounds },
        { label: 'Assists', p1: player1.basketballStats.assists, p2: player2.basketballStats.assists },
        { label: 'Steals', p1: player1.basketballStats.steals, p2: player2.basketballStats.steals },
        { label: 'Blocks', p1: player1.basketballStats.blocks, p2: player2.basketballStats.blocks },
        { label: 'Field Goal %', p1: player1.basketballStats.fgPercentage, p2: player2.basketballStats.fgPercentage }
      ];
    } else if (sport === 'tennis') {
      metrics = [
        { label: 'Matches Played', p1: player1.matchesPlayed, p2: player2.matchesPlayed },
        { label: 'Titles Won', p1: player1.tennisStats.titles, p2: player2.tennisStats.titles },
        { label: 'Aces', p1: player1.tennisStats.aces, p2: player2.tennisStats.aces },
        { label: 'Sets Won', p1: player1.tennisStats.setsWon, p2: player2.tennisStats.setsWon },
        { label: 'First Serve %', p1: player1.tennisStats.firstServePct, p2: player2.tennisStats.firstServePct },
        { label: 'Break Points Won', p1: player1.tennisStats.breakPointsWon, p2: player2.tennisStats.breakPointsWon }
      ];
    } else {
      metrics = [
        { label: 'Matches Played', p1: player1.matchesPlayed, p2: player2.matchesPlayed },
        { label: 'Wins', p1: player1.wins, p2: player2.wins },
        { label: 'Losses', p1: player1.losses, p2: player2.losses, lowerIsBetter: true }
      ];
    }

    res.status(200).json({
      success: true,
      sport,
      player1,
      player2,
      metrics
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update player profile for authenticated user
// @route   POST /api/players/profile
// @access  Private (Player, Admin)
export const saveMyPlayerProfile = async (req, res, next) => {
  try {
    let profile = await PlayerProfile.findOne({ user: req.user._id });

    const {
      name,
      sport,
      teamName,
      position,
      jerseyNumber,
      location,
      bio,
      avatar,
      cricketStats,
      footballStats,
      basketballStats,
      tennisStats,
      volleyballStats,
      badmintonStats
    } = req.body;

    if (!profile) {
      profile = new PlayerProfile({
        user: req.user._id,
        name: name || req.user.name,
        sport: (sport || 'cricket').toLowerCase(),
        teamName: teamName || 'Independent',
        position: position || 'All-Rounder',
        jerseyNumber: jerseyNumber || 10,
        location: location || '',
        bio: bio || '',
        avatar: avatar || req.user.avatar || ''
      });
    } else {
      if (name) profile.name = name;
      if (sport) profile.sport = sport.toLowerCase();
      if (teamName !== undefined) profile.teamName = teamName;
      if (position !== undefined) profile.position = position;
      if (jerseyNumber !== undefined) profile.jerseyNumber = jerseyNumber;
      if (location !== undefined) profile.location = location;
      if (bio !== undefined) profile.bio = bio;
      if (avatar !== undefined) profile.avatar = avatar;
    }

    if (cricketStats) profile.cricketStats = { ...profile.cricketStats, ...cricketStats };
    if (footballStats) profile.footballStats = { ...profile.footballStats, ...footballStats };
    if (basketballStats) profile.basketballStats = { ...profile.basketballStats, ...basketballStats };
    if (tennisStats) profile.tennisStats = { ...profile.tennisStats, ...tennisStats };
    if (volleyballStats) profile.volleyballStats = { ...profile.volleyballStats, ...volleyballStats };
    if (badmintonStats) profile.badmintonStats = { ...profile.badmintonStats, ...badmintonStats };

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Player profile saved successfully',
      player: profile
    });
  } catch (error) {
    next(error);
  }
};
