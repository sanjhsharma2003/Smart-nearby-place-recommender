import { useState } from 'react';
import './MapView.css';

const MapView = ({ places, userLocation, onBack }) => {
    const [selectedPlace, setSelectedPlace] = useState(null);

    const handlePlaceClick = (place) => {
        setSelectedPlace(place);
    };

    const getDirections = (place) => {
        if (userLocation && place.location) {
            const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${place.location.lat},${place.location.lng}`;
            window.open(url, '_blank');
        }
    };

    return (
        <div className="map-view screen">
            <div className="map-header">
                <button className="back-button" onClick={onBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2>Nearby Places</h2>
            </div>

            {/* Map Container - Placeholder for actual Google Maps */}
            <div className="map-container">
                <div className="map-placeholder">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                    <p>Map View</p>
                    <p className="map-note">Google Maps integration would appear here</p>
                </div>

                {/* Map Pins Overlay */}
                <div className="pins-overlay">
                    {places.slice(0, 10).map((place, index) => (
                        <div
                            key={place.id}
                            className="map-pin spring"
                            style={{
                                top: `${20 + (index % 3) * 25}%`,
                                left: `${20 + (index % 4) * 20}%`,
                                animationDelay: `${index * 0.1}s`
                            }}
                            onClick={() => handlePlaceClick(place)}
                        >
                            <div className="pin-circle">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mini Card Preview */}
            {selectedPlace && (
                <div className="mini-card fade-in">
                    <button className="close-card" onClick={() => setSelectedPlace(null)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="mini-card-content">
                        <h4>{selectedPlace.name}</h4>
                        <p className="mini-address">{selectedPlace.address}</p>

                        <div className="mini-info">
                            <span className="mini-rating">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                {selectedPlace.rating?.toFixed(1) || '0.0'}
                            </span>
                            <span className="mini-distance">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                {selectedPlace.distance < 1000
                                    ? `${Math.round(selectedPlace.distance)}m`
                                    : `${(selectedPlace.distance / 1000).toFixed(1)}km`}
                            </span>
                        </div>

                        <button className="directions-button btn-gold" onClick={() => getDirections(selectedPlace)}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                            <span>Get Directions</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Places List */}
            <div className="places-list">
                <h3>All Places ({places.length})</h3>
                <div className="places-scroll">
                    {places.map((place, index) => (
                        <div
                            key={place.id}
                            className="place-list-item"
                            onClick={() => handlePlaceClick(place)}
                        >
                            <div className="place-number">{index + 1}</div>
                            <div className="place-details">
                                <h4>{place.name}</h4>
                                <p>{place.address}</p>
                                <div className="place-meta">
                                    <span>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                        {place.rating?.toFixed(1) || '0.0'}
                                    </span>
                                    <span>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                        {place.distance < 1000
                                            ? `${Math.round(place.distance)}m`
                                            : `${(place.distance / 1000).toFixed(1)}km`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MapView;
