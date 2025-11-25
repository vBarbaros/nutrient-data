# Project Structure Options

## Option 1: Static Site with Client-Side API
- Single React/vanilla JS app that serves both visualization and "API"
- Data stored as static JSON files in `/data` directory
- Client-side routing handles API-like endpoints (e.g., `/api/nutrients`)
- Fetch returns static JSON files

**Pros:** Simple deployment, no backend needed, fast
**Cons:** Not a true REST API, all data publicly accessible, no dynamic queries

## Option 2: Separate Visualization + Mock API Service
- `/` - Main visualization app (React/HTML)
- `/api` - Separate static JSON endpoints mimicking REST structure
- Use GitHub Actions to generate API response files from source data
- Directory structure like `/api/nutrients/123.json`

**Pros:** Clean separation, feels like real API, cacheable responses
**Cons:** Limited to pre-generated responses, no real-time queries

## Option 3: Hybrid with Service Worker
- React app for visualization
- Service Worker intercepts `/api/*` requests
- Service Worker queries IndexedDB or processes static JSON files
- Returns dynamic responses based on query parameters

**Pros:** True dynamic API behavior, works offline, flexible queries
**Cons:** More complex, service worker limitations, browser compatibility
