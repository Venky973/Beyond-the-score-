import Competition from '../models/Competition.js';
import Match from '../models/Match.js';

export const getCompetitions = async (req, res, next) => {
  try {
    const { sport, category, status } = req.query;
    const query = {};
    if (sport && sport !== 'all') query.sport = sport.toLowerCase();
    if (category && category !== 'all') query.category = category.toLowerCase();
    if (status && status !== 'all') query.status = status.toLowerCase();

    const competitions = await Competition.find(query)
      .populate('organizer', 'name email')
      .populate('teams', 'name shortName logo')
      .sort({ startDate: -1 });

    res.status(200).json({ success: true, count: competitions.length, competitions });
  } catch (error) {
    next(error);
  }
};

export const getCompetitionById = async (req, res, next) => {
  try {
    const competition = await Competition.findById(req.params.id)
      .populate('organizer', 'name email')
      .populate('teams');

    if (!competition) {
      return res.status(404).json({ success: false, message: 'Competition not found' });
    }

    const matches = await Match.find({ competition: competition._id }).sort({ scheduledAt: 1 });

    res.status(200).json({ success: true, competition, matches });
  } catch (error) {
    next(error);
  }
};

export const createCompetition = async (req, res, next) => {
  try {
    const { name, sport, category, season, venue, startDate, endDate, description } = req.body;
    const competition = await Competition.create({
      name,
      sport: sport.toLowerCase(),
      category: category || 'local',
      season: season || '2026',
      venue: venue || '',
      startDate: startDate || Date.now(),
      endDate,
      description: description || '',
      organizer: req.user._id
    });

    res.status(201).json({ success: true, competition });
  } catch (error) {
    next(error);
  }
};
