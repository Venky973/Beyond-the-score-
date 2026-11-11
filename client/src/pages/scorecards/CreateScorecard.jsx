import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import DynamicScorecardForm from '../../components/scorecard/DynamicScorecardForm';

const CreateScorecard = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <Link
            to="/scorecards"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition mb-2"
          >
            <ChevronLeft className="w-4 h-4" /> Scorecard Hub
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-wide">
            Create Custom Match Scorecard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build dynamic scorecards for matches that aren't officially covered by broadcasters.
          </p>
        </div>
      </div>

      <DynamicScorecardForm />
    </div>
  );
};

export default CreateScorecard;
