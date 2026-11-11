import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Trophy,
  MapPin,
  Calendar,
  ChevronLeft,
  Activity,
  Heart,
  ArrowRight,
  Shield,
  Loader2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import api from '../../services/api';

const PlayerDetail = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const res = await api.get(`/players/${id}`);
        if (res.data.success) {
          setPlayer(res.data.player);
        }
      } catch (err) {
        console.error('Failed to load player:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400 text-xs">
        <Loader2 className="w-6 h-6 text-orange-500 animate-spin mx-auto mb-2" />
        Loading athlete profile & performance charts...
      </div>
    );
  }

  if (!player) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-3">
        <h2 className="text-xl font-bold text-white">Player Not Found</h2>
        <Link to="/players" className="text-orange-400 text-xs hover:underline inline-block">
          Return to Player Directory
        </Link>
      </div>
    );
  }

  const sport = player.sport?.toLowerCase();

  // Prepare Recharts bar chart data based on sport
  let chartData = [];
  if (sport === 'cricket') {
    chartData = [
      { name: 'Runs/10', val: Math.round((player.cricketStats?.runs || 0) / 10), fill: '#F97316' },
      { name: 'Bat. Avg', val: Math.round(player.cricketStats?.battingAvg || 0), fill: '#10B981' },
      { name: 'Strike Rate', val: Math.round(player.cricketStats?.strikeRate || 0), fill: '#F59E0B' },
      { name: 'Wickets', val: player.cricketStats?.wickets || 0, fill: '#06B6D4' },
      { name: '50s & 100s', val: (player.cricketStats?.fifties || 0) + (player.cricketStats?.hundreds || 0), fill: '#A855F7' }
    ];
  } else if (sport === 'football') {
    chartData = [
      { name: 'Goals', val: player.footballStats?.goals || 0, fill: '#F97316' },
      { name: 'Assists', val: player.footballStats?.assists || 0, fill: '#10B981' },
      { name: 'Pass Acc %', val: Math.round(player.footballStats?.passAccuracy || 80), fill: '#06B6D4' },
      { name: 'Shots On Target', val: player.footballStats?.shotsOnTarget || 0, fill: '#F59E0B' }
    ];
  } else if (sport === 'basketball') {
    chartData = [
      { name: 'Points', val: player.basketballStats?.points || 0, fill: '#F97316' },
      { name: 'Rebounds', val: player.basketballStats?.rebounds || 0, fill: '#06B6D4' },
      { name: 'Assists', val: player.basketballStats?.assists || 0, fill: '#10B981' },
      { name: 'Steals', val: player.basketballStats?.steals || 0, fill: '#F59E0B' },
      { name: 'FG %', val: Math.round(player.basketballStats?.fgPercentage || 45), fill: '#A855F7' }
    ];
  } else {
    chartData = [
      { name: 'Matches', val: player.matchesPlayed || 0, fill: '#F97316' },
      { name: 'Wins', val: player.wins || 0, fill: '#10B981' },
      { name: 'Losses', val: player.losses || 0, fill: '#EF4444' }
    ];
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          to="/players"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ChevronLeft className="w-4 h-4" /> Athlete Directory
        </Link>

        <Link
          to={`/players/compare?player1Id=${player._id}`}
          className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-orange-600/20"
        >
          <Trophy className="w-3.5 h-3.5" /> Compare with Peer
        </Link>
      </div>

      {/* Profile Header Card */}
      <div className="bg-sports-dark border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-6">
        <img
          src={
            player.avatar ||
            player.user?.avatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
          }
          alt={player.name}
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-slate-700 shadow-xl"
        />

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-950/40 border border-orange-500/30 px-2.5 py-0.5 rounded">
              {player.sport}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              #{player.jerseyNumber || 10}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white">{player.name}</h1>

          <p className="text-xs sm:text-sm text-slate-300">
            {player.position} • <span className="text-orange-400 font-semibold">{player.teamName || 'Independent'}</span>
          </p>

          {player.location && (
            <p className="text-xs text-slate-400 flex items-center justify-center md:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{player.location}</span>
            </p>
          )}

          {player.bio && (
            <p className="text-xs text-slate-400 max-w-xl pt-1 leading-relaxed">
              {player.bio}
            </p>
          )}

          {/* Form pills */}
          {player.recentForm?.length > 0 && (
            <div className="flex items-center justify-center md:justify-start gap-2 pt-2">
              <span className="text-[11px] text-slate-400">Recent Form:</span>
              <div className="flex gap-1">
                {player.recentForm.map((f, i) => (
                  <span
                    key={i}
                    className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                      f === 'W'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : f === 'D'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Career Win Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center min-w-[140px]">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Record</span>
          <div className="text-xl font-bold text-white mt-1">
            <span className="text-emerald-400">{player.wins}W</span> - <span className="text-red-400">{player.losses}L</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            {player.matchesPlayed} Matches Played
          </span>
        </div>
      </div>

      {/* Performance Analytics Chart & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Bar Graph */}
        <div className="lg:col-span-2 bg-slate-850 p-6 rounded-2xl border border-slate-750 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-400" /> Career Performance Breakdown
            </h3>
            <span className="text-[11px] text-slate-400 capitalize">{sport} Metrics</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0B132B',
                    borderColor: '#1E2D54',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#F1F5F9' }}
                />
                <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Metrics Table */}
        <div className="bg-slate-850 p-6 rounded-2xl border border-slate-750 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-3">
            Individual Statistics
          </h3>

          <div className="divide-y divide-slate-800/80 text-xs">
            {sport === 'cricket' && (
              <>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Total Runs</span>
                  <span className="font-bold text-white">{player.cricketStats?.runs || 0}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Batting Average</span>
                  <span className="font-bold text-emerald-400">{player.cricketStats?.battingAvg || 0}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Strike Rate</span>
                  <span className="font-bold text-orange-400">{player.cricketStats?.strikeRate || 0}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Highest Score</span>
                  <span className="font-bold text-white">{player.cricketStats?.highestScore || 0}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Wickets Taken</span>
                  <span className="font-bold text-sky-400">{player.cricketStats?.wickets || 0}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Bowling Economy</span>
                  <span className="font-bold text-white">{player.cricketStats?.bowlingEconomy || 0}</span>
                </div>
              </>
            )}

            {sport === 'football' && (
              <>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Goals Scored</span>
                  <span className="font-bold text-orange-400">{player.footballStats?.goals || 0}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Assists Provided</span>
                  <span className="font-bold text-emerald-400">{player.footballStats?.assists || 0}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Shots on Target</span>
                  <span className="font-bold text-white">{player.footballStats?.shotsOnTarget || 0}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Pass Accuracy</span>
                  <span className="font-bold text-sky-400">{player.footballStats?.passAccuracy || 0}%</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Yellow Cards</span>
                  <span className="font-bold text-amber-400">{player.footballStats?.yellowCards || 0}</span>
                </div>
              </>
            )}

            {sport === 'basketball' && (
              <>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Total Points</span>
                  <span className="font-bold text-orange-400">{player.basketballStats?.points || 0}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Rebounds</span>
                  <span className="font-bold text-sky-400">{player.basketballStats?.rebounds || 0}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Assists</span>
                  <span className="font-bold text-emerald-400">{player.basketballStats?.assists || 0}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-400">Steals</span>
                  <span className="font-bold text-white">{player.basketballStats?.steals || 0}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetail;
