import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import placesRouter from './routes/places.js';
import vibesRouter from './routes/vibes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);

        if (
            allowedOrigins.includes(origin) ||
            origin.endsWith('.netlify.app')
        ) {
            return callback(null, true);
        }

        return callback(
            new Error('The CORS policy for this site does not allow access from the specified Origin.'),
            false
        );
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/places', placesRouter);
app.use('/api/vibes', vibesRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Smart Nearby Places API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            places: '/api/places',
            vibes: '/api/vibes'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: err.status || 500
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: {
            message: 'Route not found',
            status: 404
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Frontend allowed: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    console.log(`🔑 API Key configured: ${process.env.GOOGLE_MAPS_API_KEY ? 'Yes' : 'No'}`);
});

export default app;
