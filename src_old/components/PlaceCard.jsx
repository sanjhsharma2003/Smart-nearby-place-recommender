import React from 'react';
import './PlaceCard.css';

const PlaceCard = ({ place, index }) => {
    const {
        name,
        vicinity,
        rating,
        user_ratings_total,
        opening_hours,
        photos,
        geometry,
        distance,
        price_level
    } = place;

    // Calculate distance (if available)
    const displayDistance = distance
        ? distance < 1000
            ? `${Math.round(distance)}m`
            : `${(distance / 1000).toFixed(1)}km`
        : 'N/A';

    // Get opening status
    const isOpen = opening_hours?.open_now;

    // Get photo URL (using Google Places Photo API)
    const photoUrl = photos && photos[0]
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photos[0].photo_reference}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
        : null;

    // Price level indicator
    const getPriceLevel = (level) => {
        if (!level) return 'N/A';
        return '₹'.repeat(level);
    };

    return (
        <div
            className="place-card"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            {/* Image Section */}
            <div className="place-card-image">
                {photoUrl ? (
                    <img src={photoUrl} alt={name} loading="lazy" />
                ) : (
                    <div className="place-card-placeholder">
                        <span className="placeholder-icon">📍</span>
                    </div>
                )}

                {/* Distance Badge */}
                <div className="place-badge distance-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor" />
                    </svg>
                    <span>{displayDistance}</span>
                </div>

                {/* Open/Closed Badge */}
                {opening_hours && (
                    <div className={`place-badge status-badge ${isOpen ? 'open' : 'closed'}`}>
                        <span className="status-dot"></span>
                        <span>{isOpen ? 'Open' : 'Closed'}</span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="place-card-content">
                <h3 className="place-name">{name}</h3>
                <p className="place-address">{vicinity}</p>

                {/* Rating & Price */}
                <div className="place-meta">
                    {rating && (
                        <div className="place-rating">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                            <span className="rating-value">{rating.toFixed(1)}</span>
                            {user_ratings_total && (
                                <span className="rating-count">({user_ratings_total})</span>
                            )}
                        </div>
                    )}

                    {price_level && (
                        <div className="place-price">
                            <span>{getPriceLevel(price_level)}</span>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <button className="place-card-button">
                    <span>View Details</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* Hover Glow Effect */}
            <div className="place-card-glow"></div>
        </div>
    );
};

export default PlaceCard;
