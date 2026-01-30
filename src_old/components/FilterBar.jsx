import React from 'react';
import './FilterBar.css';

const FilterBar = ({ sortBy, onSortChange, filterOpen, onFilterChange }) => {
    const sortOptions = [
        { value: 'rating', label: 'Highest Rated', icon: '⭐' },
        { value: 'distance', label: 'Nearest', icon: '📍' },
        { value: 'reviews', label: 'Most Reviewed', icon: '💬' }
    ];

    return (
        <div className="filter-bar">
            <div className="filter-bar-inner">
                {/* Sort Options */}
                <div className="filter-section">
                    <label className="filter-label">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M3 6h18M7 12h10M11 18h2" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Sort by:
                    </label>
                    <div className="sort-buttons">
                        {sortOptions.map((option) => (
                            <button
                                key={option.value}
                                className={`sort-button ${sortBy === option.value ? 'active' : ''}`}
                                onClick={() => onSortChange(option.value)}
                            >
                                <span className="sort-icon">{option.icon}</span>
                                <span>{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filter Toggle */}
                <div className="filter-section">
                    <label className="filter-label">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10" strokeWidth="2" />
                            <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Show:
                    </label>
                    <button
                        className={`filter-toggle ${filterOpen ? 'active' : ''}`}
                        onClick={() => onFilterChange(!filterOpen)}
                    >
                        <span className="toggle-dot"></span>
                        <span>{filterOpen ? 'Open Now' : 'All Places'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
