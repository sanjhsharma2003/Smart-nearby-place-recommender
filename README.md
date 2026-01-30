# 📍 Smart Nearby Place Recommender - Full Stack App

A beautiful **Luminous Minimalist** design app that recommends nearby places based on your vibe. Built with **separate frontend and backend** architecture.

![Design](https://img.shields.io/badge/Design-Luminous_Minimalist-D4AF37?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-React_+_Vite-61DAFB?style=for-the-badge&logo=react)
![Backend](https://img.shields.io/badge/Backend-Node.js_+_Express-339933?style=for-the-badge&logo=node.js)

---

## 🎨 Design System: "Luminous Minimalist"

### Color Palette
```css
Background: #FFFFFF (Pure White)
Surface: #F9FAFB (Subtle Surface)
Accent Gold: #D4AF37
Text Primary: #2D3436 (Slate)
Text Secondary: #636E72
Text Muted: #A0A5AB
Divider: #E0E0E0
```

### Typography
- **Headings**: Playfair Display (Serif) - Weight 600
- **Body**: Manrope (Sans-serif) - Weight 400/500

### Motion
- **Easing**: `cubic-bezier(0.25, 1, 0.5, 1)` (Quart Out)
- **Hover**: Scale 1.05 + brightness shift
- **Animations**: Float, Spring, Slide-up, Fade-in

---

## 🏗️ Project Architecture

```
smart-nearby-place-recommender/
├── backend/                    # Node.js + Express API
│   ├── routes/
│   │   ├── places.js          # Places API endpoints
│   │   └── vibes.js           # Vibes configuration
│   ├── server.js              # Express server
│   ├── package.json
│   └── .env                   # API keys (not in git)
│
├── src/                       # React Frontend
│   ├── screens/
│   │   ├── VibeSelection.jsx      # Screen 1: Mood selection
│   │   ├── BudgetFilter.jsx       # Screen 2: Budget slider
│   │   ├── RecommendationReveal.jsx # Screen 3: Top match
│   │   └── MapView.jsx            # Screen 4: Map & list
│   ├── components/
│   │   └── Navigation.jsx         # Bottom nav bar
│   ├── App.jsx                # Main app with routing
│   ├── index.css              # Design system
│   └── main.jsx               # Entry point
│
└── README.md
```

---

## 🚀 Quick Start

### Step 1: Get Google Maps API Key

#### 1.1 Go to Google Cloud Console
Visit: https://console.cloud.google.com/

#### 1.2 Create a New Project
1. Click "Select a project" dropdown (top bar)
2. Click "NEW PROJECT"
3. Name it: "Smart Nearby Places"
4. Click "CREATE"

#### 1.3 Enable Required APIs
1. Go to **"APIs & Services"** → **"Library"**
2. Search and enable these 3 APIs:
   - ✅ **Maps JavaScript API**
   - ✅ **Places API**
   - ✅ **Geolocation API**

#### 1.4 Create API Key
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"**
3. Select **"API Key"**
4. Copy your API key (looks like: `AIzaSyC...`)

#### 1.5 Secure Your API Key (Recommended)
1. Click on your API key to edit
2. **Application restrictions**:
   - Select "HTTP referrers (web sites)"
   - Add: `http://localhost:5173/*` and `http://localhost:5000/*`
3. **API restrictions**:
   - Select "Restrict key"
   - Choose only: Maps JavaScript API, Places API, Geolocation API
4. Click **SAVE**

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Configure Backend API Key

Edit `backend/.env`:
```env
GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_API_KEY_HERE
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Step 4: Install Frontend Dependencies

```bash
cd ..
npm install
```

### Step 5: Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
You should see: `🚀 Server running on http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
You should see: `Local: http://localhost:5173/`

### Step 6: Open the App

Visit: **http://localhost:5173/**

Grant location permissions when prompted!

---

## 📱 App Screens

### Screen 1: Vibe Selection Home
- **Background**: Animated radial gradient (white → subtle surface)
- **Header**: "What's the vibe today?" (32px, centered)
- **Mood Buttons**: 2x2 grid, circular, glassmorphism
- **Icons**: Fine-line SVGs in slate grey
- **Animation**: Float (up/down 4px) with staggered delays

### Screen 2: Rupee Budget Filters
- **Background**: Static white
- **Budget Slider**:
  - Track: 4px height, #E0E0E0
  - Thumb: 24px circle, gold (#D4AF37), white border
  - Values: ₹100, ₹500, ₹1000, ₹1500, ₹2000+
- **Quick Bite Toggle**: iOS-style pill, gold when active
- **CTA Button**: Full width, rounded (30px), slate grey, pulsates

### Screen 3: Top Recommendation Reveal
- **Entrance**: Card slides from y: 100% to y: 0
- **Card**: 32px border radius, 20px padding
- **Image**: 16:9 ratio, 24px rounded corners
- **Match Badge**: "98% Match" - gold capsule, white text
- **Info Row**: Icons for distance (pin), time (clock), budget (₹)
- **Button**: "Take Me There" with soft gold glow

### Screen 4: Nearby Map View
- **Map**: Placeholder for Google Maps integration
- **Pins**: White circles with slate grey icons, 8px shadow
- **Animation**: Spring (scale 1.0 → 1.3 → 1.0) on click
- **Mini-Card**: 100px height preview at bottom
- **List**: Scrollable list of all places

### Navigation Bar (All Screens)
- **Style**: Fixed bottom, white background
- **Border**: 1px solid #F0F0F0
- **Items**: Discover, Saved, Profile
- **Active State**: Gold icon + small dot underneath

---

## 🔌 API Endpoints

### Backend API (Port 5000)

#### Health Check
```
GET /api/health
```

#### Get All Vibes
```
GET /api/vibes
```

#### Get Nearby Places
```
POST /api/places/nearby
Body: {
  latitude: number,
  longitude: number,
  vibe: string,
  minBudget: number,
  maxBudget: number,
  quickBite: boolean,
  radius: number
}
```

#### Get Photo URL
```
GET /api/places/photo/:reference?maxwidth=400
```

#### Get Place Details
```
GET /api/places/details/:placeId
```

---

## 🎯 Features

### ✅ Implemented
- [x] Separate frontend/backend architecture
- [x] 4 vibe options (Work, Date, Quick Bite, Budget)
- [x] Rupee budget slider (₹100 - ₹2000+)
- [x] Quick Bite toggle (open now filter)
- [x] Real-time geolocation
- [x] Google Places API integration
- [x] Distance calculation (Haversine formula)
- [x] Smart sorting (rating + distance weighted)
- [x] Budget filtering
- [x] Top recommendation reveal
- [x] Place photos from Google
- [x] Map view with places list
- [x] Get directions (opens Google Maps)
- [x] Bottom navigation
- [x] Luminous Minimalist design system
- [x] All specified animations
- [x] Fully responsive

### 🔮 Future Enhancements
- [ ] Actual Google Maps integration in MapView
- [ ] Save favorite places
- [ ] User authentication
- [ ] Place reviews and ratings
- [ ] Share recommendations
- [ ] Custom radius selection
- [ ] More vibe categories
- [ ] Dark mode toggle

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI library
- **Vite 7.3** - Build tool
- **Vanilla CSS** - Styling (no frameworks)
- **Playfair Display + Manrope** - Fonts

### Backend
- **Node.js** - Runtime
- **Express 4.18** - Web framework
- **Axios** - HTTP client
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

### APIs
- **Google Maps JavaScript API** - Maps
- **Google Places API** - Place data
- **Geolocation API** - User location

---

## 🎨 Design Specifications

### Animations
```css
/* Float (Vibe Buttons) */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
}

/* Spring (Map Pins) */
@keyframes spring {
  0% { transform: scale(1); }
  30% { transform: scale(1.3); }
  50% { transform: scale(0.95); }
  70% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Slide Up (Recommendation Card) */
@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Pulse (CTA Button) */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}
```

### Hover States
- **Scale**: 1.05
- **Box Shadow**: Increase spread
- **Brightness**: Subtle shift (filter: brightness(1.05))

---

## 📊 How It Works

### 1. User Flow
```
Vibe Selection → Budget Filter → API Call → Recommendation → Map View
```

### 2. Backend Processing
```javascript
// 1. Receive request with vibe, budget, location
// 2. Map vibe to Google Places types
// 3. Call Google Places API
// 4. Calculate distances (Haversine formula)
// 5. Filter by budget (price level)
// 6. Sort by rating + distance (weighted)
// 7. Return top recommendation + all places
```

### 3. Frontend State Management
```javascript
// App.jsx manages:
- currentScreen (vibe, budget, recommendation, map)
- selectedVibe
- budgetRange
- quickBite
- places[]
- topRecommendation
- userLocation
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Frontend won't start
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### "API Key not configured"
- Check `backend/.env` has correct API key
- Restart backend server after changing .env

### "No places found"
- Ensure you granted location permissions
- Check if you're in an area with businesses
- Try a different vibe
- Verify API key has Places API enabled

### CORS errors
- Ensure backend is running on port 5000
- Check `FRONTEND_URL` in backend/.env matches frontend port

---

## 💰 Google Maps API Pricing

- **Free Tier**: $200 credit per month
- **Places Nearby Search**: $32 per 1000 requests
- **Places Photos**: $7 per 1000 requests
- **With $200 credit**: ~6,250 searches/month FREE

**Tip**: Set up billing alerts in Google Cloud Console!

---

## 📄 License

MIT License - Feel free to use for personal or commercial projects

---

## 🙏 Credits

- **Design System**: Luminous Minimalist
- **Fonts**: Google Fonts (Playfair Display, Manrope)
- **APIs**: Google Maps Platform
- **Icons**: Custom SVG (fine-line style)

---

## 📞 Support

Having issues? Check:
1. Both servers are running (backend:5000, frontend:5173)
2. API key is correctly set in backend/.env
3. All required APIs are enabled in Google Cloud
4. Location permissions are granted
5. You're in an area with nearby businesses

---

**Built with ❤️ using React, Node.js, and Google Maps APIs**

**Enjoy discovering amazing places! 🗺️✨**
