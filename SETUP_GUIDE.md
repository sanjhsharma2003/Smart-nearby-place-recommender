# 🚀 Quick Setup Guide

## Step 1: Get Your Google Maps API Key

Before you can use the app, you need a Google Maps API key:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project**
   - Click "Select a project" → "New Project"
   - Give it a name like "Smart Nearby Places"

3. **Enable Required APIs**
   Navigate to "APIs & Services" → "Library" and enable:
   - ✅ Maps JavaScript API
   - ✅ Places API
   - ✅ Geolocation API

4. **Create API Key**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy your API key

5. **Secure Your API Key (Recommended)**
   - Click on your API key to edit it
   - Under "Application restrictions":
     - Select "HTTP referrers"
     - Add: `http://localhost:5173/*`
   - Under "API restrictions":
     - Select "Restrict key"
     - Choose only the 3 APIs listed above

## Step 2: Add API Key to Your App

1. Open the `.env` file in the project root
2. Replace `YOUR_API_KEY_HERE` with your actual API key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyC...your_actual_key_here
   ```
3. Save the file

## Step 3: Restart the Dev Server

If the server is already running, stop it (Ctrl+C) and restart:
```bash
npm run dev
```

## Step 4: Grant Location Permissions

When you open the app in your browser:
1. You'll see a browser prompt asking for location access
2. Click "Allow" to enable location-based recommendations
3. The app will automatically detect your current location

## 🎉 You're All Set!

Now you can:
1. Select a mood (Work, Date, Quick Bite, or Budget)
2. See nearby places with ratings, distance, and hours
3. Sort and filter results
4. Enjoy the beautiful, animated interface!

## ⚠️ Troubleshooting

### "No places found"
- Make sure you're in an area with businesses nearby
- Try a different mood
- Check if your API key is correctly set

### Location not working
- Grant location permissions in your browser
- Make sure you're using HTTPS or localhost
- Try refreshing the page

### API errors
- Verify billing is enabled in Google Cloud Console
- Check that all 3 APIs are enabled
- Ensure your API key has no typos

## 💡 Tips

- **Free Tier**: Google Maps offers $200 free credit per month
- **Quota**: Monitor your API usage in Google Cloud Console
- **Testing**: Use different moods to see varied results
- **Mobile**: The app works great on mobile devices too!

---

Need help? Check the main README.md for more details!
