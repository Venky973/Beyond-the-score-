import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, ChevronLeft, Plus, Check, Loader2, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const RegisterTurf = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [rentalPricePerHour, setRentalPricePerHour] = useState('');
  const [openTime, setOpenTime] = useState('06:00');
  const [closeTime, setCloseTime] = useState('23:00');
  const [description, setDescription] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [selectedSports, setSelectedSports] = useState(['Football', 'Cricket']);
  const [selectedFacilities, setSelectedFacilities] = useState([
    'Floodlights',
    'Changing Rooms',
    'Free Parking',
    'Mineral Water'
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const sportsOptions = ['Football', 'Cricket', 'Basketball', 'Tennis', 'Badminton', 'Volleyball'];
  const facilitiesOptions = [
    'Floodlights',
    'Changing Rooms',
    'Showers',
    'Covered Seating',
    'Free Parking',
    'Mineral Water',
    'Equipment Rental',
    'Locker Facility',
    'Cafeteria',
    'First Aid Station'
  ];

  const toggleSport = (sp) => {
    if (selectedSports.includes(sp)) setSelectedSports(selectedSports.filter((s) => s !== sp));
    else setSelectedSports([...selectedSports, sp]);
  };

  const toggleFacility = (fac) => {
    if (selectedFacilities.includes(fac)) setSelectedFacilities(selectedFacilities.filter((f) => f !== fac));
    else setSelectedFacilities([...selectedFacilities, fac]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !city.trim() || !rentalPricePerHour) {
      setErrorMsg('Turf name, address, city, and rental price per hour are required.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await api.post('/turfs', {
        name,
        address,
        city,
        state,
        zipCode,
        latitude: latitude || undefined,
        longitude: longitude || undefined,
        rentalPricePerHour: Number(rentalPricePerHour),
        supportedSports: selectedSports,
        facilities: selectedFacilities,
        operatingHours: {
          open: openTime,
          close: closeTime,
          daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        description,
        contactPhone,
        contactEmail,
        images: imageUrl ? [imageUrl] : []
      });

      if (res.data.success) {
        navigate('/operator/dashboard');
      }
    } catch (err) {
      console.error('Register turf error:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to register facility.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <Link
          to="/operator/dashboard"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition mb-2"
        >
          <ChevronLeft className="w-4 h-4" /> Operator Dashboard
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-wide">
          Register New Sports Facility
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Add your sports ground, synthetic turf, or indoor arena to the Beyond The Score network.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Facility Info */}
        <div className="bg-slate-850 p-6 rounded-2xl border border-slate-750 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
            Facility Profile & Location
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Turf Arena Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apex Sports Arena & Turf"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Physical Street Address *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Plot 14, Main Bypass Road"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">City *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Metropolis"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">State / Province</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. NY"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Latitude (optional)</label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="e.g. 40.7128"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Longitude (optional)</label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="e.g. -74.0060"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Operating Hours */}
        <div className="bg-slate-850 p-6 rounded-2xl border border-slate-750 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
            Pricing & Operating Hours
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Rental Price Per Hour ($) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={rentalPricePerHour}
                onChange={(e) => setRentalPricePerHour(e.target.value)}
                placeholder="e.g. 50"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Opening Hour</label>
              <input
                type="time"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Closing Hour</label>
              <input
                type="time"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Supported Sports & Facilities */}
        <div className="bg-slate-850 p-6 rounded-2xl border border-slate-750 space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
            Supported Sports & Amenities
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Supported Sports</label>
            <div className="flex flex-wrap gap-2">
              {sportsOptions.map((sp) => {
                const isSelected = selectedSports.includes(sp);
                return (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => toggleSport(sp)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      isSelected
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {sp}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Available Amenities
            </label>
            <div className="flex flex-wrap gap-2">
              {facilitiesOptions.map((fac) => {
                const isSelected = selectedFacilities.includes(fac);
                return (
                  <button
                    key={fac}
                    type="button"
                    onClick={() => toggleFacility(fac)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      isSelected
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {fac}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Facility Image URL
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Turf Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Highlight turf pitch dimensions, lighting lux standards, and booking policies..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/operator/dashboard')}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-emerald-600/30"
          >
            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Register Turf Facility
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterTurf;
