import { useState } from 'react';
import './VibeSelection.css';

const discoveryItems = [
    {
        id: 'date',
        name: 'Romantic',
        description: 'Perfect for a special date',
        img: 'https://b.zmtcdn.com/data/o2_assets/30fa0a844f3ba82073e5f78c3f1c01ef1581698218.png',
        color: '#FFF0F3'
    },
    {
        id: 'calm',
        name: 'Calm & Peaceful',
        description: 'Quiet spots to unwind',
        img: 'https://b.zmtcdn.com/data/o2_assets/0107946bda17ca2fa010dd29984954-1581602716.png',
        color: '#F0FFF4'
    },
    {
        id: 'work',
        name: 'Work Friendly',
        description: 'WiFi & comfortable seating',
        img: 'https://b.zmtcdn.com/data/o2_assets/c70911fb2397e805097740e1c2f44bb11581691350.png',
        color: '#F0F7FF'
    },
    {
        id: 'solo',
        name: 'Solo Time',
        description: 'Ideal for me-time',
        img: 'https://b.zmtcdn.com/data/o2_assets/855687dc64a5e06d737dae45b7f6a13b1581698551.png',
        color: '#F5F5F5'
    },
    {
        id: 'family',
        name: 'Family Outing',
        description: 'Kid-friendly & spacious',
        img: 'https://b.zmtcdn.com/data/o2_assets/30fa0a844f3ba82073e5f78c3f1c01ef1581698218.png',
        color: '#FFF9EB'
    },
    {
        id: 'energetic',
        name: 'Energetic',
        description: 'High energy & lively music',
        img: 'https://b.zmtcdn.com/data/o2_assets/855687dc64a5e06d737dae45b7f6a13b1581698551.png',
        color: '#F3E8FF'
    }
];

const VibeSelection = ({ onVibeSelect }) => {
    return (
        <div className="vibe-screen">
            <header className="zomato-header-mini">
                <h1 className="mini-title">Explore by Vibe</h1>
                <p className="mini-subtitle">Find the perfect spot for any occasion</p>
            </header>

            <div className="discovery-grid container">
                {discoveryItems.map((item) => (
                    <div
                        key={item.id}
                        className="discovery-card"
                        style={{ backgroundColor: item.color }}
                        onClick={() => onVibeSelect(item)}
                    >
                        <div className="discovery-info">
                            <h3 className="discovery-name">{item.name}</h3>
                            <p className="discovery-desc">{item.description}</p>
                        </div>
                        <div className="discovery-img-box">
                            <img src={item.img} alt={item.name} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VibeSelection;
