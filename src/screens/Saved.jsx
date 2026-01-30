import { useState, useEffect } from 'react';
import './Saved.css';

const Saved = () => {
    const [savedPlaces, setSavedPlaces] = useState([]);

    useEffect(() => {
        loadSavedPlaces();
        window.addEventListener('storage', loadSavedPlaces);
        return () => window.removeEventListener('storage', loadSavedPlaces);
    }, []);

    const loadSavedPlaces = () => {
        const saved = JSON.parse(localStorage.getItem('savedPlaces') || '[]');
        setSavedPlaces(saved);
    };

    const removePlace = (placeId) => {
        const saved = JSON.parse(localStorage.getItem('savedPlaces') || '[]');
        const filtered = saved.filter(p => p.id !== placeId);
        localStorage.setItem('savedPlaces', JSON.stringify(filtered));
        setSavedPlaces(filtered);
    };

    const getPhotoUrl = (photoReference) => {
        return `${import.meta.env.VITE_API_URL}/api/places/photo/${photoReference}?maxwidth=400`;
    };

    const getDirections = (place) => {
        if (place.location) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${place.location.lat},${place.location.lng}`;
            window.open(url, '_blank');
        }
    };

    if (savedPlaces.length === 0) {
        return (
            <div className="saved-screen">
                <header className="zomato-header-mini">
                    <h1 className="mini-title">Collections</h1>
                </header>
                <div className="empty-state">
                    <img src="https://b.zmtcdn.com/webFrontend/6b4d4554747530c3451121d596009a7b1594916894.png" alt="empty" className="empty-img" />
                    <h2>Nothing here yet</h2>
                    <p>Save restaurants to see them here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="saved-screen">
            <header className="zomato-header-mini">
                <h1 className="mini-title">Collections</h1>
                <p className="mini-subtitle">{savedPlaces.length} Restaurants</p>
            </header>

            <div className="restaurant-list p-md">
                {savedPlaces.map((place) => (
                    <div key={place.id} className="zomato-card">
                        <div className="card-top">
                            <div className="img-container">
                                <img
                                    src={place.photos?.length ? getPhotoUrl(place.photos[0].reference) : 'https://b.zmtcdn.com/data/pictures/chains/8/301718/4e90797fe92661570d51fa30a4734ed9.jpg'}
                                    alt={place.name}
                                    className="restaurant-img"
                                />
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

                            <p className="cuisine-text muted">{place.address}</p>

                            <div className="actions-row mt-md">
                                <button className="z-btn secondary" onClick={() => getDirections(place)}>
                                    Directions
                                </button>
                                <button className="z-btn danger" onClick={() => removePlace(place.id)}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Saved;
