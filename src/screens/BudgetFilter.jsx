import { useState } from 'react';
import './BudgetFilter.css';

const budgetOptions = [
    { label: 'Any', min: 0, max: 10000 },
    { label: '₹100 - ₹500', min: 100, max: 500 },
    { label: '₹500 - ₹1000', min: 500, max: 1000 },
    { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
    { label: '₹2000+', min: 2000, max: 10000 },
];

const BudgetFilter = ({ selectedVibe, onSubmit, onBack }) => {
    const [selectedOption, setSelectedOption] = useState(budgetOptions[0]);
    const [quickBite, setQuickBite] = useState(false);

    const handleSubmit = () => {
        onSubmit({ min: selectedOption.min, max: selectedOption.max }, quickBite);
    };

    return (
        <div className="budget-screen">
            <header className="zomato-header-mini">
                <div className="flex-align">
                    <button className="back-btn" onClick={onBack}>
                        <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </button>
                    <h1 className="mini-title">Filters for {selectedVibe?.name}</h1>
                </div>
            </header>

            <div className="filter-content container">
                <div className="filter-section">
                    <h2 className="filter-label">Approximate Budget</h2>
                    <div className="budget-chips">
                        {budgetOptions.map((opt, i) => (
                            <button
                                key={i}
                                className={`budget-chip ${selectedOption.label === opt.label ? 'active' : ''}`}
                                onClick={() => setSelectedOption(opt)}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter-section mt-xl">
                    <div className="flex-between">
                        <div>
                            <h2 className="filter-label">Open Now</h2>
                            <p className="filter-desc">Only show places open right now</p>
                        </div>
                        <button
                            className={`z-toggle ${quickBite ? 'active' : ''}`}
                            onClick={() => setQuickBite(!quickBite)}
                        >
                            <span className="toggle-thumb"></span>
                        </button>
                    </div>
                </div>

                <div className="filter-footer">
                    <button className="zomato-btn-main full-width" onClick={handleSubmit}>
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BudgetFilter;
