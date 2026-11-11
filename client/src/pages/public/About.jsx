import React from 'react';
import { Trophy, Shield, Activity, MapPin, Users, CheckCircle2 } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-950/40 border border-orange-500/30 px-3 py-1 rounded-full inline-block">
          Platform Architecture & Mission
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-display uppercase tracking-wide">
          About Beyond The Score
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Beyond The Score was engineered to unify live sports scores, athlete analytics,
          grassroots custom match recording, and location-based sports facility reservations into one
          seamless ecosystem.
        </p>
      </div>

      <div className="bg-slate-850 p-8 rounded-2xl border border-slate-750 space-y-6 shadow-xl">
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">
          The Problem We Solve
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Amateur and professional sports enthusiasts face fragmented tools: live scores live on
          commercial sports media apps, booking a turf requires WhatsApp groups or phone calls with
          manual availability checks, and weekend friendly matches or corporate tournaments are
          recorded on scattered spreadsheets or lost paper slips.
        </p>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          <b>Beyond The Score</b> bridges these gaps. It provides real-time ball-by-ball scoreboards
          for major sports, allows organizers to broadcast match progressions, connects turf operators
          directly with players using browser GPS detection, and lets anyone generate shareable custom
          scorecards in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-2">
          <Activity className="w-6 h-6 text-orange-400 mb-2" />
          <h3 className="font-bold text-white text-base">Real-Time Sync</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Socket.IO broadcasts score adjustments with sub-100 millisecond latency to all connected fans.
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-2">
          <MapPin className="w-6 h-6 text-emerald-400 mb-2" />
          <h3 className="font-bold text-white text-base">Conflict-Free Bookings</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Atomic overlap detection ensures no two players ever reserve the same sports slot twice.
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-2">
          <Users className="w-6 h-6 text-sky-400 mb-2" />
          <h3 className="font-bold text-white text-base">Deep Athlete Analytics</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Sport-specific performance breakdowns and strict same-sport comparison matrices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
