# Nutrient-Data Project Guidelines

## Architecture Overview

```
/api/                    # Source data (edit here)
  /v1/data/              # Individual food JSON files
  /v1/list.json          # Food items index
  human-daily-needs.json # Daily nutritional reference
  citations.json         # Random citations for header
  statements.json        # Random statements for header
/src/                    # React source (single-file app)
  App.jsx                # All UI logic
  main.jsx               # Entry point
  index.css              # All styles
/public/                 # Dev server static files (auto-generated)
/docs/                   # Production build + API (GitHub Pages)
```

The app is a single-page React application with a static JSON API, deployed to GitHub Pages.

## Code Style

### React/JavaScript
- Functional components with hooks (`useState`, `useEffect`)
- Single-file architecture: all logic in `App.jsx`
- No external state management (local state only)
- Relative fetch paths (`./v1/`, `./statements.json`)
- camelCase for variables and functions
- Template literals for dynamic strings

### CSS
- Plain CSS (no preprocessors or CSS-in-JS)
- BEM-like naming: `.sidebar-item`, `.facts-row`, `.compare-controls`
- CSS custom properties not used (hardcoded colors)
- Flexbox for layouts
- Mobile-first not implemented (desktop-focused)

### Color Palette
- Primary: `#3498db` (blue)
- Hover: `#2980b9` (darker blue)
- Text: `#333`, `#2c3e50`, `#34495e`
- Background: `#f5f5f5`, `white`
- Borders: `#ddd`, `#eee`
- Success/Over: `#2980b9`
- Warning/Under: `#e74c3c`

## Data Schema

### Food Item (`/api/v1/data/{food}.json`)
```json
{
  "foodname": {
    "mainElements": {
      "calories": { "value": 52, "unit": "kcal" },
      "water": { "value": 86, "unit": "g" },
      "protein": { "value": 0.3, "unit": "g" },
      "carbohydrates": { "value": 14, "unit": "g" },
      "sugar": { "value": 10.4, "unit": "g" },
      "fiber": { "value": 2.4, "unit": "g" },
      "fat": { "value": 0.2, "unit": "g" }
    },
    "vitamins": {
      "vitaminC": { "value": 4.6, "unit": "mg" },
      "vitaminK": { "value": 2.2, "unit": "mcg" },
      "vitaminB6": { "value": 0.041, "unit": "mg" },
      "vitaminE": { "value": 0.18, "unit": "mg" },
      "folate": { "value": 3, "unit": "mcg" }
    },
    "microelements": {
      "potassium": { "value": 107, "unit": "mg" },
      "magnesium": { "value": 5, "unit": "mg" },
      "calcium": { "value": 6, "unit": "mg" },
      "phosphorus": { "value": 11, "unit": "mg" },
      "iron": { "value": 0.12, "unit": "mg" },
      "zinc": { "value": 0.04, "unit": "mg" },
      "manganese": { "value": 0.035, "unit": "mg" }
    },
    "sources": [
      { "name": "Source Name", "url": "https://..." }
    ]
  }
}
```

### List Index (`/api/v1/list.json`)
```json
[
  { "name": "apple", "category": "fruits" },
  { "name": "broccoli", "category": "vegetables" }
]
```

Categories: `fruits`, `vegetables`, `grains`, `legumes`, `fermented`, `other`

## Adding New Food Data

1. Create `/api/v1/data/{foodname}.json` following the schema above
2. Add entry to `/api/v1/list.json`
3. Run `npm run build` (or `./generate-api.sh` for data only)
4. Commit `/docs/` changes

Key rules:
- Filename must match the JSON key (e.g., `apple.json` contains `"apple": {...}`)
- All values per 100g serving
- Use `null` for unknown vitamin values
- Include sources for data credibility

## UI Components

### Modes
- **Single View**: Default, shows one food's nutrition facts
- **Compare Mode**: Side-by-side table comparison
- **Combine Mode**: Aggregates nutrients with adjustable servings, optional daily needs comparison
- **Build Recipe**: Create recipes with ingredients, instructions, and nutrition facts; export/share as PNG

### Layout
- Fixed header with random statement/citation
- Left sidebar (250px) with search and food list
- Main content area (scrollable)
- Fixed footer with disclaimer

## Build & Deploy

```bash
npm run dev          # Local development (port 5173)
npm run build        # Build + generate API to /docs
./generate-api.sh    # Copy data files only
```

Deploy: Push `/docs/` to GitHub, enable Pages from `/docs` folder.

## Conventions to Maintain

1. All nutrient data per 100g serving
2. Keep `App.jsx` as single component (no splitting)
3. Maintain nutrition facts label styling (FDA-inspired)
4. Always include data sources
5. Update `list.json` when adding foods
6. Test compare/combine modes after data changes
