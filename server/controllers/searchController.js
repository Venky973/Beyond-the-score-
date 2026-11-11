import Match from '../models/Match.js';
import Turf from '../models/Turf.js';
import PlayerProfile from '../models/PlayerProfile.js';
import Team from '../models/Team.js';
import Competition from '../models/Competition.js';
import Sport from '../models/Sport.js';

// @desc    Global multi-entity real-time search
// @route   GET /api/search
// @access  Public
export const globalSearch = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(200).json({
        success: true,
        query: '',
        results: {
          matches: [],
          turfs: [],
          players: [],
          teams: [],
          competitions: [],
          sports: []
        },
        totalResults: 0
      });
    }

    const keyword = q.trim();
    const regex = new RegExp(keyword, 'i');

    const [matches, turfs, players, teams, competitions, sports] = await Promise.all([
      Match.find({
        $or: [
          { title: regex },
          { 'teamA.name': regex },
          { 'teamB.name': regex },
          { venue: regex }
        ]
      })
        .select('title sport status teamA teamB venue scheduledAt matchProgress')
        .limit(6),

      Turf.find({
        status: 'approved',
        $or: [{ name: regex }, { city: regex }, { address: regex }, { supportedSports: { $in: [regex] } }]
      })
        .select('name city address supportedSports rentalPricePerHour images rating')
        .limit(6),

      PlayerProfile.find({
        $or: [{ name: regex }, { position: regex }, { teamName: regex }, { sport: regex }]
      })
        .select('name sport position teamName avatar matchesPlayed')
        .limit(6),

      Team.find({
        $or: [{ name: regex }, { shortName: regex }, { city: regex }, { sport: regex }]
      })
        .select('name shortName sport city logo')
        .limit(6),

      Competition.find({
        $or: [{ name: regex }, { sport: regex }, { venue: regex }]
      })
        .select('name sport category season status')
        .limit(6),

      Sport.find({
        $or: [{ name: regex }, { slug: regex }]
      })
        .select('name slug icon')
        .limit(6)
    ]);

    const totalResults =
      matches.length +
      turfs.length +
      players.length +
      teams.length +
      competitions.length +
      sports.length;

    res.status(200).json({
      success: true,
      query: keyword,
      results: {
        matches,
        turfs,
        players,
        teams,
        competitions,
        sports
      },
      totalResults
    });
  } catch (error) {
    next(error);
  }
};
