import { useState, useEffect } from 'react';
import './Home.css';

const Home = ({ onExploreMore, initialPlaces, activeVibe }) => {
    const [topPlaces, setTopPlaces] = useState(initialPlaces || []);
    const [loading, setLoading] = useState(!initialPlaces?.length);
    const [userLocation, setUserLocation] = useState(null);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState(activeVibe?.id || 'dining');
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [restaurantDetails, setRestaurantDetails] = useState(null);
    const [userMood, setUserMood] = useState('😊');
    const [weather, setWeather] = useState(null);
    const [surpriseMode, setSurpriseMode] = useState(false);
    const [locationName, setLocationName] = useState('Detecting location...');
    const [isSearchingLocation, setIsSearchingLocation] = useState(false);
    const [searchCity, setSearchCity] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showHiddenGems, setShowHiddenGems] = useState(false);
    const [showMenuNavigator, setShowMenuNavigator] = useState(false);

    const moods = [
        { emoji: '✨', label: 'Euphoric', vibe: 'energetic', icon: '/assets/icons/euphoric.png' },
        { emoji: '🌿', label: 'Zen', vibe: 'calm', icon: '/assets/icons/zen.png' },
        { emoji: '🎯', label: 'Focused', vibe: 'work', icon: '/assets/icons/work.png' },
        { emoji: '🌹', label: 'Romantic', vibe: 'date', icon: '/assets/icons/romantic.png' },
        { emoji: '🕶️', label: 'Solo', vibe: 'solo', icon: '/assets/icons/solo.png' },
        { emoji: '🔥', label: 'Party', vibe: 'party', icon: '/assets/icons/party.png' }
    ];

    // Map categories to API Vibes
    const categoryToVibe = {
        delivery: 'quick-bite',
        dining: 'date',
        nightlife: 'night_club',
        work: 'work',
        calm: 'calm',
        solo: 'solo',
        party: 'party'
    };

    useEffect(() => {
        // Only fetch on category change, NOT on every keystroke of the search bar
        if (initialPlaces && initialPlaces.length > 0 && activeCategory === activeVibe?.id) {
            setTopPlaces(initialPlaces);
            setLoading(false);
        } else {
            fetchPlaces(null, ''); // Fetch default category results
        }
    }, [activeCategory]);

    const fetchPlaces = (manualLocation = null, query = '') => {
        setLoading(true);
        setError(null);

        const fetchData = async (lat, lng, name = null) => {
            try {
                // Reverse geocode via backend if name is not provided
                if (!name) {
                    const geoRes = await fetch(`${import.meta.env.VITE_API_URL}/api/places/reverse-geocode?lat=${lat}&lng=${lng}`);
                    const geoData = await geoRes.json();
                    if (geoData.success) {
                        setLocationName(geoData.city);
                    } else {
                        setLocationName('Your Location');
                    }
                } else {
                    setLocationName(name);
                }

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/places/nearby`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        latitude: lat,
                        longitude: lng,
                        vibe: categoryToVibe[activeCategory] || activeCategory || 'dining',
                        searchQuery: query || searchQuery,
                        radius: 10000
                    })
                });

                const data = await response.json();
                if (data.success) {
                    setTopPlaces(data.places);
                    setWeather(data.weather);
                } else {
                    setError('No restaurants found for this vibe.');
                }
            } catch (err) {
                setError('Error connecting to server');
            } finally {
                setLoading(false);
            }
        };

        if (manualLocation) {
            fetchData(manualLocation.latitude, manualLocation.longitude, manualLocation.name);
        } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchData(position.coords.latitude, position.coords.longitude);
                },
                (err) => {
                    setError('Please enable location access or search manually');
                    setLoading(false);
                }
            );
        } else {
            setError('Search manually for your city');
            setLoading(false);
        }
    };

    const handleGlobalSearch = (e) => {
        if (e.key === 'Enter') {
            fetchPlaces(null, searchQuery);
        }
    };

    const handleCitySearch = async (e) => {
        if (e.key === 'Enter' && searchCity.trim()) {
            setIsSearchingLocation(false);
            setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/places/geocode?city=${encodeURIComponent(searchCity)}`);
                const data = await res.json();
                if (data.success) {
                    fetchPlaces({ latitude: data.latitude, longitude: data.longitude, name: data.address.split(',')[0] });
                } else {
                    alert('City not found in India');
                    setLoading(false);
                }
            } catch (err) {
                alert('Search failed');
                setLoading(false);
            }
        }
    };

    const fetchRestaurantDetails = async (placeId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/places/details/${placeId}`);
            const data = await response.json();
            if (data.success) {
                setRestaurantDetails(data.place);
            }
        } catch (err) {
            console.error('Error fetching details:', err);
        }
    };

    const handleRestaurantClick = (place) => {
        setSelectedRestaurant(place);
        fetchRestaurantDetails(place.id);
    };

    const getPhotoUrl = (photoReference) => {
        return `${import.meta.env.VITE_API_URL}/api/places/photo/${photoReference}?maxwidth=1000`;
    };

    const savePlace = (place) => {
        const saved = JSON.parse(localStorage.getItem('savedPlaces') || '[]');
        const exists = saved.find(p => p.id === place.id);

        if (!exists) {
            saved.push(place);
            localStorage.setItem('savedPlaces', JSON.stringify(saved));
        } else {
            const updated = saved.filter(p => p.id !== place.id);
            localStorage.setItem('savedPlaces', JSON.stringify(updated));
        }
        window.dispatchEvent(new Event('storage'));
    };

    const isSaved = (placeId) => {
        const saved = JSON.parse(localStorage.getItem('savedPlaces') || '[]');
        return !!saved.find(p => p.id === placeId);
    };

    const getMenuHighlights = (details) => {
        if (!details || !details.reviews) return [];
        const commonIngredients = ['chicken', 'paneer', 'pizza', 'burger', 'pasta', 'dal', 'biryani', 'coffee', 'tea', 'cake', 'muffin', 'cocktail', 'kebab', 'roti', 'naan', 'fish', 'salad'];
        const dishes = new Set();
        details.reviews.forEach(review => {
            const text = review.text.toLowerCase();
            commonIngredients.forEach(item => {
                if (text.includes(item)) {
                    const words = text.split(' ');
                    const index = words.indexOf(item);
                    if (index !== -1) {
                        const dish = (index > 0 ? words[index - 1] + ' ' : '') + item;
                        if (dish.length > 3) dishes.add(dish.charAt(0).toUpperCase() + dish.slice(1));
                    }
                }
            });
        });
        return Array.from(dishes).slice(0, 6);
    };

    const handleSurprise = () => {
        setSurpriseMode(true);
        setTimeout(() => {
            const random = topPlaces[Math.floor(Math.random() * topPlaces.length)];
            setSelectedRestaurant(random);
            setSurpriseMode(false);
        }, 1500);
    };

    if (selectedRestaurant) {
        const highlights = restaurantDetails ? getMenuHighlights(restaurantDetails) : [];
        const menuPhotos = restaurantDetails?.photos?.slice(0, 5) || [];

        return (
            <div className="restaurant-detail-view fade-in">
                <div className="detail-header">
                    <button className="back-btn-round" onClick={() => { setSelectedRestaurant(null); setRestaurantDetails(null); }}>
                        <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </button>
                    <img
                        src={selectedRestaurant.photos?.length ? getPhotoUrl(selectedRestaurant.photos[0].reference) : 'https://b.zmtcdn.com/data/pictures/chains/8/301718/4e90797fe92661570d51fa30a4734ed9.jpg'}
                        className="detail-hero-img"
                        alt={selectedRestaurant.name}
                    />
                </div>
                <div className="detail-content container">
                    {/* ADVANCED METRIC: Safety & Vibe Match */}
                    <div className="meta-stats-row">
                        <div className="vibe-match-badge-large">
                            {selectedRestaurant.vibeMatch}% Vibe Match
                        </div>
                        <div className="safety-score-badge">
                            🛡️ {selectedRestaurant.safety?.score || '9.0'} Safety Score
                        </div>
                    </div>

                    <div className="detail-info-row">
                        <div>
                            <h1 className="detail-name">{selectedRestaurant.name}</h1>
                            <p className="detail-types">{selectedRestaurant.types?.filter(t => t !== 'point_of_interest' && t !== 'establishment').slice(0, 3).join(' • ')}</p>
                        </div>
                        <div className="res-rating large">
                            <span>{selectedRestaurant.rating || 'New'}</span>
                            <svg viewBox="0 0 20 20" fill="currentColor" className="star-icon"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        </div>
                    </div>

                    {/* AI Explanation Box */}
                    <div className="ai-explanation-box mt-md">
                        <div className="ai-icon">✨</div>
                        <p className="ai-text"><b>Superior Choice:</b> {selectedRestaurant.aiExplanation}</p>
                    </div>

                    {/* ADVANCED FEATURE: AMBIENCE & POWER CHECK */}
                    <div className="intelligence-grid mt-lg">
                        <div className="intel-card pulse anim-pulse">
                            <span className="intel-label">Live Pulse</span>
                            <span className="intel-value">{selectedRestaurant.pulse || 'Lively Atmosphere'}</span>
                            <span className="intel-sub">Trending Now 🔥</span>
                        </div>

                        <div className="intel-card aesthetic">
                            <span className="intel-label">Aesthetic Score</span>
                            <span className="intel-value">📸 {selectedRestaurant.aestheticScore}/10</span>
                            <span className="intel-sub">Perfect for the Gram</span>
                        </div>

                        <div className="intel-card parking">
                            <span className="intel-label">Parking Intel</span>
                            <span className="intel-value">🚗 {selectedRestaurant.parking?.status}</span>
                            <span className="intel-sub">Nearest: {selectedRestaurant.parking?.nearestLot}</span>
                        </div>

                        <div className="intel-card pets">
                            <span className="intel-label">Pet Friendly</span>
                            <span className="intel-value">🐶 {selectedRestaurant.petFriendly?.score}/10</span>
                            <span className="intel-sub">{selectedRestaurant.petFriendly?.amenities}</span>
                        </div>

                        <div className="intel-card productivity">
                            <span className="intel-label">Deep Work Window</span>
                            <span className="intel-value">🕒 {selectedRestaurant.productivity?.bestWindow}</span>
                            <span className="intel-sub">WiFi: {selectedRestaurant.productivity?.wifiSpeed}</span>
                        </div>

                        <div className="intel-card secret-menu">
                            <span className="intel-label">Secret Menu Unlocked</span>
                            <span className="intel-value">🤫 {selectedRestaurant.secretMenu}</span>
                            <span className="intel-sub">Ask the server discreetly</span>
                        </div>
                    </div>

                    <div className="official-actions mt-lg">
                        <button className="z-btn-primary" onClick={() => setShowMenuNavigator(true)}>
                            AI Menu Navigator 🤖
                        </button>
                        <button className="z-btn-secondary" onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(selectedRestaurant.name)}`, '_blank')}>
                            Open in Maps
                        </button>
                    </div>

                    {showMenuNavigator && (
                        <div className="ai-navigator-modal fade-in">
                            <div className="navigator-content">
                                <button className="close-navigator" onClick={() => setShowMenuNavigator(false)}>×</button>
                                <h2>AI Menu Navigator 🤖</h2>
                                <div className="chat-demo">
                                    <p className="chat-bot">"I've scanned the menu. Since you like spicy food, I recommend the <b>{selectedRestaurant.secretMenu}</b>!"</p>
                                    <div className="chat-input-row">
                                        <input type="text" placeholder="Is the pasta handmade?" disabled />
                                        <button disabled>Ask</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="menu-section mt-xl">
                        <h2 className="menu-title">Ambience & Food Gallery</h2>
                        <div className="real-menu-gallery">
                            {menuPhotos.length > 0 ? (
                                menuPhotos.map((photo, i) => (
                                    <div key={i} className="menu-photo-item">
                                        <img src={getPhotoUrl(photo.photo_reference)} alt="menu" />
                                    </div>
                                ))
                            ) : (
                                <p className="no-data">Visual data arriving soon...</p>
                            )}
                        </div>
                    </div>

                    {/* TOP DISHES */}
                    {highlights.length > 0 && (
                        <div className="highlights-section mt-lg">
                            <h3 className="section-label">Top Recommended Dishes</h3>
                            <div className="dish-chips">
                                {highlights.map((dish, i) => (
                                    <span key={i} className="dish-chip">{dish}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="home-screen">
                <div className="shimmer-container">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="shimmer-card">
                            <div className="shimmer-img"></div>
                            <div className="shimmer-line"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <img src="https://b.zmtcdn.com/webFrontend/6b4d4554747530c3451121d596009a7b1594916894.png" alt="error" className="error-img" />
                <h2>{error}</h2>
                <button className="btn-retry" onClick={() => window.location.reload()}>Try Again</button>
            </div>
        );
    }

    return (
        <div className="home-screen">
            {surpriseMode && (
                <div className="surprise-overlay">
                    <div className="surprise-box">
                        <div className="dice-animation">
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><circle cx="15.5" cy="8.5" r="1.5" /><circle cx="15.5" cy="15.5" r="1.5" /><circle cx="8.5" cy="15.5" r="1.5" /><circle cx="12" cy="12" r="1.5" /></svg>
                        </div>
                        <h2>Selecting Vibe...</h2>
                    </div>
                </div>
            )}

            <header className="zomato-header">
                <div className="header-top">
                    <div className="location-bar" onClick={() => setIsSearchingLocation(!isSearchingLocation)}>
                        <svg viewBox="0 0 20 20" fill="currentColor" className="loc-icon">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="location-text">{locationName}</span>
                        <svg viewBox="0 0 20 20" fill="currentColor" className="arrow-down-icon">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                    {/* FEATURE: Weather Aware Suggestion */}
                    {weather && (
                        <div className={`weather-badge ${weather.state.toLowerCase()}`}>
                            <span className="weather-icon">{weather.state === 'Rainy' ? '🌧️' : '☀️'}</span>
                            <span className="weather-temp">{weather.temp}°C</span>
                        </div>
                    )}
                </div>

                {isSearchingLocation && (
                    <div className="location-search-dropdown fade-in">
                        <input
                            type="text"
                            placeholder="Type a city in India (e.g. Mumbai, Delhi)..."
                            className="location-search-input"
                            autoFocus
                            value={searchCity}
                            onChange={(e) => setSearchCity(e.target.value)}
                            onKeyDown={handleCitySearch}
                        />
                        <p className="search-hint">Press Enter to search</p>
                    </div>
                )}

                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search for food, vibes or hotspots..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleGlobalSearch}
                    />
                    <button className="surprise-btn-mini" onClick={() => fetchPlaces(null, searchQuery)} title="Search">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    </button>
                    <button className="surprise-btn-mini" onClick={handleSurprise} title="Surprise Me">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><circle cx="15.5" cy="8.5" r="1.5" /><circle cx="15.5" cy="15.5" r="1.5" /><circle cx="8.5" cy="15.5" r="1.5" /><circle cx="12" cy="12" r="1.5" /></svg>
                    </button>
                </div>
            </header>

            {/* MOOD SELECTION BAR */}
            <div className="mood-selection-bar">
                <div className="flex-between">
                    <p className="mood-title">Personalize your experience</p>
                    <span className="vibe-blender-tag">Vibe Blender ON</span>
                </div>
                <div className="mood-emojis">
                    {moods.map((m) => (
                        <div
                            key={m.label}
                            className={`mood-item ${userMood === m.emoji ? 'active' : ''}`}
                            onClick={() => {
                                setUserMood(m.emoji);
                                setActiveCategory(m.vibe);
                            }}
                        >
                            <div className="mood-circle premium-3d">
                                <img src={m.icon} alt={m.label} className="mood-3d-icon" />
                            </div>
                            <span className="label premium-label">{m.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="category-tabs premium-tabs">
                {[
                    { id: 'delivery', label: 'Delivery', img: "/assets/icons/delivery.png" },
                    { id: 'dining', label: 'Dining', img: "/assets/icons/dining.png" },
                    { id: 'nightlife', label: 'Nightlife', img: "/assets/icons/nightlife.png" },
                    { id: 'work', label: 'Work', img: "/assets/icons/work.png" },
                    { id: 'calm', label: 'Zen', img: "/assets/icons/zen.png" },
                    { id: 'party', label: 'Party', img: "/assets/icons/party.png" }
                ].map(cat => (
                    <button
                        key={cat.id}
                        className={`cat-tab ${activeCategory === cat.id ? 'active' : ''}`}
                        onClick={() => { setActiveCategory(cat.id); setTopPlaces([]); }}
                    >
                        <div className="cat-img-box">
                            <img src={cat.img} alt={cat.label} />
                        </div>
                        <span style={{ textTransform: 'capitalize' }}>{cat.label}</span>
                    </button>
                ))}
            </div>

            <div className="filter-pill-bar mt-sm container">
                <button
                    className={`filter-pill ${showHiddenGems ? 'active' : ''}`}
                    onClick={() => setShowHiddenGems(!showHiddenGems)}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pill-icon"><path d="M6 3h12l4 6-10 12L2 9z" /><path d="M11 3L8 9l3 12 3-12-3-6z" /><path d="M2 9h20" /></svg>
                    Hidden Gems
                </button>
                <button className="filter-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pill-icon"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                    Live Events
                </button>
                <button className="filter-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pill-icon"><path d="M10 5.172C10 3.782 8.423 2.679 6.5 2.679S3 3.782 3 5.172c0 1.229 1.24 2.25 2.8 2.45V10c0 1.105.895 2 2 2s2-.895 2-2V7.622c1.56-.2 2.8-1.221 2.8-2.45z" /><path d="M21 5.172c0-1.39-1.577-2.493-3.5-2.493s-3.5 1.103-3.5 2.493c0 1.229 1.24 2.25 2.8 2.45V10c0 1.105.895 2 2 2s2-.895 2-2V7.622c1.56-.2 2.8-1.221 2.8-2.45z" /><path d="M12 14c-2.209 0-4 1.791-4 4 0 2.209 1.791 4 4 4s4-1.791 4-4c0-2.209-1.791-4-4-4z" /></svg>
                    Pet Friendly
                </button>
                <button className="filter-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pill-icon"><rect x="1" y="3" width="22" height="13" rx="2" ry="2" /><path d="M7 21h0" /><path d="M17 21h0" /><path d="M9 16l3 5 3-5" /></svg>
                    Easy Parking
                </button>
            </div>

            {/* Content Section */}
            <main className="content-container">
                <div className="flex-between mb-sm">
                    <h2 className="section-title">
                        {activeCategory === 'work' ? 'Top Tech-Work Hangouts' : `Perfect for your ${moods.find(m => m.emoji === userMood)?.label || 'Current'} mood`}
                    </h2>
                    {activeVibe && (
                        <button className="clear-filter" onClick={() => window.location.reload()}>Clear</button>
                    )}
                </div>

                <div className="restaurant-list">
                    {topPlaces
                        .filter(p => !showHiddenGems || p.isHiddenGem)
                        .length > 0 ? topPlaces
                            .filter(p => !showHiddenGems || p.isHiddenGem)
                            .map((place) => (
                                <div key={place.id} className="zomato-card premium" onClick={() => handleRestaurantClick(place)}>
                                    <div className="card-top">
                                        <div className="img-container">
                                            <img
                                                src={place.photos?.length ? getPhotoUrl(place.photos[0].reference) : 'https://b.zmtcdn.com/data/pictures/chains/8/301718/4e90797fe92661570d51fa30a4734ed9.jpg'}
                                                alt={place.name}
                                                className="restaurant-img"
                                                onError={(e) => { e.target.src = 'https://b.zmtcdn.com/data/pictures/chains/8/301718/4e90797fe92661570d51fa30a4734ed9.jpg' }}
                                            />
                                            {place.isHiddenGem && <div className="hidden-gem-badge">Hidden Gem</div>}
                                            {place.pulse && <div className="pulse-card-banner">{place.pulse}</div>}
                                            <div className="vibe-match-badge">{place.vibeMatch}% Ideal</div>
                                            <div className="aesthetic-badge">📸 {place.aestheticScore}</div>
                                            <button
                                                className={`wishlist-btn ${isSaved(place.id) ? 'saved' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    savePlace(place);
                                                }}
                                            >
                                                <svg viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="card-bottom">
                                        <div className="name-row">
                                            <h3 className="res-name">{place.name}</h3>
                                            <div className="res-rating">
                                                <span>{place.rating || 'New'}</span>
                                                <svg viewBox="0 0 20 20" fill="currentColor" className="star-icon">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            </div>
                                        </div>

                                        <div className="smart-metrics-bar">
                                            <span style={{ fontSize: '11px', color: '#696969' }}>{place.reviewCount} Reviews • {place.parking?.status} Parking</span>
                                            <span className={`comp-score ${place.weatherCompatibility || 'Medium'}`}>Weather: {place.weatherCompatibility || 'N/A'} Compatibility</span>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                        <div className="empty-results">
                            <img src="https://b.zmtcdn.com/webFrontend/6b4d4554747530c3451121d596009a7b1594916894.png" alt="none" />
                            <h3>Identifying spots for you...</h3>
                            <button className="zomato-btn-main" onClick={onExploreMore}>
                                Explore All Vibes
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* FLOATING ACTION BUTTON: surprise Me */}
            <button className="fab-surprise" onClick={handleSurprise}>
                <span className="fab-icon">🎲</span>
                <span className="fab-text">Surprise Me</span>
            </button>
        </div>
    );
};

export default Home;
