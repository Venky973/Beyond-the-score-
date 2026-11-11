import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Search,
  SlidersHorizontal,
  Compass,
  ArrowUpDown,
  Filter,
  Check,
  Loader2,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import TurfCard from '../../components/turf/TurfCard';

const TurfDiscovery = () => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCoords, setUserCoords] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [sport, setSport] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');
  const [facility, setFacility] = useState('all');
  const [sort, setSort] = useState('recommended');
  const [radius, setRadius] = useState('50');

  // Request browser geolocation
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setLocationStatus('Locating your coordinates...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setLocating(false);
        setLocationStatus('GPS Coordinates Detected');
        setSort('nearest');
      },
      (err) => {
        setLocating(false);
        setLocationStatus('Location access declined. Using manual search.');
      },
      { timeout: 10000 }
    );
  };

  const fetchTurfs = async () => {
    setLoading(true);
    try {
      let url = `/turfs?sort=${sort}`;
      if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;
      if (sport !== 'all') url += `&sport=${sport}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;
      if (facility !== 'all') url += `&facility=${facility}`;

      if (userCoords) {
        url += `&lat=${userCoords.lat}&lng=${userCoords.lng}&radius=${radius}`;
      }

      const res = await api.get(url);
      if (res.data.success) {
        setTurfs(res.data.turfs);
      }
    } catch (err) {
      console.error('Failed to load turfs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurfs();
  }, [sport, sort, userCoords, radius]);

  const sportsList = ['all', 'Football', 'Cricket', 'Badminton', 'Tennis', 'Basketball'];
  const facilitiesList = [
    'all',
    'Floodlights',
    'Changing Rooms',
    'Covered Seating',
    'Free Parking',
    'Equipment Rental',
    'Cafeteria'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            Sports Facilities & Arenas
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-wide uppercase">
            Discover Nearby Turfs & Pitches
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Find certified sports turfs with verified synthetic grass, floodlights, and live hourly slot bookings.
          </p>
        </div>

        {/* Browser Geolocation Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <button
            onClick={handleDetectLocation}
            disabled={locating}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-md shadow-emerald-600/20"
          >
            {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Compass className="w-4 h-4" />}
            <span>Detect My Current Location</span>
          </button>
          {locationStatus && (
            <span className="text-[11px] text-slate-400 font-medium">{locationStatus}</span>
          )}
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-slate-850 p-5 rounded-xl border border-slate-750 space-y-4">
        {/* Row 1: Search, Max Price, Radius, Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Search by Name or City
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchTurfs()}
                placeholder="e.g. KickOff Arena, Metropolis"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Max Price / Hour ($)
            </label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Any price"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Sort By
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="recommended">Recommended & Rating</option>
              <option value="nearest">Nearest Distance (GPS)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Recently Registered</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Distance Radius (if located)
            </label>
            <select
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="10">Within 10 km</option>
              <option value="25">Within 25 km</option>
              <option value="50">Within 50 km</option>
              <option value="100">Within 100 km</option>
            </select>
          </div>
        </div>

        {/* Row 2: Sports Pills & Facilities */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-800">
          {/* Sports Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] text-slate-400 mr-1 flex-shrink-0">Sport:</span>
            {sportsList.map((sp) => (
              <button
                key={sp}
                onClick={() => setSport(sp)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  sport === sp
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {sp === 'all' ? 'All Sports' : sp}
              </button>
            ))}
          </div>

          <button
            onClick={fetchTurfs}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs transition border border-emerald-500/30 flex items-center justify-center gap-1.5 self-end sm:self-auto"
          >
            <Filter className="w-3.5 h-3.5" /> Apply Filters
          </button>
        </div>
      </div>

      {/* Turfs Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          <Loader2 className="w-6 h-6 text-emerald-500 animate-spin mx-auto mb-2" />
          Locating nearby turfs and verified facilities...
        </div>
      ) : turfs.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-xs space-y-2">
          <MapPin className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="font-semibold text-slate-300">No verified turfs found matching this criteria.</p>
          <p>Try broadening your distance radius or clearing specific filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {turfs.map((turf) => (
            <TurfCard key={turf._id} turf={turf} userCoords={userCoords} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TurfDiscovery;
