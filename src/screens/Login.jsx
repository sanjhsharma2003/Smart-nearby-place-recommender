import { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
    const [isSignup, setIsSignup] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }

        if (isSignup) {
            // Sign up - save to localStorage
            const users = JSON.parse(localStorage.getItem('users') || '{}');

            if (users[username]) {
                setError('Username already exists');
                return;
            }

            users[username] = {
                password,
                createdAt: new Date().toISOString(),
                savedPlaces: []
            };

            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', username);
            onLogin(username);
        } else {
            // Login - check credentials
            const users = JSON.parse(localStorage.getItem('users') || '{}');

            if (!users[username]) {
                setError('User not found');
                return;
            }

            if (users[username].password !== password) {
                setError('Incorrect password');
                return;
            }

            localStorage.setItem('currentUser', username);
            onLogin(username);
        }
    };

    return (
        <div className="login-screen screen">
            <div className="login-container">
                <div className="login-header fade-in">
                    <div className="app-logo">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                    </div>
                    <h1>Smart Places</h1>
                    <p className="tagline">Discover amazing places near you</p>
                </div>

                <div className="login-card slide-up">
                    <h2>{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
                    <p className="login-subtitle">
                        {isSignup ? 'Sign up to save your favorite places' : 'Login to continue'}
                    </p>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                autoComplete="username"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                            />
                        </div>

                        {error && (
                            <div className="error-message">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 8v4M12 16h.01" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <button type="submit" className="btn-primary login-button">
                            <span>{isSignup ? 'Sign Up' : 'Login'}</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>
                            {isSignup ? 'Already have an account?' : "Don't have an account?"}
                            <button className="link-button" onClick={() => {
                                setIsSignup(!isSignup);
                                setError('');
                            }}>
                                {isSignup ? 'Login' : 'Sign Up'}
                            </button>
                        </p>
                    </div>
                </div>

                <div className="login-features">
                    <div className="feature-item fade-in" style={{ animationDelay: '0.2s' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>Find nearby places</span>
                    </div>
                    <div className="feature-item fade-in" style={{ animationDelay: '0.3s' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                        <span>Save favorites</span>
                    </div>
                    <div className="feature-item fade-in" style={{ animationDelay: '0.4s' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span>Get recommendations</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
