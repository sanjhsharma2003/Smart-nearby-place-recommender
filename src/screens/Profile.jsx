import { useState, useEffect } from 'react';
import './Profile.css';

const Profile = ({ onLogout, onNavigate }) => {
    const [userData, setUserData] = useState(null);
    const [savedCount, setSavedCount] = useState(0);

    useEffect(() => {
        const username = localStorage.getItem('currentUser');
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        const user = users[username] || { createdAt: new Date().toISOString() };

        setUserData({ username, ...user });

        const saved = JSON.parse(localStorage.getItem('savedPlaces') || '[]');
        setSavedCount(saved.length);
    }, []);

    if (!userData) return null;

    return (
        <div className="profile-screen">
            <header className="zomato-header-mini no-border">
                <div className="profile-top">
                    <div className="profile-user-info">
                        <h1 className="profile-name">{userData.username}</h1>
                    </div>
                    <div className="profile-img-box">
                        {userData.username?.charAt(0).toUpperCase()}
                    </div>
                </div>
            </header>

            <div className="profile-content">
                <div className="profile-stats-container">
                    <div className="p-stat">
                        <span className="p-stat-val">{savedCount}</span>
                        <span className="p-stat-label">Collections</span>
                    </div>
                    <div className="p-stat">
                        <span className="p-stat-val">
                            {Math.floor((Date.now() - new Date(userData.createdAt)) / (1000 * 60 * 60 * 24))}
                        </span>
                        <span className="p-stat-label">Days Active</span>
                    </div>
                    <div className="p-stat">
                        <span className="p-stat-val">0</span>
                        <span className="p-stat-label">Reviews</span>
                    </div>
                </div>

                <div className="profile-menu shadow-sm mt-md">
                    <div className="menu-item" onClick={() => onNavigate('saved')}>
                        <div className="menu-left">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="menu-icon">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                            </svg>
                            <span>Your Collections</span>
                        </div>
                        <svg viewBox="0 0 20 20" fill="currentColor" className="arrow-icon">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="menu-item" onClick={onLogout}>
                        <div className="menu-left">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="menu-icon danger-icon">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            <span className="danger-text">Logout</span>
                        </div>
                        <svg viewBox="0 0 20 20" fill="currentColor" className="arrow-icon">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
