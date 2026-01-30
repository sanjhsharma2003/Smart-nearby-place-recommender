import { useState, useEffect, useCallback } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import MoodSelector from './components/MoodSelector';
import FilterBar from './components/FilterBar';
import PlaceCard from './components/PlaceCard';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

const libraries = ['places'];

function App() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [sortBy, setSortBy] = useState('rating');
  const [filterOpen, setFilterOpen] = useState(false);

  // Load Google Maps Script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, []);

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }, []);

  // Fetch places based on mood
  const fetchPlaces = useCallback(
    (mood) => {
      if (!isLoaded || !userLocation) return;

      setLoading(true);
      setError(null);

      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );

      const request = {
        location: userLocation,
        radius: 5000, // 5km radius
        type: mood.keywords,
        openNow: filterOpen,
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          // Add distance to each place
          const placesWithDistance = results.map((place) => ({
            ...place,
            distance: calculateDistance(
              userLocation.lat,
              userLocation.lng,
              place.geometry.location.lat(),
              place.geometry.location.lng()
            ),
          }));
          setPlaces(placesWithDistance);
        } else {
          setError('No places found. Try a different mood or location.');
          setPlaces([]);
        }
        setLoading(false);
      });
    },
    [isLoaded, userLocation, filterOpen, calculateDistance]
  );

  // Handle mood selection
  const handleMoodSelect = (mood) => {
    setSelectedMood(mood.id);
    fetchPlaces(mood);
  };

  // Sort places
  const sortedPlaces = [...places].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'distance':
        return a.distance - b.distance;
      case 'reviews':
        return (b.user_ratings_total || 0) - (a.user_ratings_total || 0);
      default:
        return 0;
    }
  });

  // Re-fetch when filter changes
  useEffect(() => {
    if (selectedMood && userLocation) {
      const mood = {
        id: selectedMood,
        keywords: getMoodKeywords(selectedMood),
      };
      fetchPlaces(mood);
    }
  }, [filterOpen]);

  // Helper to get mood keywords
  const getMoodKeywords = (moodId) => {
    const moodMap = {
      work: ['cafe', 'coffee_shop', 'library', 'coworking_space'],
      date: ['restaurant', 'bar', 'park', 'movie_theater'],
      'quick-bite': ['fast_food', 'meal_takeaway', 'food'],
      budget: ['restaurant', 'cafe', 'food', 'meal_delivery'],
    };
    return moodMap[moodId] || [];
  };

  if (loadError) {
    return (
      <div className="app">
        <div className="error-container">
          <h2>Error loading maps</h2>
          <p>Please check your API key and try again.</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="app">
        <LoadingSpinner message="Loading Google Maps..." />
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="app-header">
          <h1 className="app-title">
            <span className="title-icon">📍</span>
            Smart Nearby Places
          </h1>
          <p className="app-subtitle">
            Discover the perfect spot for every mood
          </p>
        </header>

        {/* Mood Selector */}
        <MoodSelector
          selectedMood={selectedMood}
          onMoodSelect={handleMoodSelect}
        />

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Results Section */}
        {!loading && places.length > 0 && (
          <div className="results-section">
            <div className="results-header">
              <h2 className="results-title">
                Found {places.length} amazing places
              </h2>
            </div>

            {/* Filter Bar */}
            <FilterBar
              sortBy={sortBy}
              onSortChange={setSortBy}
              filterOpen={filterOpen}
              onFilterChange={setFilterOpen}
            />

            {/* Places Grid */}
            <div className="places-grid">
              {sortedPlaces.map((place, index) => (
                <PlaceCard key={place.place_id} place={place} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && selectedMood && places.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No places found</h3>
            <p>Try selecting a different mood or adjusting your filters</p>
          </div>
        )}

        {/* Footer */}
        <footer className="app-footer">
          <p>Powered by Google Maps & Places API</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
