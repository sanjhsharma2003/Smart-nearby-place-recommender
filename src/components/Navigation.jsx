import './Navigation.css';

const Navigation = ({ currentScreen, onNavigate }) => {
    const navItems = [
        {
            id: 'home',
            label: 'Delivery',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
            )
        },
        {
            id: 'saved',
            label: 'History',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20v-6M9 20v-10M15 20v-2M3 20h18" />
                </svg>
            )
        },
        {
            id: 'profile',
            label: 'Profile',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            )
        }
    ];

    return (
        <nav className="navigation">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    className={`nav-item ${currentScreen === item.id ? 'active' : ''}`}
                    onClick={() => onNavigate(item.id)}
                >
                    <div className="nav-icon">
                        {item.icon}
                    </div>
                    <span className="nav-label">{item.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default Navigation;
