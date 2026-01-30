import React from 'react';
import './MoodSelector.css';

const moods = [
    {
        id: 'work',
        title: 'Work',
        emoji: '💼',
        description: 'Cafes & Co-working',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        keywords: ['cafe', 'coffee_shop', 'library', 'coworking_space']
    },
    {
        id: 'date',
        title: 'Date',
        emoji: '❤️',
        description: 'Romantic Spots',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        keywords: ['restaurant', 'bar', 'park', 'movie_theater']
    },
    {
        id: 'quick-bite',
        title: 'Quick Bite',
        emoji: '🍔',
        description: 'Fast & Tasty',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        keywords: ['fast_food', 'meal_takeaway', 'food']
    },
    {
        id: 'budget',
        title: 'Budget',
        emoji: '💰',
        description: 'Affordable Eats',
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        keywords: ['restaurant', 'cafe', 'food', 'meal_delivery']
    }
];

const MoodSelector = ({ selectedMood, onMoodSelect }) => {
    return (
        <div className="mood-selector">
            <div className="mood-header">
                <h2 className="mood-title">How are you feeling?</h2>
                <p className="mood-subtitle">Choose your vibe and discover perfect places nearby</p>
            </div>

            <div className="mood-grid">
                {moods.map((mood, index) => (
                    <div
                        key={mood.id}
                        className={`mood-card ${selectedMood === mood.id ? 'active' : ''}`}
                        onClick={() => onMoodSelect(mood)}
                        style={{
                            '--mood-gradient': mood.gradient,
                            animationDelay: `${index * 0.1}s`
                        }}
                    >
                        <div className="mood-card-inner">
                            <div className="mood-emoji">{mood.emoji}</div>
                            <h3 className="mood-card-title">{mood.title}</h3>
                            <p className="mood-card-description">{mood.description}</p>

                            {/* Animated background effect */}
                            <div className="mood-card-bg"></div>

                            {/* Selection indicator */}
                            {selectedMood === mood.id && (
                                <div className="mood-selected-indicator">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M20 6L9 17L4 12"
                                            stroke="white"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MoodSelector;
