# Smart OTT Bookmarks - Complete Setup Guide

## ✅ What You Get:

### 1. **Manual Entry (DEFAULT MODE)** ✏️
- Enter Title: "Kalyani Song"
- Enter URL: (optional) "https://youtube.com/..."
- If URL is empty → automatically gets first Google search result
- Thumbnail → automatically fetches first image from Google Images

### 2. **Quick Search Mode** 🔍
- Type "KGF song" → searches Google → saves bookmark
- Gets first search result URL
- Gets first Google Image as thumbnail

## 📋 Setup Instructions:

### Step 1: Update Database
Run this SQL in your Supabase SQL Editor:

```sql
ALTER TABLE bookmarks 
ADD COLUMN IF NOT EXISTS thumbnail TEXT;
```

### Step 2: Add API Route
Create file: `app/api/google-image/route.ts`
Copy the contents from `api-google-image-route.ts`

### Step 3: (Optional) Get Google API Keys
For REAL Google Images (not Unsplash):

1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable "Custom Search API"
4. Create credentials (API Key)
5. Go to https://programmablesearchengine.google.com/
6. Create a search engine, get CX ID
7. Create `.env.local` file:

```env
GOOGLE_API_KEY=your_api_key
GOOGLE_CX=your_search_engine_id
```

**Without API keys:** App uses Unsplash (still good quality images)
**With API keys:** App uses actual Google Image search results

### Step 4: Replace Dashboard
Replace your `dashboard.tsx` with `dashboard-correct-order.tsx`

### Step 5: Test!
1. Click "Manual Entry" (default)
2. Type "Kalyani Song"
3. Leave URL empty (or paste one)
4. Click "Add Bookmark"
5. See the thumbnail from Google Images!

## 🎯 How It Works:

### Manual Entry Flow:
```
User types "KGF Song" → 
Calls Google Images API → Gets first image →
If no URL provided → Gets first Google result →
Saves bookmark with thumbnail
```

### Image Priority:
1. Google Images API (if keys provided)
2. Unsplash (fallback, no keys needed)
3. Picsum (final fallback)

## 🌟 Features:

✅ Manual Entry FIRST (default mode)
✅ Quick Search mode (secondary)
✅ Google Images for thumbnails
✅ Auto-fetch first Google result if no URL
✅ Animated starry background (both themes)
✅ Voice input support
✅ Favorite bookmarks
✅ Search/filter bookmarks

## 🚀 Ready to Use!

The app will work immediately with Unsplash images. 
Add Google API keys later if you want actual Google Images.
