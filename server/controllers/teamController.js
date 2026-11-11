import Team from '../models/Team.js';

export const getTeams = async (req, res, next) => {
  try {
    const { sport, search } = req.query;
    const query = {};
    if (sport && sport !== 'all') query.sport = sport.toLowerCase();
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { captain: { $regex: search, $options: 'i' } }
      ];
    }

    const teams = await Team.find(query).sort({ 'stats.wins': -1, name: 1 });
    res.status(200).json({ success: true, count: teams.length, teams });
  } catch (error) {
    next(error);
  }
};

export const getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }
    res.status(200).json({ success: true, team });
  } catch (error) {
    next(error);
  }
};

export const createTeam = async (req, res, next) => {
  try {
    const { name, shortName, sport, city, captain, coach, players } = req.body;
    const team = await Team.create({
      name,
      shortName: shortName || name.slice(0, 3).toUpperCase(),
      sport: sport.toLowerCase(),
      city: city || '',
      captain: captain || '',
      coach: coach || '',
      players: players || [],
      createdBy: req.user._id
    });
    res.status(201).json({ success: true, team });
  } catch (error) {
    next(error);
  }
};
