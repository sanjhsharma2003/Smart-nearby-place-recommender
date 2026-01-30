import express from 'express';

const router = express.Router();

// Vibe configurations
const vibes = [
    {
        id: 'work',
        name: 'Work',
        description: 'Perfect for productivity',
        icon: 'briefcase',
        color: '#D4AF37',
        types: ['cafe', 'library', 'coworking_space'],
        keywords: ['wifi', 'quiet', 'coffee', 'workspace']
    },
    {
        id: 'date',
        name: 'Date',
        description: 'Romantic & intimate',
        icon: 'heart',
        color: '#E8B4B8',
        types: ['restaurant', 'bar', 'night_club'],
        keywords: ['romantic', 'ambiance', 'dinner', 'drinks']
    },
    {
        id: 'quick-bite',
        name: 'Quick Bite',
        description: 'Fast & delicious',
        icon: 'utensils',
        color: '#A0D8B3',
        types: ['fast_food', 'meal_takeaway'],
        keywords: ['quick', 'takeaway', 'fast', 'snack']
    },
    {
        id: 'budget',
        name: 'Budget',
        description: 'Affordable & tasty',
        icon: 'wallet',
        color: '#B8A4E8',
        types: ['restaurant', 'cafe', 'food'],
        keywords: ['affordable', 'cheap', 'value', 'budget-friendly']
    }
];

// GET /api/vibes - Get all available vibes
router.get('/', (req, res) => {
    res.json({
        success: true,
        count: vibes.length,
        vibes: vibes
    });
});

// GET /api/vibes/:id - Get specific vibe details
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const vibe = vibes.find(v => v.id === id);

    if (!vibe) {
        return res.status(404).json({
            error: 'Vibe not found'
        });
    }

    res.json({
        success: true,
        vibe: vibe
    });
});

export default router;
