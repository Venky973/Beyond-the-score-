import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Trophy,
  ArrowRight,
  ChevronLeft,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Swords
} from 'lucide-react';
import api from '../../services/api';

const PlayerComparison = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialP1 = searchParams.get('player1Id') || '';
  const initialP2 = searchParams.get('player2Id') || '';

  const [allPlayers, setAllPlayers] = useState([]);
  const [selectedP1, setSelectedP1] = useState(initialP1);
  const [selectedP2, setSelectedP2] = useState(initialP2);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch all players for dropdown
  useEffect(() => {
    const fetchPlayerList = async () => {
      try {
        const res = await api.get('/players?limit=50');
        if (res.data.success) {
          setAllPlayers(res.data.players);

          // If no initial params, default to first two players with matching sport if possible
          if (!initialP1 && res.data.players.length >= 2) {
            setSelectedP1(res.data.players[0]._id);
            // find another of same sport
            const sameSportPeer = res.data.players.find(
              (p, i) => i > 0 && p.sport === res.data.players[0].sport
            );
            if (sameSportPeer) setSelectedP2(sameSportPeer._id);
            else setSelectedP2(res.data.players[1]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load players list:', err);
      }
    };

    fetchPlayerList();
  }, []);

  // Trigger comparison when both selected
  const runComparison = async () => {
    if (!selectedP1 || !selectedP2) return;
    if (selectedP1 === selectedP2) {
      setErrorMsg('Please select two distinct athletes to compare.');
      setComparisonData(null);
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.get(`/players/compare?player1Id=${selectedP1}&player2Id=${selectedP2}`);
      if (res.data.success) {
        setComparisonData(res.data);
      }
    } catch (err) {
      console.error('Comparison error:', err);
      setErrorMsg(err.response?.data?.message || 'Comparison failed.');
      setComparisonData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedP1 && selectedP2 && selectedP1 !== selectedP2) {
      runComparison();
    }
  }, [selectedP1, selectedP2]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/players"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ChevronLeft className="w-4 h-4" /> Athlete Directory
        </Link>
      </div>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mx-auto text-orange-400">
          <Swords className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-black text-white font-display uppercase tracking-wide">
          Head-to-Head Athlete Comparison
        </h1>
        <p className="text-xs text-slate-400">
          Strict same-sport comparative metrics engine. Contrast batting averages, goals, assists,
          and career forms.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="bg-slate-850 p-5 rounded-2xl border border-slate-750 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Player 1 Dropdown */}
        <div>
          <label className="block text-xs font-bold text-orange-400 uppercase tracking-wider mb-1.5">
            Select Athlete 1
          </label>
          <select
            value={selectedP1}
            onChange={(e) => setSelectedP1(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-orange-500 font-medium"
          >
            <option value="">-- Choose Athlete --</option>
            {allPlayers.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.sport.toUpperCase()} - {p.teamName || 'Independent'})
              </option>
            ))}
          </select>
        </div>

        {/* Player 2 Dropdown */}
        <div>
          <label className="block text-xs font-bold text-sky-400 uppercase tracking-wider mb-1.5">
            Select Athlete 2
          </label>
          <select
            value={selectedP2}
            onChange={(e) => setSelectedP2(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-sky-500 font-medium"
          >
            <option value="">-- Choose Athlete --</option>
            {allPlayers.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.sport.toUpperCase()} - {p.teamName || 'Independent'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading && (
        <div className="py-16 text-center text-slate-400 text-xs">
          <Loader2 className="w-6 h-6 text-orange-500 animate-spin mx-auto mb-2" />
          Comparing career performance records...
        </div>
      )}

      {/* Comparison Results Area */}
      {comparisonData && !loading && (
        <div className="space-y-6 animate-in fade-in">
          {/* Athlete Profile Cards Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Athlete 1 */}
            <div className="bg-sports-dark border-2 border-orange-500/40 rounded-2xl p-6 shadow-xl flex items-center gap-5">
              <img
                src={
                  comparisonData.player1.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                }
                alt={comparisonData.player1.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-700 shadow-md"
              />
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-950/40 border border-orange-500/30 px-2 py-0.5 rounded">
                  {comparisonData.player1.sport}
                </span>
                <h3 className="text-xl font-bold text-white mt-1 truncate">
                  {comparisonData.player1.name}
                </h3>
                <p className="text-xs text-slate-400 truncate">
                  {comparisonData.player1.position} • {comparisonData.player1.teamName || 'Independent'}
                </p>
                <div className="text-xs font-semibold text-emerald-400 mt-1">
                  {comparisonData.player1.wins} Wins / {comparisonData.player1.matchesPlayed} Matches
                </div>
              </div>
            </div>

            {/* Athlete 2 */}
            <div className="bg-sports-dark border-2 border-sky-500/40 rounded-2xl p-6 shadow-xl flex items-center gap-5">
              <img
                src={
                  comparisonData.player2.avatar ||
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
                }
                alt={comparisonData.player2.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-700 shadow-md"
              />
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-950/40 border border-sky-500/30 px-2 py-0.5 rounded">
                  {comparisonData.player2.sport}
                </span>
                <h3 className="text-xl font-bold text-white mt-1 truncate">
                  {comparisonData.player2.name}
                </h3>
                <p className="text-xs text-slate-400 truncate">
                  {comparisonData.player2.position} • {comparisonData.player2.teamName || 'Independent'}
                </p>
                <div className="text-xs font-semibold text-emerald-400 mt-1">
                  {comparisonData.player2.wins} Wins / {comparisonData.player2.matchesPlayed} Matches
                </div>
              </div>
            </div>
          </div>

          {/* Metric Matrix Table */}
          <div className="bg-slate-850 rounded-2xl border border-slate-750 overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Detailed Metrics Matrix ({comparisonData.sport.toUpperCase()})
              </span>
              <span className="text-[11px] text-slate-400">Green highlight indicates category leader</span>
            </div>

            <div className="divide-y divide-slate-800 text-xs">
              {comparisonData.metrics.map((m, idx) => {
                const p1Val = Number(m.p1 || 0);
                const p2Val = Number(m.p2 || 0);
                const isLowerBetter = m.lowerIsBetter;

                const p1Wins = isLowerBetter ? p1Val < p2Val : p1Val > p2Val;
                const p2Wins = isLowerBetter ? p2Val < p1Val : p2Val > p1Val;

                return (
                  <div key={idx} className="grid grid-cols-7 py-3 px-4 items-center hover:bg-slate-800/40">
                    {/* Player 1 Score */}
                    <div className="col-span-2 text-right pr-4 font-mono font-bold text-sm">
                      <span
                        className={
                          p1Wins
                            ? 'text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30'
                            : 'text-slate-300'
                        }
                      >
                        {m.p1}
                      </span>
                    </div>

                    {/* Metric Label */}
                    <div className="col-span-3 text-center font-semibold text-slate-200">
                      {m.label}
                    </div>

                    {/* Player 2 Score */}
                    <div className="col-span-2 text-left pl-4 font-mono font-bold text-sm">
                      <span
                        className={
                          p2Wins
                            ? 'text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30'
                            : 'text-slate-300'
                        }
                      >
                        {m.p2}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerComparison;
