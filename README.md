# nutrient-data

A React-based data visualization and static REST API for nutrient and food information, designed to be hosted on GitHub Pages. This project allows you to maintain structured data in JSON format and automatically generates API endpoints while providing a clean web interface for visualization.

## Project Structure

```
/data/source/          # Raw source data files (add your JSON here)
  nutrients.json       # Array of nutrient objects
  foods.json           # Array of food objects
/api/v1/               # Generated API endpoints (static JSON)
  /nutrients/          
    list.json          # All nutrients
    {id}.json          # Individual nutrient by ID
  /foods/              
    list.json          # All foods
    {id}.json          # Individual food by ID
/src/                  # React source code
  App.jsx
  main.jsx
  index.css
/dist/                 # Built React app (generated)
generate-api.sh        # Script to generate API files
```

## Local Development Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Add your source data** to `/data/source/`:

**nutrients.json** - Array of nutrient objects:
```json
[
  {"id": 1, "name": "Vitamin A", "unit": "mcg"},
  {"id": 2, "name": "Vitamin C", "unit": "mg"}
]
```

**foods.json** - Array of food objects:
```json
[
  {"id": 1, "name": "Apple", "calories": 95},
  {"id": 2, "name": "Banana", "calories": 105}
]
```

3. **Generate API files:**
```bash
./generate-api.sh
```

4. **Run development server:**
```bash
npm run dev
```

Visit `http://localhost:5173` to view the app.

## GitHub Pages Deployment

1. **Update `vite.config.js`** - Change `base` to match your repo name:
```javascript
base: '/your-repo-name/',
```

2. **Build the project:**
```bash
npm run build
```

3. **Copy API files to dist:**
```bash
cp -r api dist/
```

4. **Deploy to GitHub Pages:**

**Option A: Using gh-pages branch**
```bash
npm install -g gh-pages
gh-pages -d dist
```

**Option B: Manual deployment**
- Push `dist/` contents to `gh-pages` branch
- Go to repo Settings → Pages
- Set source to `gh-pages` branch
- Save

5. **Access your site:**
- Visualization: `https://yourusername.github.io/your-repo-name/`
- API: `https://yourusername.github.io/your-repo-name/api/v1/nutrients/list.json`

## API Endpoints

Once deployed, your API will be available at:

- `GET /api/v1/nutrients/list.json` - List all nutrients
- `GET /api/v1/nutrients/{id}.json` - Get specific nutrient
- `GET /api/v1/foods/list.json` - List all foods
- `GET /api/v1/foods/{id}.json` - Get specific food

## Using the API in React Native

```javascript
const API_BASE = 'https://yourusername.github.io/your-repo-name/api/v1';

fetch(`${API_BASE}/nutrients/list.json`)
  .then(res => res.json())
  .then(data => console.log(data));
```

## Requirements

- Node.js & npm
- `jq` command-line JSON processor (install: `brew install jq` on macOS)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `./generate-api.sh` - Generate API files from source data
