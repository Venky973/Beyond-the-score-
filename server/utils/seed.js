import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { sampleUsers, sampleSports } from './seedData.js';

import User from '../models/User.js';
import Sport from '../models/Sport.js';
import Team from '../models/Team.js';
import PlayerProfile from '../models/PlayerProfile.js';
import Competition from '../models/Competition.js';
import Match from '../models/Match.js';
import MatchEvent from '../models/MatchEvent.js';
import Turf from '../models/Turf.js';
import Booking from '../models/Booking.js';
import Scorecard from '../models/Scorecard.js';
import Notification from '../models/Notification.js';

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/beyond-the-score';

const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('[Seed]: Connected to MongoDB at', mongoURI);

    // Clear existing records
    await Promise.all([
      User.deleteMany({}),
      Sport.deleteMany({}),
      Team.deleteMany({}),
      PlayerProfile.deleteMany({}),
      Competition.deleteMany({}),
      Match.deleteMany({}),
      MatchEvent.deleteMany({}),
      Turf.deleteMany({}),
      Booking.deleteMany({}),
      Scorecard.deleteMany({}),
      Notification.deleteMany({})
    ]);
    console.log('[Seed]: Database cleared.');

    // 1. Create Users
    const users = await User.create(sampleUsers);
    console.log(`[Seed]: Created ${users.length} Users.`);

    const admin = users.find((u) => u.role === 'admin');
    const organizer = users.find((u) => u.role === 'organizer');
    const operator = users.find((u) => u.role === 'operator');
    const player1User = users.find((u) => u.email === 'player@beyondthescore.com');
    const player2User = users.find((u) => u.email === 'lucas@beyondthescore.com');
    const generalUser = users.find((u) => u.role === 'user');

    // 2. Create Sports
    const sports = await Sport.create(sampleSports);
    console.log(`[Seed]: Created ${sports.length} Sports.`);

    // 3. Create Teams
    const teamsData = [
      {
        name: 'Apex Strikers',
        shortName: 'APX',
        sport: 'football',
        city: 'Metropolis',
        captain: 'Lucas Silva',
        coach: 'Roberto Martinez',
        logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80',
        stats: { matches: 18, wins: 13, losses: 3, draws: 2, points: 41 },
        createdBy: organizer._id
      },
      {
        name: 'Thunderbolts SC',
        shortName: 'TB',
        sport: 'football',
        city: 'Riverdale',
        captain: 'David Alcantara',
        coach: 'Hans Flick',
        logo: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=100&auto=format&fit=crop&q=80',
        stats: { matches: 18, wins: 11, losses: 4, draws: 3, points: 36 },
        createdBy: organizer._id
      },
      {
        name: 'Horizon Royals CC',
        shortName: 'HRC',
        sport: 'cricket',
        city: 'Central Valley',
        captain: 'Rohan Sharma',
        coach: 'Gary Kirsten',
        logo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=100&auto=format&fit=crop&q=80',
        stats: { matches: 22, wins: 16, losses: 6, draws: 0, points: 32 },
        createdBy: organizer._id
      },
      {
        name: 'Titan Warriors CC',
        shortName: 'TWC',
        sport: 'cricket',
        city: 'Coastal City',
        captain: 'Kane Williamson',
        coach: 'Brendon McCullum',
        logo: 'https://images.unsplash.com/photo-1531415074868-036b1c57e3b0?w=100&auto=format&fit=crop&q=80',
        stats: { matches: 22, wins: 14, losses: 8, draws: 0, points: 28 },
        createdBy: organizer._id
      },
      {
        name: 'Cyber Knights',
        shortName: 'CK',
        sport: 'basketball',
        city: 'Tech Park Arena',
        captain: 'Marcus Hayes',
        coach: 'Steve Kerr',
        logo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&auto=format&fit=crop&q=80',
        stats: { matches: 24, wins: 18, losses: 6, draws: 0, points: 36 },
        createdBy: organizer._id
      },
      {
        name: 'Velocity Vipers',
        shortName: 'VV',
        sport: 'basketball',
        city: 'Highland Park',
        captain: 'DeAndre Clark',
        coach: 'Erik Spoelstra',
        logo: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=100&auto=format&fit=crop&q=80',
        stats: { matches: 24, wins: 15, losses: 9, draws: 0, points: 30 },
        createdBy: organizer._id
      }
    ];
    const teams = await Team.create(teamsData);
    console.log(`[Seed]: Created ${teams.length} Teams.`);

    // 4. Create Player Profiles
    const playersData = [
      {
        user: player1User._id,
        name: 'Rohan Sharma',
        avatar: player1User.avatar,
        sport: 'cricket',
        teamName: 'Horizon Royals CC',
        position: 'Top-Order Batsman',
        jerseyNumber: 45,
        location: 'Mumbai / Delhi',
        bio: 'Aggressive opening batsman known for effortless timing and elegant pull shots.',
        matchesPlayed: 48,
        wins: 34,
        losses: 14,
        draws: 0,
        cricketStats: {
          runs: 2180,
          battingAvg: 49.54,
          strikeRate: 142.8,
          wickets: 18,
          bowlingEconomy: 7.24,
          highestScore: 122,
          fifties: 16,
          hundreds: 5,
          catches: 24
        },
        recentForm: ['W', 'W', 'W', 'L', 'W']
      },
      {
        user: player2User._id,
        name: 'Lucas Silva',
        avatar: player2User.avatar,
        sport: 'football',
        teamName: 'Apex Strikers',
        position: 'Centre Forward (ST)',
        jerseyNumber: 9,
        location: 'Rio / Madrid',
        bio: 'Clinical goalscorer with high sprint speed and sharp predatory instinct in the box.',
        matchesPlayed: 38,
        wins: 28,
        losses: 6,
        draws: 4,
        footballStats: {
          goals: 34,
          assists: 14,
          shotsOnTarget: 76,
          passAccuracy: 84.5,
          cleanSheets: 0,
          yellowCards: 3,
          redCards: 0
        },
        recentForm: ['W', 'W', 'D', 'W', 'W']
      },
      // Comparison peer for Cricket
      {
        user: organizer._id,
        name: 'Kane Williamson',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        sport: 'cricket',
        teamName: 'Titan Warriors CC',
        position: 'Top-Order Anchor',
        jerseyNumber: 22,
        location: 'Tauranga / Auckland',
        bio: 'Composed technical batsman specializing in high match-building averages under pressure.',
        matchesPlayed: 46,
        wins: 30,
        losses: 16,
        draws: 0,
        cricketStats: {
          runs: 1954,
          battingAvg: 51.42,
          strikeRate: 128.6,
          wickets: 12,
          bowlingEconomy: 6.85,
          highestScore: 114,
          fifties: 15,
          hundreds: 4,
          catches: 28
        },
        recentForm: ['L', 'W', 'W', 'W', 'L']
      },
      // Comparison peer for Football
      {
        user: admin._id,
        name: 'David Alcantara',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        sport: 'football',
        teamName: 'Thunderbolts SC',
        position: 'Winger / Second Striker',
        jerseyNumber: 11,
        location: 'Barcelona',
        bio: 'Creative playmaker with brilliant dribbling accuracy and dead-ball prowess.',
        matchesPlayed: 36,
        wins: 22,
        losses: 8,
        draws: 6,
        footballStats: {
          goals: 22,
          assists: 19,
          shotsOnTarget: 58,
          passAccuracy: 88.2,
          cleanSheets: 0,
          yellowCards: 4,
          redCards: 1
        },
        recentForm: ['W', 'L', 'W', 'D', 'W']
      }
    ];
    const players = await PlayerProfile.create(playersData);
    console.log(`[Seed]: Created ${players.length} Player Profiles.`);

    // 5. Create Competitions
    const competitionsData = [
      {
        name: 'Premier Cricket Super Trophy',
        sport: 'cricket',
        category: 'national',
        season: '2026',
        venue: 'Grand International Stadium',
        status: 'ongoing',
        organizer: organizer._id,
        description: 'Elite 8-team franchise tournament featuring national and domestic stars.'
      },
      {
        name: 'City Premier League Football',
        sport: 'football',
        category: 'domestic',
        season: '2026',
        venue: 'Central Football Complex',
        status: 'ongoing',
        organizer: organizer._id,
        description: 'Annual competitive division pitting the metropolitan football clubs against each other.'
      },
      {
        name: 'Metro Hoops Championship',
        sport: 'basketball',
        category: 'state',
        season: '2026',
        venue: 'Downtown Arena 1',
        status: 'ongoing',
        organizer: organizer._id,
        description: 'Fast-paced basketball championship with weekly round-robin ties.'
      }
    ];
    const competitions = await Competition.create(competitionsData);
    console.log(`[Seed]: Created ${competitions.length} Competitions.`);

    // 6. Create Matches (Live, Upcoming, Completed)
    const matchesData = [
      // 1. LIVE CRICKET MATCH
      {
        title: 'Horizon Royals CC vs Titan Warriors CC',
        sport: 'cricket',
        competition: competitions[0]._id,
        competitionName: competitions[0].name,
        category: 'national',
        venue: 'Grand International Stadium, Pitch 1',
        scheduledAt: new Date(Date.now() - 2 * 3600 * 1000), // started 2 hours ago
        status: 'live',
        matchProgress: 'Over 18.2 (2nd Innings)',
        teamA: {
          name: 'Horizon Royals CC',
          shortName: 'HRC',
          logo: teams[2].logo,
          score: { runs: 188, wickets: 5, overs: 20 },
          scoreDisplay: '188/5 (20.0)'
        },
        teamB: {
          name: 'Titan Warriors CC',
          shortName: 'TWC',
          logo: teams[3].logo,
          score: { runs: 164, wickets: 4, overs: 18.2 },
          scoreDisplay: '164/4 (18.2)'
        },
        sportDetails: {
          target: 189,
          crr: 8.94,
          rrr: 15.0,
          ballsRemaining: 10,
          runsNeeded: 25,
          toss: 'Horizon Royals CC won the toss and elected to bat first',
          currentInnings: 2,
          batsmen: [
            { name: 'Kane Williamson', runs: 74, balls: 48, fours: 7, sixes: 2, strikeRate: 154.2, onStrike: true },
            { name: 'Mitchell Santner', runs: 18, balls: 11, fours: 1, sixes: 1, strikeRate: 163.6, onStrike: false }
          ],
          bowlers: [
            { name: 'Jasprit Bumrah', overs: 3.2, maidens: 0, runs: 26, wickets: 2, economy: 7.8 }
          ],
          recentBalls: ['1', '4', '2', 'W', '6', '1']
        },
        organizer: organizer._id,
        isFeatured: true
      },
      // 2. LIVE FOOTBALL MATCH
      {
        title: 'Apex Strikers vs Thunderbolts SC',
        sport: 'football',
        competition: competitions[1]._id,
        competitionName: competitions[1].name,
        category: 'domestic',
        venue: 'Central Football Complex, Field A',
        scheduledAt: new Date(Date.now() - 75 * 60 * 1000), // started 75 mins ago
        status: 'live',
        matchProgress: "76' (2nd Half)",
        teamA: {
          name: 'Apex Strikers',
          shortName: 'APX',
          logo: teams[0].logo,
          score: 2,
          scoreDisplay: '2'
        },
        teamB: {
          name: 'Thunderbolts SC',
          shortName: 'TB',
          logo: teams[1].logo,
          score: 1,
          scoreDisplay: '1'
        },
        sportDetails: {
          time: "76'",
          possession: [58, 42],
          shots: [15, 9],
          shotsOnTarget: [7, 4],
          corners: [6, 3],
          fouls: [8, 12],
          goals: [
            { minute: "19'", team: 'teamA', player: 'Lucas Silva', assist: 'Julian Santos' },
            { minute: "52'", team: 'teamB', player: 'David Alcantara' },
            { minute: "68'", team: 'teamA', player: 'Mateo Kovac', assist: 'Lucas Silva' }
          ],
          cards: [
            { minute: "34'", team: 'teamB', player: 'Sergio Ramos', card: 'yellow' },
            { minute: "61'", team: 'teamA', player: 'Enzo Fernandez', card: 'yellow' }
          ]
        },
        organizer: organizer._id,
        isFeatured: true
      },
      // 3. LIVE BASKETBALL MATCH
      {
        title: 'Cyber Knights vs Velocity Vipers',
        sport: 'basketball',
        competition: competitions[2]._id,
        competitionName: competitions[2].name,
        category: 'state',
        venue: 'Downtown Arena 1',
        scheduledAt: new Date(Date.now() - 50 * 60 * 1000),
        status: 'live',
        matchProgress: 'Q4 03:42',
        teamA: {
          name: 'Cyber Knights',
          shortName: 'CK',
          logo: teams[4].logo,
          score: 88,
          scoreDisplay: '88'
        },
        teamB: {
          name: 'Velocity Vipers',
          shortName: 'VV',
          logo: teams[5].logo,
          score: 84,
          scoreDisplay: '84'
        },
        sportDetails: {
          quarter: 'Q4',
          quarterScores: {
            teamA: [24, 22, 26, 16],
            teamB: [20, 26, 21, 17]
          },
          topScorerA: { name: 'Marcus Hayes', points: 31, rebounds: 7, assists: 6 },
          topScorerB: { name: 'DeAndre Clark', points: 28, rebounds: 11, assists: 3 }
        },
        organizer: organizer._id,
        isFeatured: true
      },
      // 4. UPCOMING MATCH
      {
        title: 'Horizon Royals CC vs Southern Blitzers',
        sport: 'cricket',
        competition: competitions[0]._id,
        competitionName: competitions[0].name,
        category: 'national',
        venue: 'National Cricket Grounds',
        scheduledAt: new Date(Date.now() + 24 * 3600 * 1000), // tomorrow
        status: 'upcoming',
        matchProgress: 'Scheduled',
        teamA: {
          name: 'Horizon Royals CC',
          shortName: 'HRC',
          logo: teams[2].logo,
          score: 0,
          scoreDisplay: '-'
        },
        teamB: {
          name: 'Southern Blitzers',
          shortName: 'SB',
          logo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=100&auto=format&fit=crop&q=80',
          score: 0,
          scoreDisplay: '-'
        },
        organizer: organizer._id
      },
      // 5. COMPLETED MATCH
      {
        title: 'Thunderbolts SC vs Capital FC',
        sport: 'football',
        competition: competitions[1]._id,
        competitionName: competitions[1].name,
        category: 'domestic',
        venue: 'Riverside Arena',
        scheduledAt: new Date(Date.now() - 48 * 3600 * 1000),
        status: 'completed',
        matchProgress: 'Full Time',
        teamA: {
          name: 'Thunderbolts SC',
          shortName: 'TB',
          logo: teams[1].logo,
          score: 3,
          scoreDisplay: '3'
        },
        teamB: {
          name: 'Capital FC',
          shortName: 'CFC',
          logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=80',
          score: 1,
          scoreDisplay: '1'
        },
        result: {
          winner: 'teamA',
          margin: 'Thunderbolts SC won 3-1',
          summary: 'Brilliant second half double from David Alcantara secured all three points.'
        },
        organizer: organizer._id
      }
    ];
    const matches = await Match.create(matchesData);
    console.log(`[Seed]: Created ${matches.length} Matches.`);

    // Match timeline events for live match
    await MatchEvent.create([
      {
        match: matches[0]._id,
        time: 'Over 17.4',
        eventType: 'boundary_six',
        team: 'teamB',
        player: 'Kane Williamson',
        description: 'Huge six over deep midwicket! Cleans the boundary ropes with ease.',
        scoreSnapshot: '158/4'
      },
      {
        match: matches[0]._id,
        time: 'Over 16.5',
        eventType: 'wicket',
        team: 'teamA',
        player: 'Jasprit Bumrah',
        description: 'WICKET! Clean bowled with an express 145km/h yorker.',
        scoreSnapshot: '148/4'
      },
      {
        match: matches[1]._id,
        time: "68'",
        eventType: 'goal',
        team: 'teamA',
        player: 'Mateo Kovac',
        description: 'GOAL! Powerful low drive into the bottom left corner off Silva’s cutback.',
        scoreSnapshot: '2 - 1'
      }
    ]);

    // 7. Create Turfs with real coordinates across metropolitan hubs
    const turfsData = [
      {
        name: 'KickOff Arena & Sports Turf',
        operator: operator._id,
        address: 'Plot 42, Sector 18, Sports Enclave',
        city: 'Metropolis',
        state: 'NY',
        zipCode: '10001',
        location: {
          type: 'Point',
          coordinates: [-73.9851, 40.7488] // NYC coordinates
        },
        supportedSports: ['Football', 'Cricket'],
        rentalPricePerHour: 45,
        operatingHours: {
          open: '06:00',
          close: '23:00',
          daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        facilities: [
          'FIFA-grade Synthetic Turf',
          'High-intensity LED Floodlights',
          'Changing Rooms & Showers',
          'Free Mineral Water',
          'Parking for 40 Cars',
          'Spectator Gallery'
        ],
        images: [
          'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80'
        ],
        description:
          'Premier all-weather synthetic turf engineered for fast 5-a-side football and box cricket leagues. Equipped with tournament-standard lighting.',
        contactPhone: '+1 555-4001',
        contactEmail: 'kickoff@eliteturfs.com',
        rating: 4.9,
        totalReviews: 68,
        isVerified: true,
        status: 'approved'
      },
      {
        name: 'The Pavilion Multi-Sport Turf',
        operator: operator._id,
        address: '88 Riverfront Boulevard',
        city: 'Riverdale',
        state: 'NJ',
        zipCode: '07030',
        location: {
          type: 'Point',
          coordinates: [-74.0324, 40.7439]
        },
        supportedSports: ['Cricket', 'Football', 'Badminton'],
        rentalPricePerHour: 55,
        operatingHours: {
          open: '06:00',
          close: '23:00',
          daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        facilities: [
          'Full-pitch Cricket Box with nets',
          'Floodlights',
          'Air-conditioned Changing Rooms',
          'Equipment Rental (Bats, Balls, Bibs)',
          'Cafeteria with smoothies',
          'Live Score Display Board'
        ],
        images: [
          'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80'
        ],
        description:
          'Spacious modern sports complex with rubberized turf shock-pad underlay, perfect for corporate tournaments and high-stakes weekend matches.',
        contactPhone: '+1 555-4002',
        contactEmail: 'pavilion@eliteturfs.com',
        rating: 4.8,
        totalReviews: 45,
        isVerified: true,
        status: 'approved'
      },
      {
        name: 'Apex Court & Racket Center',
        operator: operator._id,
        address: '15 Technology Hub Way',
        city: 'Central Valley',
        state: 'CA',
        zipCode: '94016',
        location: {
          type: 'Point',
          coordinates: [-122.0842, 37.422]
        },
        supportedSports: ['Tennis', 'Badminton', 'Basketball'],
        rentalPricePerHour: 40,
        operatingHours: {
          open: '07:00',
          close: '22:00',
          daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        facilities: [
          'Hard Court Tennis with cushioned acrylic',
          '4 BWF-approved Wooden Badminton Courts',
          'Locker Facility',
          'Ball Machine Rental',
          'Pro Shop'
        ],
        images: [
          'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80'
        ],
        description:
          'Championship-standard indoor & outdoor courts for racket sports lovers. Features climate control and specialized lighting.',
        contactPhone: '+1 555-4003',
        contactEmail: 'courts@eliteturfs.com',
        rating: 4.7,
        totalReviews: 32,
        isVerified: true,
        status: 'approved'
      },
      // Pending turf for Admin approval demonstration
      {
        name: 'Green Field Valley Arena',
        operator: operator._id,
        address: 'Highway Bypass Road 9',
        city: 'North Hills',
        state: 'CA',
        zipCode: '91343',
        location: {
          type: 'Point',
          coordinates: [-118.4735, 34.2355]
        },
        supportedSports: ['Football', 'Volleyball'],
        rentalPricePerHour: 35,
        operatingHours: {
          open: '08:00',
          close: '22:00',
          daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        facilities: ['Standard Turf', 'Parking', 'Restrooms'],
        images: [
          'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&auto=format&fit=crop&q=80'
        ],
        description: 'New grass-turf facility seeking verification for community weekend leagues.',
        contactPhone: '+1 555-4004',
        contactEmail: 'valley@greenturf.com',
        rating: 4.5,
        totalReviews: 4,
        isVerified: false,
        status: 'pending'
      }
    ];
    const turfs = await Turf.create(turfsData);
    console.log(`[Seed]: Created ${turfs.length} Turfs.`);

    // 8. Create Sample Bookings
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0];

    const bookingsData = [
      {
        bookingId: 'BTS-2026-9142',
        turf: turfs[0]._id,
        user: generalUser._id,
        sport: 'Football',
        bookingDate: tomorrow,
        startTime: '19:00',
        endTime: '21:00',
        durationHours: 2,
        rentalPrice: 90,
        status: 'confirmed',
        notes: 'Weekend friendly match with corporate colleagues'
      },
      {
        bookingId: 'BTS-2026-5829',
        turf: turfs[1]._id,
        user: player1User._id,
        sport: 'Cricket',
        bookingDate: tomorrow,
        startTime: '17:00',
        endTime: '19:00',
        durationHours: 2,
        rentalPrice: 110,
        status: 'pending',
        notes: 'Net practice and fielding drills'
      },
      {
        bookingId: 'BTS-2026-3104',
        turf: turfs[0]._id,
        user: player2User._id,
        sport: 'Football',
        bookingDate: todayStr,
        startTime: '10:00',
        endTime: '11:00',
        durationHours: 1,
        rentalPrice: 45,
        status: 'completed',
        notes: 'Morning agility and shooting session'
      }
    ];
    const bookings = await Booking.create(bookingsData);
    console.log(`[Seed]: Created ${bookings.length} Bookings.`);

    // 9. Create Custom Scorecards (Dynamic per sport)
    const scorecardsData = [
      {
        title: 'Sunday Morning Box Cricket Thriller',
        sport: 'cricket',
        matchType: 'friendly',
        venue: 'The Pavilion Turf, Riverdale',
        matchDate: new Date(Date.now() - 24 * 3600 * 1000),
        duration: '1.5 Hours',
        visibility: 'public',
        shareCode: 'cricket-thriller-2026',
        creator: generalUser._id,
        teamA: {
          name: 'Weekend XI',
          scoreDisplay: '112/4 (10.0)',
          scoreDetails: { runs: 112, wickets: 4, overs: 10, extras: 6 },
          players: [
            { name: 'Sarah Jenkins', role: 'Batsman', stats: { runs: 42, balls: 24, fours: 4, sixes: 2 } },
            { name: 'Arun K.', role: 'All-Rounder', stats: { runs: 28, balls: 14, wickets: 2 } }
          ]
        },
        teamB: {
          name: 'Tech Spartans',
          scoreDisplay: '104/7 (10.0)',
          scoreDetails: { runs: 104, wickets: 7, overs: 10, extras: 8 },
          players: [
            { name: 'Devon Miles', role: 'Captain / Bowler', stats: { runs: 35, balls: 18, wickets: 1 } },
            { name: 'Priya N.', role: 'Wicketkeeper', stats: { runs: 19, balls: 16 } }
          ]
        },
        sportData: {
          oversPerSide: 10,
          target: 113,
          mom: 'Sarah Jenkins (42 off 24 balls)'
        },
        result: {
          winner: 'teamA',
          margin: 'Weekend XI won by 8 runs',
          summary: 'Tense finish with 14 runs needed off the last over, defended successfully.'
        },
        notes: 'Great match played under floodlights, full team dinner afterwards.',
        status: 'completed'
      },
      {
        title: 'Metro 5-a-Side Cup Final',
        sport: 'football',
        matchType: 'amateur',
        venue: 'KickOff Arena Pitch 1',
        matchDate: new Date(Date.now() - 72 * 3600 * 1000),
        duration: '50 Mins',
        visibility: 'public',
        shareCode: 'metro-5aside-final',
        creator: player2User._id,
        teamA: {
          name: 'Night Hawks FC',
          scoreDisplay: '4',
          scoreDetails: { goals: 4, assists: 3, fouls: 5 },
          players: [
            { name: 'Lucas Silva', role: 'Striker', stats: { goals: 3, assists: 1 } },
            { name: 'Leo G.', role: 'Goalkeeper', stats: { saves: 8 } }
          ]
        },
        teamB: {
          name: 'Red Dragons',
          scoreDisplay: '2',
          scoreDetails: { goals: 2, assists: 2, fouls: 7 },
          players: [
            { name: 'Carlos Ramos', role: 'Forward', stats: { goals: 2 } },
            { name: 'Sam Chen', role: 'Defender', stats: { assists: 1 } }
          ]
        },
        sportData: {
          halfTimeScore: '2 - 1',
          mvp: 'Lucas Silva (Hat-trick)'
        },
        result: {
          winner: 'teamA',
          margin: 'Night Hawks FC won 4-2',
          summary: 'Lucas Silva scored an incredible hat-trick to lift the amateur trophy.'
        },
        notes: 'Annual local amateur final, excellent crowd turn out.',
        status: 'completed'
      }
    ];
    const scorecards = await Scorecard.create(scorecardsData);
    console.log(`[Seed]: Created ${scorecards.length} Custom Scorecards.`);

    // 10. Sample Notifications
    await Notification.create([
      {
        recipient: generalUser._id,
        title: 'Booking Confirmed!',
        message: 'Your booking #BTS-2026-9142 at KickOff Arena & Sports Turf is confirmed for tomorrow 19:00.',
        type: 'booking',
        link: `/bookings/${bookings[0]._id}`
      },
      {
        recipient: generalUser._id,
        title: 'Live Score Alert',
        message: 'Titan Warriors CC need 25 runs from 10 balls in Horizon Royals CC vs Titan Warriors CC!',
        type: 'match',
        link: `/matches/${matches[0]._id}`
      },
      {
        recipient: operator._id,
        title: 'New Booking Request',
        message: 'You have a new booking request #BTS-2026-5829 waiting for review at The Pavilion Turf.',
        type: 'booking',
        link: '/operator/bookings'
      }
    ]);

    console.log('\n======================================================');
    console.log(' SEEDING COMPLETED SUCCESSFULLY!');
    console.log(' Sample Accounts to Test (password for all: password123):');
    console.log(' - Admin:     admin@beyondthescore.com');
    console.log(' - Organizer: organizer@beyondthescore.com');
    console.log(' - Operator:  operator@beyondthescore.com');
    console.log(' - Player:    player@beyondthescore.com');
    console.log(' - User:      user@beyondthescore.com');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
