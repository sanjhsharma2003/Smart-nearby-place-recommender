import { useState, useEffect } from 'react';
import './RecommendationReveal.css';

const RecommendationReveal = ({ recommendation, onViewMap, onBack }) => {
    const [photoUrl, setPhotoUrl] = useState(null);

    useEffect(() => {
        if (recommendation?.photos && recommendation.photos.length > 0) {
            const reference = recommendation.photos[0].reference;
            fetch(`${import.meta.env.VITE_API_URL}/api/places/photo/${reference}?maxwidth=800`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setPhotoUrl(data.url);
                    }
                })
                .catch(err => console.error('Error loading photo:', err));
        }
    }, [recommendation]);

    if (!recommendation) {
        return (
            <div className="recommendation-reveal screen">
                <div className="container">
                    <div className="no-results">
                        <h2>No places found</h2>
                        <p>Try adjusting your filters or selecting a different vibe</p>
                        <button className="btn-primary" onClick={onBack}>Go Back</button>
                    </div>
                </div>
            </div>
        );
    }

    const matchScore = Math.round(recommendation.rating * 20) || 85;
    const distance = recommendation.distance < 1000
        ? `${Math.round(recommendation.distance)}m`
        : `${(recommendation.distance / 1000).toFixed(1)}km`;

    const estimatedTime = Math.round(recommendation.distance / 1000 * 12); // 12 min per km walking
    const budgetLevel = recommendation.priceLevel && recommendation.priceLevel > 0 ? recommendation.priceLevel : 2;
    const budgetLabels = ['Budget', 'Moderate', 'Expensive', 'Luxury'];
    const budgetText = budgetLabels[budgetLevel - 1] || 'Moderate';

    return (
        <div className="recommendation-reveal screen">
            <div className="container">
                <button className="back-button" onClick={onBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="reveal-content">
                    <h2 className="reveal-title fade-in">Your Perfect Match</h2>

                    <div className="recommendation-card slide-up card-float neon-glow">
                        {/* Match Score Badge */}
                        <div className="match-badge">
                            <span className="match-percentage">{matchScore}%</span>
                            <span className="match-label">Match</span>
                        </div>

                        {/* Place Image */}
                        <div className="place-image">
                            {photoUrl ? (
                                <img src={photoUrl} alt={recommendation.name} />
                            ) : (
                                <div className="image-placeholder">
                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Place Info */}
                        <div className="place-info">
                            <h3 className="place-name">{recommendation.name}</h3>
                            <p className="place-address">{recommendation.address}</p>

                            {/* Info Row */}
                            <div className="info-row">
                                <div className="info-item">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <span>{distance}</span>
                                </div>

                                <div className="info-item">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 6v6l4 2" />
                                    </svg>
                                    <span>{estimatedTime} min</span>
                                </div>

                                <div className="info-item">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>
                                    <span>{budgetText}</span>
                                </div>
                            </div>

                            {/* Rating */}
                            {recommendation.rating && (
                                <div className="rating-section">
                                    <div className="stars">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill={i < Math.round(recommendation.rating) ? 'var(--accent-cyan)' : 'none'}
                                                stroke="var(--accent-cyan)"
                                                strokeWidth="1.5"
                                            >
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="rating-text">
                                        {recommendation.rating.toFixed(1)} ({recommendation.totalRatings} Reviews)
                                    </span>
                                </div>
                            )}

                            {/* CTA Button */}
                            <button className="take-me-button btn-primary elastic-bounce" onClick={onViewMap}>
                                <span>Take Me There</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecommendationReveal;
