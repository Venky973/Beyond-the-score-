import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-5xl font-black text-white font-display uppercase tracking-wide">
          Contact Operations & Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Need assistance verifying your turf listing, reporting a scorecard dispute, or organizing a large-scale league?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact info cards */}
        <div className="space-y-4">
          <div className="bg-slate-850 p-5 rounded-2xl border border-slate-750 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/30">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Direct Support Email</h4>
              <p className="text-xs text-slate-400 mt-0.5">operations@beyondthescore.com</p>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-1">24/7 Response SLA</span>
            </div>
          </div>

          <div className="bg-slate-850 p-5 rounded-2xl border border-slate-750 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Turf Verification Hotline</h4>
              <p className="text-xs text-slate-400 mt-0.5">+1 (800) 555-TURF (8873)</p>
              <span className="text-[10px] text-slate-400 block mt-1">Mon - Sun: 08:00 - 22:00</span>
            </div>
          </div>

          <div className="bg-slate-850 p-5 rounded-2xl border border-slate-750 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/30">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Headquarters</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Beyond The Score Sports Labs, Tech Center Boulevard
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-slate-850 p-6 rounded-2xl border border-slate-750 shadow-xl">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Message Dispatched</h3>
              <p className="text-xs text-slate-300">
                Thank you for contacting Beyond The Score. Our support desk will reply within 4 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Alex Morgan"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Inquiry Type</label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white">
                  <option>Turf Facility Registration & Verification</option>
                  <option>Tournament Organizing Inquiries</option>
                  <option>Dispute or Scorecard Content Flag</option>
                  <option>General Support</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Message</label>
                <textarea
                  required
                  rows={3}
                  placeholder="How can our operations team help you?"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" /> Submit Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
