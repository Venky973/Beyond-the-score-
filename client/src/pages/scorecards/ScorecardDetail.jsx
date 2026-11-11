import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FileSpreadsheet,
  Share2,
  Calendar,
  MapPin,
  Clock,
  Trophy,
  ChevronLeft,
  Edit,
  Trash2,
  Check,
  Globe,
  Lock,
  EyeOff,
  Loader2
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ScorecardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [scorecard, setScorecard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchScorecard = async () => {
      try {
        // If length is typical Mongo ObjectId or shareCode
        let res;
        if (id.length === 24) {
          res = await api.get(`/scorecards/${id}`);
        } else {
          res = await api.get(`/scorecards/share/${id}`);
        }

        if (res.data.success) {
          setScorecard(res.data.scorecard);
        }
      } catch (err) {
        console.error('Scorecard load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchScorecard();
  }, [id]);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/scorecards/share/${scorecard.shareCode}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this custom scorecard?')) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/scorecards/${scorecard._id}`);
      if (res.data.success) {
        navigate('/scorecards');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete scorecard.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400 text-xs">
        <Loader2 className="w-6 h-6 text-orange-500 animate-spin mx-auto mb-2" />
        Loading scorecard...
      </div>
    );
  }

  if (!scorecard) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-3">
        <h2 className="text-xl font-bold text-white">Scorecard Not Found</h2>
        <p className="text-slate-400 text-xs">This match scorecard may be private or deleted.</p>
        <Link to="/scorecards" className="text-orange-400 text-xs hover:underline inline-block">
          Return to Scorecard Hub
        </Link>
      </div>
    );
  }

  const isOwner = user && (scorecard.creator?._id === user._id || scorecard.creator === user._id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation & Controls */}
      <div className="flex items-center justify-between">
        <Link
          to="/scorecards"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ChevronLeft className="w-4 h-4" /> All Scorecards
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-orange-600/20"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Share Link Copied!' : 'Share Scorecard'}</span>
          </button>

          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs transition"
              title="Delete Scorecard"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Scorecard Presentation Card */}
      <div className="bg-sports-dark border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 text-xs text-slate-400 gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
              {scorecard.sport}
            </span>
            <span className="text-white capitalize">{scorecard.matchType.replace('_', ' ')}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
              {scorecard.visibility === 'public' && <Globe className="w-3.5 h-3.5 text-emerald-400" />}
              {scorecard.visibility === 'unlisted' && <EyeOff className="w-3.5 h-3.5 text-amber-400" />}
              {scorecard.visibility === 'private' && <Lock className="w-3.5 h-3.5 text-red-400" />}
              <span className="capitalize">{scorecard.visibility}</span>
            </span>
            <span className="text-slate-500 font-mono text-[11px]">
              Share Code: <b className="text-slate-300">{scorecard.shareCode}</b>
            </span>
          </div>
        </div>

        {/* Title & Metadata */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">{scorecard.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {new Date(scorecard.matchDate).toLocaleDateString([], {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
            {scorecard.venue && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {scorecard.venue}
              </span>
            )}
            {scorecard.duration && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {scorecard.duration}
              </span>
            )}
          </div>
        </div>

        {/* Scores Comparison Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
          <div className="sm:border-r border-slate-800 sm:pr-6 space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              {scorecard.teamA.name}
            </span>
            <div className="font-mono text-3xl sm:text-4xl font-extrabold text-orange-400">
              {scorecard.teamA.scoreDisplay}
            </div>
          </div>

          <div className="sm:pl-6 space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              {scorecard.teamB.name}
            </span>
            <div className="font-mono text-3xl sm:text-4xl font-extrabold text-sky-400">
              {scorecard.teamB.scoreDisplay}
            </div>
          </div>
        </div>

        {/* Result Callout */}
        {scorecard.result?.margin && (
          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-center">
            <span className="text-sm font-bold text-emerald-400 block">{scorecard.result.margin}</span>
            {scorecard.result.summary && (
              <span className="text-xs text-slate-300 mt-1 block">{scorecard.result.summary}</span>
            )}
          </div>
        )}

        {/* Rosters & Performances Side-by-Side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Team A Players */}
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-750">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 border-b border-slate-800 pb-2">
              {scorecard.teamA.name} Lineup
            </h4>
            {scorecard.teamA.players?.length === 0 ? (
              <span className="text-xs text-slate-500">No players listed</span>
            ) : (
              <div className="space-y-2 text-xs">
                {scorecard.teamA.players.map((p, idx) => (
                  <div key={idx} className="flex justify-between py-1 border-b border-slate-800/40">
                    <span className="font-semibold text-white">{p.name}</span>
                    <span className="text-slate-400">{p.role}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Team B Players */}
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-750">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 border-b border-slate-800 pb-2">
              {scorecard.teamB.name} Lineup
            </h4>
            {scorecard.teamB.players?.length === 0 ? (
              <span className="text-xs text-slate-500">No players listed</span>
            ) : (
              <div className="space-y-2 text-xs">
                {scorecard.teamB.players.map((p, idx) => (
                  <div key={idx} className="flex justify-between py-1 border-b border-slate-800/40">
                    <span className="font-semibold text-white">{p.name}</span>
                    <span className="text-slate-400">{p.role}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Match Notes */}
        {scorecard.notes && (
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-750">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Match Notes & Remarks
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">{scorecard.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScorecardDetail;
