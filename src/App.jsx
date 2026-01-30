import { useState, useEffect } from 'react';
import Login from './screens/Login';
import Home from './screens/Home';
import VibeSelection from './screens/VibeSelection';
import BudgetFilter from './screens/BudgetFilter';
import RecommendationReveal from './screens/RecommendationReveal';
import MapView from './screens/MapView';
import Saved from './screens/Saved';
import Profile from './screens/Profile';
import Navigation from './components/Navigation';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentScreen, setCurrentScreen] = useState('home'); // home, vibe, budget, recommendation, map, saved, profile
    const [selectedVibe, setSelectedVibe] = useState(null);
    const [budgetRange, setBudgetRange] = useState({ min: 100, max: 2000 });
    const [quickBite, setQuickBite] = useState(false);
    const [places, setPlaces] = useState([]);
    const [topRecommendation, setTopRecommendation] = useState(null);
    const [userLocation, setUserLocation] = useState(null);

    // Check if user is already logged in
    useEffect(() => {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            setCurrentUser(currentUser);
            setIsAuthenticated(true);
        }
    }, []);

    // Handle login
    const handleLogin = (username) => {
        setCurrentUser(username);
        setIsAuthenticated(true);
    };

    const [isSearching, setIsSearching] = useState(false);

    // Handle vibe selection
    const handleVibeSelect = (vibe) => {
        setSelectedVibe(vibe);
        setCurrentScreen('budget');
    };

    // Handle budget filter submission
    const handleBudgetSubmit = async (budget, isQuickBite) => {
        setBudgetRange(budget);
        setQuickBite(isQuickBite);
        setIsSearching(true);

        // Get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    setUserLocation(location);

                    // Fetch places from backend
                    try {
                        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/places/nearby`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                latitude: location.latitude,
                                longitude: location.longitude,
                                vibe: selectedVibe?.id || 'date',
                                minBudget: budget.min,
                                maxBudget: budget.max,
                                quickBite: isQuickBite,
                                radius: 10000 // Increased radius to 10km
                            })
                        });

                        const data = await response.json();

                        if (data.success && data.places.length > 0) {
                            setPlaces(data.places);
                            setTopRecommendation(data.topRecommendation);
                            setCurrentScreen('home');
                        } else {
                            // If no places found with filters, try again with relaxed filters
                            const fallbackResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/places/nearby`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    latitude: location.latitude,
                                    longitude: location.longitude,
                                    vibe: 'date',
                                    radius: 15000
                                })
                            });
                            const fallbackData = await fallbackResponse.json();
                            setPlaces(fallbackData.places || []);
                            setCurrentScreen('home');
                        }
                    } catch (error) {
                        console.error('Error fetching places:', error);
                        setCurrentScreen('home');
                    } finally {
                        setIsSearching(false);
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setIsSearching(false);
                    alert('Please enable location access to find nearby places.');
                },
                { timeout: 10000 }
            );
        } else {
            setIsSearching(false);
            alert('Geolocation is not supported by your browser.');
        }
    };

    // Handle navigation
    const handleNavigate = (screen) => {
        if (screen === 'home') {
            setSelectedVibe(null); // Reset filters on home click
            setPlaces([]); // Let Home fetch its own default places
        }
        setCurrentScreen(screen);
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setIsAuthenticated(false);
        setCurrentUser(null);
        setCurrentScreen('home');
        setSelectedVibe(null);
        setPlaces([]);
    };

    // Render current screen
    const renderScreen = () => {
        switch (currentScreen) {
            case 'home':
                return (
                    <Home
                        onExploreMore={() => setCurrentScreen('vibe')}
                        initialPlaces={places}
                        activeVibe={selectedVibe}
                    />
                );
            case 'vibe':
                return <VibeSelection onVibeSelect={handleVibeSelect} />;
            case 'budget':
                return (
                    <BudgetFilter
                        selectedVibe={selectedVibe}
                        onSubmit={handleBudgetSubmit}
                        onBack={() => setCurrentScreen('vibe')}
                    />
                );
            case 'saved':
                return <Saved />;
            case 'profile':
                return <Profile onLogout={handleLogout} onNavigate={handleNavigate} />;
            default:
                return (
                    <Home
                        onExploreMore={() => setCurrentScreen('vibe')}
                        initialPlaces={places}
                        activeVibe={selectedVibe}
                    />
                );
        }
    };

    // Show login screen if not authenticated
    if (!isAuthenticated) {
        return <Login onLogin={handleLogin} />;
    }

    // Show searching/loading screen
    if (isSearching) {
        return (
            <div className="zomato-searching-screen">
                <div className="discovery-loader">
                    <div className="z-pulse"></div>
                    <img src="https://b.zmtcdn.com/images/zomato_white_logo.png" alt="logo" className="z-logo-mini" />
                </div>
                <h2>Finding the perfect {selectedVibe?.name || 'spot'} for you...</h2>
            </div>
        );
    }

    return (
        <div className="app">
            {renderScreen()}
            {/* Show bottom navigation on main screens */}
            {(currentScreen === 'home' || currentScreen === 'saved' || currentScreen === 'profile') && (
                <Navigation
                    currentScreen={currentScreen}
                    onNavigate={handleNavigate}
                />
            )}
        </div>
    );
}

export default App;
